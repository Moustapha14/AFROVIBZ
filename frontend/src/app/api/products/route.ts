import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types';
import { products as mockProducts } from '@/lib/data/products';

// Stockage temporaire des produits (en production, ce serait une base de données)
let products: Product[] = [...mockProducts];

// GET - Récupérer tous les produits (pour la page "Nos Produits")
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'newest';

    // Filtrer les produits actifs seulement (pour la page publique)
    let filteredProducts = products.filter(product => product.isActive);

    // Filtrer par catégorie
    if (category) {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    // Filtrer par recherche
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Trier les produits
    switch (sortBy) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Garder l'ordre original
        break;
    }

    // Pagination
    const total = filteredProducts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return NextResponse.json({
      products: paginatedProducts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Erreur GET /api/products:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau produit (SuperAdmin)
export async function POST(request: NextRequest) {
  try {
    // TODO: Vérifier l'authentification SuperAdmin
    // const user = await getCurrentUser(request);
    // if (!user || user.role !== 'super_admin') {
    //   return NextResponse.json(
    //     { error: 'Accès non autorisé' },
    //     { status: 403 }
    //   );
    // }

    const productData = await request.json();

    // Validation des données
    if (!productData.name || !productData.price || !productData.category) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Créer le nouveau produit
    const newProduct: Product = {
      id: Date.now().toString(),
      name: productData.name,
      description: productData.description || '',
      price: productData.price,
      originalPrice: productData.originalPrice,
      category: productData.category,
      subcategory: productData.subcategory,
      images: productData.images || [],
      sizes: productData.sizes || [],
      colors: productData.colors || [],
      stock: productData.stock || 0,
      tags: productData.tags || [],
      isActive: productData.isActive !== false, // Par défaut actif
      rating: 0,
      reviews: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Ajouter à la liste des produits
    products.push(newProduct);

    // Log pour audit
    console.log(`Nouveau produit créé: ${newProduct.name} (ID: ${newProduct.id})`);

    return NextResponse.json({
      product: newProduct,
      success: true,
      message: 'Produit créé avec succès'
    });

  } catch (error) {
    console.error('Erreur POST /api/products:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 