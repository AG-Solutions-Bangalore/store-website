import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/Cards/ProductCard';
import ProductViewCard from '../../components/Cards/ProductViewCard';
import BASE_URL from '../../config/BaseUrl';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


const fetchDealOfTheDay = async () => {
  const response = await axios.get(`${BASE_URL}/api/web-fetch-product-deal-of-the-day`);
  return response.data;
};


const DealOfTheDay = () => {
  const [timeLeft, setTimeLeft] = useState({
      days: 25,
      hours: 23,
      minutes: 41,
      seconds: 16
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { data, isLoading, error } = useQuery({
      queryKey: ['dealOfTheDay'],
      queryFn: fetchDealOfTheDay
    });
    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          const { days, hours, minutes, seconds } = prevTime;
          
    
          let newSeconds = seconds - 1;
          let newMinutes = minutes;
          let newHours = hours;
          let newDays = days;
  
          if (newSeconds < 0) {
            newSeconds = 59;
            newMinutes -= 1;
          }
  
          if (newMinutes < 0) {
            newMinutes = 59;
            newHours -= 1;
          }
  
          if (newHours < 0) {
            newHours = 23;
            newDays -= 1;
          }
  
        
          if (newDays <= 0 && newHours <= 0 && newMinutes <= 0 && newSeconds <= 0) {
            clearInterval(timer);
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
          }
  
          return { 
            days: newDays, 
            hours: newHours, 
            minutes: newMinutes, 
            seconds: newSeconds 
          };
        });
      }, 1000);
  
      return () => clearInterval(timer);
    }, []);



    const handleProductView = (product) => {
      setSelectedProduct(product);
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedProduct(null);
    };

    const transformProductData = (apiData) => {
      if (!apiData || !apiData.data) return [];
      
      return apiData.data.map(product => {
        const defaultImage = product.subs.find(sub => sub.is_default === "true") || product.subs[0];
        const hoverImage = product.subs.find(sub => sub.is_default === "false") || defaultImage;
        
        const productImageUrl = apiData.image_url.find(img => img.image_for === "Product")?.image_url || "";
        const noImageUrl = apiData.image_url.find(img => img.image_for === "No Image")?.image_url || "";
        
        return {
          id: product.id,
          image: defaultImage ? `${productImageUrl}${defaultImage.product_images}` : noImageUrl,
          hoverImage: hoverImage ? `${productImageUrl}${hoverImage.product_images}` : noImageUrl,
          title: product.product_name,
          category: product.category_names,
          price: product.product_mrp,
          originalPrice: product.product_spl_offer_price > 0 
            ? product.product_spl_offer_price 
            : product.product_selling_price,
          rating: 0,
          weight: `${product.product_unit_value}${product.unit_name}`,
          onSale: product.product_spl_offer_price > 0,
          isNew: true,
          productData: product
        };
      });
    };

    const products = transformProductData(data);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
  return (
   <div className="w-full py-8 ">
         <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
         <div className="mb-8 flex justify-between items-center">
  <div>
    <h2 className="text-3xl font-medium text-gray-900">Day Of The Deal</h2>
    <p className="text-gray-600 font-mono mt-2">Don't wait. The time will never be just right.</p>
  </div>
  <div className="bg-[#f8f8fb] text-[#4b5966] px-4 py-2 rounded-md font-mono ">
            {timeLeft.days} Days {timeLeft.hours.toString().padStart(2, '0')}:
            {timeLeft.minutes.toString().padStart(2, '0')}:
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
</div>
           
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
             {products.map((product, index) => (
               <ProductCard
                 key={index}
                 id={product.id}
                 image={product.image}
                 hoverImage={product.hoverImage}
                 title={product.title}
                 category={product.category}
                 price={product.price}
                 originalPrice={product.originalPrice}
                 rating={product.rating}
                 onSale={product.onSale}
                 isNew={product.isNew}
                 weight={product.weight}
                 onViewProduct={() => handleProductView(product)}
               />
             ))}
           </div>
         </div>


      {/* Product View Modal */}
     {selectedProduct && (
    <ProductViewCard 
      isOpen={isModalOpen} 
      onClose={handleCloseModal}
      product={selectedProduct}
    />
  )}

       </div>
  )
}

export default DealOfTheDay