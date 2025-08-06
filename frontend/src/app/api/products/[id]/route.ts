import { NextRequest, NextResponse } from 'next/server';

import { products as mockProducts } from '@/lib/data/products';
import { Product } from '@/types';

// Stockage temporaire des produits (en production, ce serait une base de données)
const products: Product[] = [...mockProducts];

// GET - Récupérer un produit par ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const product = products.find(p => p.id === id);

    if (!product) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }

    return NextResponse.json({
      product,
      success: true,
    });
  } catch (error) {
    console.error('Erreur GET /api/products/[id]:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

// PUT - Mettre à jour un produit (SuperAdmin)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // TODO: Vérifier l'authentification SuperAdmin
    const productData = await request.json();

    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }

    // Mettre à jour le produit
    const updatedProduct: Product = {
      ...products[productIndex],
      ...productData,
      updatedAt: new Date(),
    };

    products[productIndex] = updatedProduct;

    // Log pour audit
    console.log(`Produit mis à jour: ${updatedProduct.name} (ID: ${updatedProduct.id})`);

    return NextResponse.json({
      product: updatedProduct,
      success: true,
      message: 'Produit mis à jour avec succès',
    });
  } catch (error) {
    console.error('Erreur PUT /api/products/[id]:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

// DELETE - Supprimer un produit (SuperAdmin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // TODO: Vérifier l'authentification SuperAdmin
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }

    const deletedProduct = products[productIndex];
    products.splice(productIndex, 1);

    // Log pour audit
    console.log(`Produit supprimé: ${deletedProduct.name} (ID: ${deletedProduct.id})`);

    return NextResponse.json({
      success: true,
      message: 'Produit supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur DELETE /api/products/[id]:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
