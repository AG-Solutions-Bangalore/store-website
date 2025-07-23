import React, { useState } from 'react';
import { Star, StarHalf, ShoppingCart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../redux/slices/CartSlice';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
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
  isNew = false ,
  onViewProduct
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch();

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
  return (
    <div 
    onClick={() => 
      
      {
        const encryptedId = encryptId(id);

      navigate(`/product-details/${encodeURIComponent(encryptedId)}`)
  
    }
  
  }





      className="bg-white rounded-md border border-gray-200  hover:shadow-md transition-all duration-300 overflow-hidden group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
     
      {(onSale || isNew) && (
        <div className={`absolute top-2 left-2 z-10 px-2 py-1 rounded text-xs font-semibold text-white ${
          onSale ? 'bg-red-400' : 'bg-teal-500'
        }`}>
          {onSale ? 'SALE' : 'NEW'}
        </div>
      )}
      
     
      <div className="relative overflow-hidden bg-gray-50 aspect-square cursor-pointer">
        <img 
          src={isHovered && hoverImage ? hoverImage : image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
   
{isHovered && (
  <div className="absolute bottom-0 left-0 right-0  bg-opacity-90 bg-transparent flex items-center justify-center gap-4 p-2 transition-opacity duration-300">
    {/* <button className="p-2 rounded-lg bg-white border border-gray-200 cursor-pointer hover:bg-blue-300 transition-colors duration-200">
      <ShoppingCart className="w-4 h-4 text-gray-900" />
    </button> */}
    <button 
     onClick={handleViewProduct}
    className="p-2 rounded-lg  bg-white border border-gray-200 cursor-pointer hover:bg-blue-300 transition-colors duration-200">
      <Eye className="w-4 h-4 text-gray-900" />
    </button>
  </div>
)}
      </div>
      
   
      <div className="p-4 space-y-2 border-t border-gray-200">
     
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {category}
        </p>
        
      
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight">
          {title}
        </h3>
        
       
        <div className="flex items-center flex-row justify-between gap-1">
        
          {weight && (
            <span className="text-xs text-gray-500 font-medium">
              {weight}
            </span>
          )}
     
            <button 
             onClick={handleAddToCart}
            className="p-2 rounded-lg  border border-gray-200 bg-blue-200 cursor-pointer hover:bg-blue-600 transition-colors duration-200">
            <ShoppingCart className="w-4 h-4 text-gray-900" />
          </button>
  
        </div>
        
      
        <div className="flex items-center justify-between">


        {(price == originalPrice) ? (

<>
<div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
            &#8377;{price}
            </span>
           
          </div>

</>
):(

<>
<div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
            &#8377;{originalPrice}
            </span>
            {price && (
              <span className="text-sm text-gray-500 line-through">
                &#8377;{price}
              </span>
            )}
          </div>

</>

)}
        




          
        </div>
      </div>
    </div>
  );
};

export default ProductCard;