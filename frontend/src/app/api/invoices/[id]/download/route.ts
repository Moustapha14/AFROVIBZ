import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Mock function pour générer un PDF (en production, utilisez jsPDF ou react-pdf)
async function generateInvoicePDF(invoiceId: string, invoiceData: any): Promise<Buffer> {
  // Simulation de génération PDF
  const pdfContent = `
    FACTURE AFRO🗼VIBZ
    ===================
    
    Numéro: ${invoiceId}
    Date: ${new Date().toLocaleDateString('fr-FR')}
    
    Client: ${invoiceData.customerName}
    Email: ${invoiceData.customerEmail}
    
    Articles:
    ${invoiceData.items
      .map((item: any) => `${item.name} - Qté: ${item.quantity} - Prix: ${item.price} FCFA`)
      .join('\n')}
    
    Total: ${invoiceData.amount} FCFA
    
    Merci pour votre confiance !
    AFRO🗼VIBZ - Mode Africaine Moderne & Tech
  `;

  // Simuler un délai de génération
  await new Promise(resolve => setTimeout(resolve, 1000));

  return Buffer.from(pdfContent, 'utf-8');
}

// Fonction pour vérifier l'authentification
async function verifyAuth(
  request: NextRequest
): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    const headersList = await headers();
    const authorization = headersList.get('authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return { success: false, error: "Token d'authentification manquant" };
    }

    const token = authorization.substring(7);

    // En production, vérifiez le token JWT ici
    // Pour la démo, on simule une vérification
    if (!token || token === 'invalid') {
      return { success: false, error: 'Token invalide' };
    }

    // Simuler un utilisateur authentifié
    return {
      success: true,
      user: {
        id: '1',
        role: 'admin',
        email: 'admin@afrovibz.ga',
      },
    };
  } catch (error) {
    return { success: false, error: "Erreur d'authentification" };
  }
}

// Mock data pour les factures
const mockInvoices = {
  'INV-001': {
    id: 'INV-001',
    orderId: 'ORD-001',
    customerName: 'Marie Nguema',
    customerEmail: 'marie@example.com',
    amount: 45000,
    status: 'paid',
    items: [
      { name: 'Robe Africaine Élégante', quantity: 1, price: 25000 },
      { name: 'Chemise Wax Traditionnelle', quantity: 1, price: 20000 },
    ],
  },
  'INV-002': {
    id: 'INV-002',
    orderId: 'ORD-002',
    customerName: 'Pierre Mba',
    customerEmail: 'pierre@example.com',
    amount: 850000,
    status: 'pending',
    items: [{ name: 'iPhone 15 Pro Max', quantity: 1, price: 850000 }],
  },
  'INV-003': {
    id: 'INV-003',
    orderId: 'ORD-003',
    customerName: 'Sophie Ondo',
    customerEmail: 'sophie@example.com',
    amount: 1200000,
    status: 'overdue',
    items: [{ name: 'MacBook Air M2', quantity: 1, price: 1200000 }],
  },
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Vérifier l'authentification
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error || 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    // Valider l'ID de facture
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID de facture invalide' }, { status: 400 });
    }

    // Récupérer les données de la facture
    const invoiceData = mockInvoices[id as keyof typeof mockInvoices];
    if (!invoiceData) {
      return NextResponse.json({ error: 'Facture non trouvée' }, { status: 404 });
    }

    // Vérifier les permissions (seuls les admins peuvent télécharger toutes les factures)
    if (authResult.user?.role !== 'admin' && authResult.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 });
    }

    // Générer le PDF
    const pdfBuffer = await generateInvoicePDF(id, invoiceData);

    // Retourner le fichier PDF
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="facture-${id}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement de la facture:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

// Rate limiting middleware (simulation)
function checkRateLimit(request: NextRequest): boolean {
  // En production, implémentez un vrai rate limiting
  // Par exemple avec Redis ou une base de données
  return true;
}

// Validation des paramètres
function validateParams(params: any): { valid: boolean; error?: string } {
  if (!params.id || typeof params.id !== 'string') {
    return { valid: false, error: 'ID de facture invalide' };
  }

  if (params.id.length < 3 || params.id.length > 50) {
    return { valid: false, error: 'ID de facture trop court ou trop long' };
  }

  return { valid: true };
}
