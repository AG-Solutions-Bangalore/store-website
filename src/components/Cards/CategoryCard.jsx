import React, { use, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { encryptId } from '../../utils/Encyrption';

const CategoryCard = ({ 
  id,
  image, 
  title, 
  itemCount, 
  gradientFrom, 
  gradientTo,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate()
  return (
    <div
      className={`w-full max-w-[300px] sm:max-w-[280px] md:max-w-[250px] lg:max-w-[300px] xl:max-w-[350px]
        rounded-xl p-1 shadow-lg transition-all duration-300 ease-in-out aspect-square 
        flex flex-col relative overflow-hidden group`}
      style={{
        backgroundImage: `linear-gradient(to bottom, var(--tw-gradient-stops))`,
        '--tw-gradient-from': gradientFrom,
        '--tw-gradient-to': `${gradientTo}00`, 
        '--tw-gradient-stops': `var(--tw-gradient-from), var(--tw-gradient-to)`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <>
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm animate-pulse duration-1000" />
          <div className="absolute top-0 left-0 w-1 h-full bg-white/30 animate-slideDown origin-top duration-1000" />
        </>
      )}
      
      <div className={`relative bg-white/80 rounded-lg p-3 sm:p-4 shadow-sm border border-white/20 backdrop-blur-2xl aspect-square flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${
        isHovered ? 'scale-95 bg-white/90' : 'scale-100'
      }`}>
     
        {!isHovered && (
          <div className="absolute inset-0 z-0">
            <LazyLoadImage
              src={image}
              alt={title}
              effect="blur"
              className="w-full aspect-square h-full object-cover"
            />
       
            <div 
              className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent"
              style={{
                backgroundImage: `linear-gradient(to bottom, transparent, transparent, ${gradientTo})`
              }}
            />
     
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
          </div>
        )}
        
        <div className='flex flex-col items-center m-auto space-y-3 w-full relative z-10'>
          <h3 className={`font-semibold text-xs sm:text-sm md:text-base mb-1 line-clamp-2 text-center transition-all duration-300 ${
            isHovered
              ? 'text-black font-bold scale-105 uppercase'
              : 'text-white pt-20 sm:pt-20 sm:scale-125  drop-shadow-[0_8px_4px_rgba(0,0,0,0.8)] uppercase'
          }`}>
            {title}
          </h3>
          
          <p className={`text-[10px] sm:text-xs font-medium transition-all duration-300 ${
            isHovered
              ? 'text-gray-800 scale-110'
              : 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] pt-0 sm:pt-2 font-semibold'
          }`}>
            {itemCount} {itemCount === 1 || itemCount === 0 ? 'Item' : 'Items'}
          </p>
          
          <button
          
          onClick={()=> 
     
            {

              const encryptedId = encryptId(id);
     
            navigate(`/product/${encodeURIComponent(encryptedId)}`)
          }
          
          }
          
          
          
          className={`mt-2 text-center transition-all duration-300 overflow-hidden ${
            isHovered ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <button className="text-[10px] sm:text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors duration-200 cursor-pointer">
              View Details
            </button>
          </button>
        </div>
      </div>
      
      <div className={`absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} style={{
        boxShadow: `0 0 20px 5px ${gradientFrom}80`
      }} />
    </div>
  );
};

export default CategoryCard;
