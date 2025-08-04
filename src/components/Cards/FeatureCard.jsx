import React from 'react';

const FeatureCard = ({ 
  image, 
  discount, 
  title1, 
  title2, 
  subtitle1, 
  subtitle2, 
  buttonText = "Shop Now" 
}) => {
  return (
    <div 
      className="relative bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden h-80 group"
      style={{
        backgroundImage: `url(${image})`
      }}
    >
      {/* Gradient overlay effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-0 bg-gradient-to-r from-transparent via-white/60 to-blue-200/60 opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-300 ease-linear"></div>
      </div>
      
      <div className="absolute inset-0"></div>
      
      {/* Discount badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-gray-600 text-white/85 px-3 py-1 rounded-md text-xs font-medium">
          {discount}
        </span>
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-end pr-8 sm:pr-12 z-10">
        <div className="text-left">
          <h2 className="text-4xl text-gray-600 font-medium mb-2 drop-shadow-lg">
            {title1} <br/> {title2}
          </h2>
          <p className="text-md text-gray-500 mb-4 drop-shadow-md">
            {subtitle1 } <br/> {subtitle2}
          </p>
          <button className="bg-blue-900 hover:bg-blue-600 text-white px-2 py-1 rounded-sm text-sm font-medium transition-colors shadow-lg">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;