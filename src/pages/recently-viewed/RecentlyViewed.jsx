// RecentlyViewed.jsx
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, CheckCircle, Scale, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/CartSlice';
import { addToCompare, removeFromCompare } from '../../redux/slices/compareSlice';
import { removeFromRecentlyViewed } from '../../redux/slices/recentlyViewedSlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { encryptId } from '../../utils/Encyrption';

const RecentlyViewed = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get data from Redux store
  const cartItems = useSelector(state => state.cart.items);
  const compareItems = useSelector(state => state.compare.items);
  const recentlyViewed = useSelector(state => state.recentlyViewed.items);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    
    const isInCart = cartItems.some(item => item.id === product.id);
    if (isInCart) return;

    const cartItem = {
      id: product.id,
      name: product.title,
      price: product.originalPrice,
      quantity: 1,
      image: product.image,
      size: product.weight || 'Standard'
    };

    dispatch(addToCart(cartItem));
    toast.success(`${product.title} added to cart`);
  };

  const handleCompareToggle = (product, e) => {
    e.stopPropagation();
    
    const isInCompare = compareItems.some(item => item.id === product.id);
    
    if (isInCompare) {
      dispatch(removeFromCompare(product.id));
      toast.info(`${product.title} removed from compare`);
    } else {
      if (compareItems.length >= 3) {
        toast.warning('You can compare maximum 3 products');
        return;
      }
      
      const compareItem = {
        id: product.id,
        name: product.title,
        image: product.image,
        price: product.originalPrice,
        category: product.category,
        weight: product.weight,
        rating: product.rating,
      };
      
      dispatch(addToCompare(compareItem));
      toast.success(`${product.title} added to compare`);
    }
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
              const isInCart = cartItems.some(item => item.id === product.id);
              const isInCompare = compareItems.some(item => item.id === product.id);
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
                    <div className="absolute top-2 right-10 z-10">
                      <button 
                        onClick={(e) => handleCompareToggle(product, e)}
                        className={`p-1 cursor-pointer rounded-full ${isInCompare ? 'bg-blue-600 text-black' : 'bg-white text-red-500'} shadow-sm border border-gray-200 hover:bg-blue-50 transition-colors`}
                        aria-label="Compare"
                      >
                        <Scale size={16} />
                      </button>
                    </div>
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
                      <button 
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={isInCart}
                        className={`flex-1 flex items-center justify-center gap-1 p-2 rounded-lg border border-gray-200 transition-colors duration-200 ${
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
                        <span className="text-xs font-medium truncate">
                          {isInCart ? 'Added' : 'Cart'}
                        </span>
                      </button>
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