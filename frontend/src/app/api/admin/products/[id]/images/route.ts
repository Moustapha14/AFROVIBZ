import crypto from 'crypto';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';

import { ImageOptimizer } from '@/lib/utils/imageOptimization';

// Types
interface UploadResponse {
  success: boolean;
  message: string;
  images?: Array<{
    id: string;
    originalName: string;
    optimizedPaths: {
      original: string;
      thumbnail: string;
      medium: string;
      large: string;
      webp: string;
      webpThumbnail: string;
      webpMedium: string;
      webpLarge: string;
    };
    metadata: {
      originalSize: number;
      optimizedSize: number;
      dimensions: { width: number; height: number };
      format: string;
      uploadDate: Date;
      checksum: string;
      displayOrder: number;
    };
    stats: {
      originalSize: number;
      optimizedSize: number;
      compressionRatio: number;
      processingTime: number;
      format: string;
    };
  }>;
  errors?: string[];
}

interface ReorderRequest {
  imageOrder: string[];
}

// Configuration selon les spécifications
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_IMAGES_PER_PRODUCT = 8;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const RATE_LIMIT_UPLOADS = 20; // uploads par minute

// Rate limiting simple (en production, utiliser Redis)
const uploadCounts = new Map<string, { count: number; resetTime: number }>();

/**
 * Vérifie le rate limiting
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userData = uploadCounts.get(ip);

  if (!userData || now > userData.resetTime) {
    uploadCounts.set(ip, { count: 1, resetTime: now + 60000 }); // 1 minute
    return true;
  }

  if (userData.count >= RATE_LIMIT_UPLOADS) {
    return false;
  }

  userData.count++;
  return true;
}

/**
 * Valide et sécurise un fichier
 */
async function validateAndSecureFile(
  file: File,
  index: number
): Promise<{
  isValid: boolean;
  error?: string;
  tempPath?: string;
  suggestions?: string[];
}> {
  try {
    // Vérifier la taille
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `${file.name}: Taille maximale dépassée (${ImageOptimizer.formatFileSize(file.size)}). Maximum: ${ImageOptimizer.formatFileSize(MAX_FILE_SIZE)}`,
      };
    }

    // Vérifier le type MIME
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: `${file.name}: Type de fichier non supporté (${file.type}). Formats acceptés: JPEG, PNG, WebP`,
      };
    }

    // Vérifier l'extension
    const ext = path.extname(file.name).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    if (!allowedExtensions.includes(ext)) {
      return {
        isValid: false,
        error: `${file.name}: Extension non supportée (${ext}). Extensions acceptées: .jpg, .jpeg, .png, .webp`,
      };
    }

    // Créer un fichier temporaire pour validation
    const tempDir = path.join(process.cwd(), 'tmp');
    await mkdir(tempDir, { recursive: true });

    const tempPath = path.join(
      tempDir,
      `temp-${Date.now()}-${index}-${crypto.randomBytes(8).toString('hex')}${ext}`
    );
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await writeFile(tempPath, buffer);

    // Validation approfondie avec Sharp
    const validation = await ImageOptimizer.validateImage(tempPath);

    if (!validation.isValid) {
      await unlink(tempPath);
      return {
        isValid: false,
        error: `${file.name}: ${validation.error}`,
      };
    }

    return {
      isValid: true,
      tempPath,
      suggestions: validation.suggestions,
    };
  } catch (error) {
    return {
      isValid: false,
      error: `${file.name}: Erreur lors de la validation - ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
    };
  }
}

/**
 * POST /api/admin/products/[id]/images
 * Upload de nouvelles images pour un produit
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // TODO: Vérifier l'authentification Super Admin
    // const user = await getCurrentUser();
    // if (!user || user.role !== 'super_admin') {
    //   return NextResponse.json(
    //     { success: false, message: 'Accès non autorisé' },
    //     { status: 403 }
    //   );
    // }

    const { id: productId } = await params;
    if (!productId) {
      return NextResponse.json({ success: false, message: 'ID produit requis' }, { status: 400 });
    }

    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Limite de téléversement dépassée. Maximum 20 uploads par minute.',
        },
        { status: 429 }
      );
    }

    // Vérifier que c'est un FormData
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, message: 'Content-Type invalide' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Aucune image fournie' },
        { status: 400 }
      );
    }

    // Vérifier la limite d'images par produit
    if (files.length > MAX_IMAGES_PER_PRODUCT) {
      return NextResponse.json(
        { success: false, message: `Maximum ${MAX_IMAGES_PER_PRODUCT} images par produit` },
        { status: 400 }
      );
    }

    // Validation et sécurisation des fichiers
    const errors: string[] = [];
    const validFiles: { file: File; tempPath: string; suggestions?: string[] }[] = [];
    let totalSize = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = await validateAndSecureFile(file, i);

      if (!validation.isValid) {
        errors.push(validation.error!);
        continue;
      }

      totalSize += file.size;
      validFiles.push({
        file,
        tempPath: validation.tempPath!,
        suggestions: validation.suggestions,
      });
    }

    // Vérifier la taille totale
    if (totalSize > MAX_TOTAL_SIZE) {
      // Nettoyer les fichiers temporaires
      for (const validFile of validFiles) {
        await unlink(validFile.tempPath);
      }

      return NextResponse.json(
        {
          success: false,
          message: `Taille totale dépassée (${ImageOptimizer.formatFileSize(totalSize)}). Maximum: ${ImageOptimizer.formatFileSize(MAX_TOTAL_SIZE)}`,
        },
        { status: 400 }
      );
    }

    // Traitement des images valides
    const uploadedImages: UploadResponse['images'] = [];
    const tempFiles: string[] = [];

    for (const validFile of validFiles) {
      try {
        const result = await ImageOptimizer.optimizeImage(
          validFile.tempPath,
          productId,
          validFile.file.name
        );

        uploadedImages.push({
          id: result.metadata.id,
          originalName: result.metadata.originalName,
          optimizedPaths: result.paths,
          metadata: result.metadata,
          stats: result.stats,
        });

        tempFiles.push(validFile.tempPath);
      } catch (error) {
        errors.push(
          `${validFile.file.name}: Erreur lors de l'optimisation - ${error instanceof Error ? error.message : 'Erreur inconnue'}`
        );
        await unlink(validFile.tempPath);
      }
    }

    // Nettoyer les fichiers temporaires
    await ImageOptimizer.cleanupTempFiles(tempFiles);

    // Log d'audit (en production, utiliser un système de logging)
    console.log(
      `[AUDIT] Upload d'images pour le produit ${productId}: ${uploadedImages.length} images uploadées, ${errors.length} erreurs`
    );

    return NextResponse.json({
      success: uploadedImages.length > 0,
      message:
        uploadedImages.length > 0
          ? `${uploadedImages.length} image(s) uploadée(s) avec succès`
          : "Aucune image n'a pu être uploadée",
      images: uploadedImages,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Erreur upload images:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/products/[id]/images
 * Récupérer les images d'un produit
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // TODO: Vérifier l'authentification
    const { id: productId } = await params;

    if (!productId) {
      return NextResponse.json({ success: false, message: 'ID produit requis' }, { status: 400 });
    }

    // TODO: Récupérer les images depuis la base de données
    // Pour l'instant, retourner un tableau vide
    return NextResponse.json({
      success: true,
      images: [],
    });
  } catch (error) {
    console.error('Erreur récupération images:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/products/[id]/images
 * Réorganiser les images d'un produit
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // TODO: Vérifier l'authentification Super Admin
    const { id: productId } = await params;

    if (!productId) {
      return NextResponse.json({ success: false, message: 'ID produit requis' }, { status: 400 });
    }

    const body: ReorderRequest = await request.json();

    if (!body.imageOrder || !Array.isArray(body.imageOrder)) {
      return NextResponse.json(
        { success: false, message: 'Ordre des images requis' },
        { status: 400 }
      );
    }

    // TODO: Mettre à jour l'ordre dans la base de données
    console.log(`[AUDIT] Réorganisation des images pour le produit ${productId}:`, body.imageOrder);

    return NextResponse.json({
      success: true,
      message: 'Ordre des images mis à jour avec succès',
    });
  } catch (error) {
    console.error('Erreur réorganisation images:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/products/[id]/images
 * Supprimer une image d'un produit
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Vérifier l'authentification Super Admin
    const { id: productId } = await params;

    if (!productId) {
      return NextResponse.json({ success: false, message: 'ID produit requis' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');

    if (!imageId) {
      return NextResponse.json({ success: false, message: 'ID image requis' }, { status: 400 });
    }

    // TODO: Supprimer l'image de la base de données et du système de fichiers
    console.log(`[AUDIT] Suppression de l'image ${imageId} pour le produit ${productId}`);

    return NextResponse.json({
      success: true,
      message: 'Image supprimée avec succès',
    });
  } catch (error) {
    console.error('Erreur suppression image:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
