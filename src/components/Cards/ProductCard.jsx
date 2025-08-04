import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye, Scale, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addToCart, removeFromProductCart } from '../../redux/slices/CartSlice';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { encryptId } from '../../utils/Encyrption';
import { addToCompare, removeFromCompare } from '../../redux/slices/compareSlice';

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
  const [localQuantity, setLocalQuantity] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const compareItems = useSelector(state => state.compare.items);
  
  const cartItem = cartItems.find(item => item.id === id && item.size === weight);
  const isInCart = Boolean(cartItem);
  const currentCartQuantity = cartItem ? cartItem.quantity : 0;
  const isInCompare = compareItems.some(item => item.id === id);

  // Sync local quantity with cart
  useEffect(() => {
    if (isInCart) {
      setLocalQuantity(currentCartQuantity);
    } else {
      setLocalQuantity(1);
    }
  }, [isInCart, currentCartQuantity]);

  const handleViewProduct = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onViewProduct) {
      onViewProduct();
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = localQuantity + change;
    
    if (newQuantity < 1) {
      // Remove from cart if quantity would go below 1
      dispatch(removeFromProductCart({ id, size: weight }));
      toast.info(`${title} removed from cart`);
      return;
    }
    
    const operation = change > 0 ? 'increment' : 'decrement';
    
    dispatch(addToCart({
      id,
      name: title,
      price: originalPrice,
      quantity: Math.abs(change),
      image,
      size: weight,
      operation
    }));

    setLocalQuantity(newQuantity);

    if (change > 0) {
      toast.success(`Added ${change} more ${title} to cart`);
    } else {
      toast.info(`Removed ${Math.abs(change)} ${title} from cart`);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); 
    e.preventDefault();

    dispatch(addToCart({
      id,
      name: title,
      price: originalPrice,
      quantity: 1,
      image,
      size: weight,
      operation: 'increment',
      mrp:price,
    }));

    toast.success(`${title} added to cart`);
  };

  const handleCompareToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isInCompare) {
      dispatch(removeFromCompare(id));
      toast.info(`${title} removed from compare`);
    } else {
      if (compareItems.length >= 3) {
        toast.warning('You can compare maximum 3 products');
        return;
      }
      
      dispatch(addToCompare({
        id,
        name: title,
        image,
        price: originalPrice,
        category,
        weight,
        rating,
        description: 'test',
        brand: 'test',
        sku: '11',
      }));
      
      toast.success(`${title} added to compare`);
    }
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
        {/* <div className="absolute top-2 right-2 z-10">
          <button 
            onClick={handleCompareToggle}
            className={`p-1 cursor-pointer rounded-full ${isInCompare ? 'bg-blue-600 text-black' : 'bg-white text-red-500'} shadow-sm border border-gray-200 hover:bg-blue-50 transition-colors`}
            aria-label="Compare"
          >
            <Scale size={16} />
          </button>
        </div> */}
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

        <div className="grid grid-cols-3 md:grid-cols-2 gap-2 border-t border-gray-200 pt-3">
          <button 
            onClick={handleViewProduct}
            className="flex items-center justify-center gap-1 p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 transition-colors duration-200 w-full"
          >
            <Eye className="w-4 h-4 min-w-[16px]  text-gray-900" />
            <span className="hidden sm:block text-xs font-medium truncate">View</span>
          </button>
          
          {isInCart ? (
            <div className="flex items-center justify-between border border-gray-200 rounded-lg overflow-hidden  col-span-2 md:col-span-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuantityChange(-1);
                }}
                className="p-1 hover:bg-gray-100 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3 mx-auto" />
              </button>
              <span className={`px-2 text-center min-w-[1.5rem] text-xs ${
                isInCart ? 'bg-green-100 text-green-800 font-medium' : ''
              }`}>
                {localQuantity}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuantityChange(1);
                }}
                className="p-1 hover:bg-gray-100 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3 mx-auto" />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-1 p-2 col-span-2 md:col-span-1 rounded-lg border border-gray-200 bg-blue-900  text-white hover:bg-blue-600 hover:text-white transition-colors duration-200 w-full cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 min-w-[16px]" />
              <span className="text-xs hidden sm:block font-medium truncate">Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;