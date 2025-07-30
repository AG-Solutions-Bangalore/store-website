import React, { useState } from 'react';
import { ShoppingCart, Eye, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../redux/slices/CartSlice';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { encryptId } from '../../utils/Encyrption';

const ProductCard = ({ 
  id, 
  image, 
  hoverImage,
  title, 
  category, 
  price, 
  originalPrice, 
  rating = 0, 
  weight,
  onSale = false,
  isNew = false,
  onViewProduct
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const isInCart = cartItems.some(item => item.id === id);

  const handleViewProduct = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onViewProduct) {
      onViewProduct();
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); 
    e.preventDefault();

    if (isInCart) return;

    const cartItem = {
      id,
      name: title,
      price: originalPrice,
      quantity: 1,
      image,
      size: weight,
    };

    dispatch(addToCart(cartItem));
    toast.success(`${title} added to cart`);
  };

  const handleCardClick = (e) => {
   
    if (!e.target.closest('button')) {
      const encryptedId = encryptId(id);
      navigate(`/product-details/${encodeURIComponent(encryptedId)}`);
    }
  };

  const discountPercent = Math.round(((price - originalPrice) / price) * 100);

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-md border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden group relative h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {(onSale || isNew) && (
        <div className={`absolute top-2 left-2 z-10 px-2 py-1 rounded text-xs font-semibold ${
          onSale ? 'bg-green-400 text-black' : ''
        }`}>
          {onSale ? `${discountPercent}% OFF` : ''}
        </div>
      )}
    
      <div className="relative overflow-hidden bg-gray-50 aspect-square cursor-pointer flex-shrink-0">
        <img 
          src={isHovered && hoverImage ? hoverImage : image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
    
      <div className="p-4 flex flex-col flex-grow border-t border-gray-200">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {category}
        </p>
        
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight mb-2">
          {title}
        </h3>
        
        <div className="flex flex-wrap justify-between items-center mt-auto mb-3 gap-2">
          {weight && (
            <span className="text-xs text-gray-500 font-medium flex-shrink-0">
              {weight}
            </span>
          )}
          <div className="flex-shrink-0">
            {price === originalPrice ? (
              <span className="text-lg font-bold text-gray-900">
                &#8377;{price}
              </span>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-sm sm:text-lg font-bold text-gray-900">
                  &#8377;{originalPrice}
                </span>
                {price && (
                  <span className="text-xs sm:text-sm text-gray-500 line-through">
                    &#8377;{price}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-gray-200 pt-3">
          <button 
            onClick={handleViewProduct}
        
            className="flex items-center justify-center gap-1 p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 transition-colors duration-200 w-full"
          >
            <Eye className="w-4 h-4 min-w-[16px] text-gray-900" />
            <span className="hidden sm:block text-xs font-medium truncate">View</span>
          </button>
          <button 
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`flex items-center justify-center gap-1 p-2 rounded-lg border border-gray-200 transition-colors duration-200 w-full ${
            isInCart 
              ? 'bg-green-700 hover:bg-green-500 text-white cursor-not-allowed' 
              : 'bg-blue-400 hover:bg-blue-600 hover:text-white cursor-pointer'
          }`}
          >
          {isInCart ? (
            <CheckCircle className="w-4 h-4 min-w-[16px]" />
          ) : (
            <ShoppingCart className="w-4 h-4 min-w-[16px]" />
          )}
            <span className="text-xs hidden sm:block font-medium truncate">Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;