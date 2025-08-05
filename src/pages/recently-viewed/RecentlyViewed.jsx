// RecentlyViewed.jsx
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, CheckCircle, Scale, X, Plus, Minus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromProductCart } from '../../redux/slices/CartSlice';

import { removeFromRecentlyViewed } from '../../redux/slices/recentlyViewedSlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { encryptId } from '../../utils/Encyrption';

const RecentlyViewed = () => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get data from Redux store
  const cartItems = useSelector(state => state.cart.items);
  const recentlyViewed = useSelector(state => state.recentlyViewed.items);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleQuantityChange = (product, change) => {
    const cartItem = cartItems.find(item => item.id === product.id && item.size === product.weight);
    const currentQuantity = cartItem ? cartItem.quantity : 0;
    const newQuantity = currentQuantity + change;
    
    if (newQuantity < 1) {
      // Remove from cart if quantity would go below 1
      dispatch(removeFromProductCart({ id: product.id, size: product.weight }));
      toast.info(`${product.title} removed from cart`);
      return;
    }
    
    const operation = change > 0 ? 'increment' : 'decrement';
    
    dispatch(addToCart({
      id: product.id,
      name: product.title,
      price: product.originalPrice,
      quantity: Math.abs(change),
      image: product.image,
      size: product.weight,
      operation
    }));

    if (change > 0) {
      toast.success(`Added ${change} more ${product.title} to cart`);
    } else {
      toast.info(`Removed ${Math.abs(change)} ${product.title} from cart`);
    }
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    
    dispatch(addToCart({
      id: product.id,
      name: product.title,
      price: product.originalPrice,
      quantity: 1,
      image: product.image,
      size: product.weight || 'Standard',
      operation: 'increment',
      mrp:product.price,
    }));

    toast.success(`${product.title} added to cart`);
  };

  const handleRemoveItem = (productId, e) => {
    e.stopPropagation();
    dispatch(removeFromRecentlyViewed(productId));
    toast.success('Item removed from recently viewed');
  };

  const handleCardClick = (productId) => {
    const encryptedId = encryptId(productId);
    navigate(`/product-details/${encodeURIComponent(encryptedId)}`);
  };

  if (recentlyViewed.length === 0) {
    return (
      <div className="w-full py-8 ">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl md:text-2xl font-medium text-gray-900 mb-4">
            Recently Viewed
          </h2>
          <div className="text-center py-8 text-gray-500">
            You haven't viewed any products recently
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 ">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-medium text-gray-900">
            Recently Viewed
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!showLeftArrow}
              className={`p-1 rounded-full border border-gray-200 ${showLeftArrow ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!showRightArrow}
              className={`p-1 rounded-full border border-gray-200 ${showRightArrow ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="relative overflow-x-auto whitespace-nowrap pb-6 custom-scroll scrollbar-hide"
        >
          <div className="inline-flex space-x-4">
            {recentlyViewed.map((product) => {
              const cartItem = cartItems.find(item => item.id === product.id && item.size === product.weight);
              const isInCart = Boolean(cartItem);
              const currentCartQuantity = cartItem ? cartItem.quantity : 0;
              
              const discountPercent = product.price && product.originalPrice ? 
                Math.round(((product.price - product.originalPrice) / product.price) * 100) : 0;

              return (
                <div
                  key={product.id}
                  className="w-48 sm:w-56 md:w-64 flex-shrink-0 bg-white rounded-md border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden group relative h-full flex flex-col"
                >
                  {/* Close button to remove item */}
                  <button
                    onClick={(e) => handleRemoveItem(product.id, e)}
                    className="absolute top-2 right-2 z-20 p-1 bg-white/80 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-500 transition-colors"
                    aria-label="Remove from recently viewed"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div 
                    className="relative overflow-hidden bg-gray-50 aspect-square cursor-pointer flex-shrink-0"
                    onClick={() => handleCardClick(product.id)}
                  >
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {product.onSale && (
                      <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded text-xs font-semibold bg-green-400 text-black">
                        {discountPercent}% OFF
                      </div>
                    )}
                  </div>
                
                  <div className="p-4 flex flex-col flex-grow border-t border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      {product.category || 'Category'}
                    </p>
                    
                    <h3 
                      className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight mb-2 cursor-pointer"
                      onClick={() => handleCardClick(product.id)}
                    >
                      {product.title}
                    </h3>
                    
                    <div className="flex flex-wrap justify-between items-center mt-auto mb-3 gap-2">
                      {product.weight && (
                        <span className="text-xs text-gray-500 font-medium flex-shrink-0">
                          {product.weight}
                        </span>
                      )}
                      <div className="flex-shrink-0">
                        {product.price === product.originalPrice ? (
                          <span className="text-lg font-bold text-gray-900">
                            ₹{product.price}
                          </span>
                        ) : (
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm sm:text-lg font-bold text-gray-900">
                              ₹{product.originalPrice}
                            </span>
                            {product.price && (
                              <span className="text-xs sm:text-sm text-gray-500 line-through">
                                ₹{product.price}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between gap-2 border-t border-gray-200 pt-3">
                      {isInCart ? (
                        <div className="flex-1 p-1 flex items-center justify-between border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(product, -1);
                            }}
                            className="p-1 hover:bg-gray-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3 mx-auto" />
                          </button>
                          <span className={`px-2 text-center min-w-[1.5rem] text-xs ${
                            isInCart ? 'bg-green-100 text-green-800 font-medium' : ''
                          }`}>
                            {currentCartQuantity}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(product, 1);
                            }}
                            className="p-1 hover:bg-gray-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3 mx-auto" />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={(e) => handleAddToCart(product, e)}
                          className="flex-1 flex items-center justify-center gap-1 p-2 rounded-lg border border-gray-200 bg-blue-900 hover:bg-blue-600 text-white transition-colors duration-200 cursor-pointer"
                        >
                          <ShoppingCart className="w-4 h-4 min-w-[16px]" />
                          <span className="text-xs font-medium truncate">Cart</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;