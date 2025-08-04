import React from 'react';

const InfoCard = ({ 
  icon, 
  title, 
  subtitle1, 
  subtitle2 
}) => {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg border border-gray-200">
    
      <div className="mb-4 text-blue-900">
        {icon}
      </div>
      
   
      <h3 className="text-lg  text-gray-900 mb-2">
        {title}
      </h3>
      
     
      <p className="text-sm text-gray-500 leading-relaxed">
        {subtitle1} <br /> {subtitle2}
      </p>
    </div>
  );
};

export default InfoCard;