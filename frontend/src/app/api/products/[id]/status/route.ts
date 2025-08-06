import { NextRequest, NextResponse } from 'next/server';

import { products as mockProducts } from '@/lib/data/products';
import { Product } from '@/types';

// Stockage temporaire des produits (en production, ce serait une base de données)
const products: Product[] = [...mockProducts];

// PATCH - Activer/Désactiver un produit (SuperAdmin)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // TODO: Vérifier l'authentification SuperAdmin
    const { isActive } = await request.json();

    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }

    // Mettre à jour le statut du produit
    const updatedProduct: Product = {
      ...products[productIndex],
      isActive,
      updatedAt: new Date(),
    };

    products[productIndex] = updatedProduct;

    // Log pour audit
    console.log(
      `Statut du produit mis à jour: ${updatedProduct.name} (ID: ${updatedProduct.id}) - Actif: ${isActive}`
    );

    return NextResponse.json({
      product: updatedProduct,
      success: true,
      message: `Produit ${isActive ? 'activé' : 'désactivé'} avec succès`,
    });
  } catch (error) {
    console.error('Erreur PATCH /api/products/[id]/status:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
