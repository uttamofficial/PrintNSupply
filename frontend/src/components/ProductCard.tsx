import { Product } from '../types';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-blue-100">
      <div 
        onClick={() => onViewDetails(product)}
        className="cursor-pointer"
      >
        {imageError ? (
          <div className="w-full h-24 sm:h-28 md:h-32 lg:h-36 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-1">📦</div>
              <p className="text-gray-600 font-medium text-[10px] sm:text-xs px-2">{product.name}</p>
            </div>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-24 sm:h-28 md:h-32 lg:h-36 object-cover hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
        )}
        <div className="p-2 sm:p-2.5 md:p-3">
          <h3 className="font-semibold text-xs sm:text-sm hover:text-blue-600 transition-colors line-clamp-1">{product.name}</h3>
          <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5 line-clamp-2">{product.description}</p>
          <div className="mt-1.5 sm:mt-2">
            <span className="font-bold text-sm sm:text-base text-blue-600">₹{product.price.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
      <div className="px-2 pb-2 sm:px-2.5 sm:pb-2.5 md:px-3 md:pb-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="w-full px-2 py-1.5 sm:px-2.5 sm:py-2 md:px-3 md:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md text-xs sm:text-sm font-semibold"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;