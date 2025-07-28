import { Product } from '@/types';

// Interface pour les réponses API
export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductResponse {
  product: Product;
  success: boolean;
  message: string;
}

// Service pour gérer les produits
export class ProductsService {
  private static baseUrl = '/api/products';

  // Récupérer tous les produits (pour la page "Nos Produits")
  static async getAllProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
  }): Promise<ProductsResponse> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.category) searchParams.append('category', params.category);
      if (params?.search) searchParams.append('search', params.search);
      if (params?.sortBy) searchParams.append('sortBy', params.sortBy);

      const response = await fetch(`${this.baseUrl}?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des produits');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur ProductsService.getAllProducts:', error);
      throw error;
    }
  }

  // Récupérer un produit par ID
  static async getProductById(id: string): Promise<Product> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      
      if (!response.ok) {
        throw new Error('Produit non trouvé');
      }

      const data = await response.json();
      return data.product;
    } catch (error) {
      console.error('Erreur ProductsService.getProductById:', error);
      throw error;
    }
  }

  // Créer un nouveau produit (SuperAdmin)
  static async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductResponse> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du produit');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur ProductsService.createProduct:', error);
      throw error;
    }
  }

  // Mettre à jour un produit (SuperAdmin)
  static async updateProduct(id: string, productData: Partial<Product>): Promise<ProductResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du produit');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur ProductsService.updateProduct:', error);
      throw error;
    }
  }

  // Supprimer un produit (SuperAdmin)
  static async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du produit');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur ProductsService.deleteProduct:', error);
      throw error;
    }
  }

  // Activer/Désactiver un produit (SuperAdmin)
  static async toggleProductStatus(id: string, isActive: boolean): Promise<ProductResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur ProductsService.toggleProductStatus:', error);
      throw error;
    }
  }

  // Récupérer les produits par catégorie
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/category/${category}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des produits par catégorie');
      }

      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error('Erreur ProductsService.getProductsByCategory:', error);
      throw error;
    }
  }

  // Rechercher des produits
  static async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }

      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error('Erreur ProductsService.searchProducts:', error);
      throw error;
    }
  }
} 