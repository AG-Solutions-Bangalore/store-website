import React, { useState } from 'react';
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
  const navigate = useNavigate();

  return (
    <div
      className={`w-full h-full min-h-[200px] xs:min-h-[250px] sm:min-h-[280px] md:min-h-[300px] 
        rounded-xl p-1 shadow-lg transition-all duration-300 ease-in-out 
        flex flex-col relative overflow-hidden group`}
      style={{
        backgroundImage: `linear-gradient(to bottom, var(--tw-gradient-stops))`,
        '--tw-gradient-from': gradientFrom,
        '--tw-gradient-to': `${gradientTo}00`, 
        '--tw-gradient-stops': `var(--tw-gradient-from), var(--tw-gradient-to)`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (isHovered) {
          const encryptedId = encryptId(id);
          navigate(`/product/${encodeURIComponent(encryptedId)}`);
        }
      }}
    >
      {isHovered && (
        <>
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm animate-pulse duration-1000" />
          <div className="absolute top-0 left-0 w-1 h-full bg-white/30 animate-slideDown origin-top duration-1000" />
        </>
      )}
      
      <div
       
        className={`relative bg-white/80 cursor-pointer rounded-lg p-2 xs:p-3 sm:p-4 shadow-sm border border-white/20 
          backdrop-blur-2xl w-full h-full flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${
          isHovered ? 'scale-95 bg-white/90' : 'scale-100'
        }`}
      >
        {/* {isHovered && ( */}
          <div className="absolute inset-0 z-0">
            <LazyLoadImage
              src={image}
              alt={title}
              effect="blur"
              className="w-full h-full object-cover"
              width="100%"
              height="100%"
            />
            <div 
              className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent"
              style={{
                backgroundImage: `linear-gradient(to bottom, transparent, transparent, ${gradientTo})`
              }}
            />
            {
              isHovered ? (
                <>
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/100" />
                
                </>
              ):(
                <>
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
       
                </>
              )
            }
            </div>
           
        {/* )} */}
        
        <div className='flex flex-col items-center justify-center m-auto space-y-2 xs:space-y-3 sm:space-y-4 w-full h-full relative z-10'>
          <h3 className={`font-semibold text-[12px] px-1.5 xs:text-xs sm:text-sm md:text-[15px] lg:text-base 
            mb-1 line-clamp-2 text-center transition-all duration-300 ${
            isHovered
              ? 'text-white font-bold scale-105 uppercase '
              : 'text-white pt-0 xs:pt-10 sm:pt-12 md:pt-16 lg:pt-20 scale-100 sm:scale-110 md:scale-125 drop-shadow-[0_8px_4px_rgba(0,0,0,0.8)] uppercase'
          }`}>
            {title}
          </h3>
          
         
          
          <div className={`mt-1 xs:mt-2 text-center transition-all duration-300 overflow-hidden ${
            isHovered ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                const encryptedId = encryptId(id);
                navigate(`/product/${encodeURIComponent(encryptedId)}`);
              }}
              className="text-[9px] xs:text-[10px] sm:text-xs bg-blue-900 hover:bg-blue-600 text-white px-2 xs:px-3 py-1 rounded-full transition-colors duration-200 cursor-pointer"
            >
              View Details
            </button>
          </div>
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