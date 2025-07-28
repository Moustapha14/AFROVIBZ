import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { toast } from 'react-hot-toast';

interface UseWishlistReturn {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  loading: boolean;
}

export function useWishlist(): UseWishlistReturn {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les favoris depuis le localStorage au montage
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('afrovibz-wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sauvegarder les favoris dans le localStorage à chaque changement
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('afrovibz-wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, loading]);

  const addToWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        toast.error('Ce produit est déjà dans vos favoris');
        return prev;
      }
      toast.success(`${product.name} ajouté aux favoris`);
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => {
      const product = prev.find(p => p.id === productId);
      if (product) {
        toast.success(`${product.name} retiré des favoris`);
      }
      return prev.filter(p => p.id !== productId);
    });
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some(p => p.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    toast.success('Liste de favoris vidée');
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    loading
  };
} 