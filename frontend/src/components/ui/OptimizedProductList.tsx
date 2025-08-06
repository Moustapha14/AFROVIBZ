import Image from 'next/image';
import React, { useMemo } from 'react';

import { Button } from '@/components/ui/Button';
import { useCart } from '@/lib/hooks/useCart';
import { useDebounce, useMemoizedValue, useStableCallback } from '@/lib/hooks/usePerformance';
import { useWishlist } from '@/lib/hooks/useWishlist';
import { Product } from '@/types';

interface OptimizedProductListProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
  className?: string;
}

// Composant de produit individuel optimisé
const ProductItem = React.memo<{
  product: Product;
  onProductClick?: (product: Product) => void;
}>(({ product, onProductClick }) => {
  const { addToCart, getCartCount } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const cartCount = getCartCount();
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = useStableCallback(() => {
    addToCart(product, 1, product.sizes[0] || 'M', product.colors[0]?.name || 'default');
  });

  const handleWishlistToggle = useStableCallback(() => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  });

  const handleProductClick = useStableCallback(() => {
    onProductClick?.(product);
  });

  const discountedPrice = useMemoizedValue(() => {
    return product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice
      : null;
  }, [product.originalPrice, product.price]);

  return (
    <div className='group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden'>
      <div className='aspect-square relative overflow-hidden'>
        <Image
          src={product.images[0] || '/images/placeholder.jpg'}
          alt={product.name}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-300'
          sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
          priority={false}
        />
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
            isWishlisted
              ? 'bg-red-500 text-white'
              : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
        >
          <svg
            className='w-4 h-4'
            fill={isWishlisted ? 'currentColor' : 'none'}
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
            />
          </svg>
        </button>
      </div>

      <div className='p-4'>
        <h3
          className='text-sm font-medium text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors'
          onClick={handleProductClick}
        >
          {product.name}
        </h3>

        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center space-x-2'>
            <span className='text-lg font-bold text-gray-900'>
              {product.price.toLocaleString('fr-FR')} FCFA
            </span>
            {discountedPrice && (
              <span className='text-sm text-gray-500 line-through'>
                {discountedPrice.toLocaleString('fr-FR')} FCFA
              </span>
            )}
          </div>

          <div className='flex items-center space-x-1'>
            <svg className='w-4 h-4 text-yellow-400' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
            </svg>
            <span className='text-sm text-gray-600'>{product.rating}</span>
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          variant='primary'
          size='sm'
          fullWidth
          className='group-hover:bg-blue-600'
        >
          {cartCount > 0 ? `Ajouté (${cartCount})` : 'Ajouter au panier'}
        </Button>
      </div>
    </div>
  );
});

ProductItem.displayName = 'ProductItem';

// Composant principal optimisé
const OptimizedProductList = React.memo<OptimizedProductListProps>(
  ({ products, onProductClick, className = '' }) => {
    const memoizedProducts = useMemoizedValue(() => products, [products]);

    return (
      <div
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${className}`}
      >
        {memoizedProducts.map(product => (
          <ProductItem key={product.id} product={product} onProductClick={onProductClick} />
        ))}
      </div>
    );
  }
);

OptimizedProductList.displayName = 'OptimizedProductList';

export { OptimizedProductList };
