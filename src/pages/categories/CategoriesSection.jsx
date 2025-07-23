import React from 'react'


import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import CategoryCard from '../../components/Cards/CategoryCard';
import BASE_URL from '../../config/BaseUrl';
import CategorySkeletonLoading from '../../components/skeletons/CategorySkeletonLoading';



const fetchCategories = async () => {
  const response = await axios.get(`${BASE_URL}/api/web-fetch-category`);
  return response.data;
};


const CategoriesSection = () => {
    const { data, isLoading, error } = useQuery({
       queryKey: ['categories'],
       queryFn: fetchCategories
     });
   
    
     const gradientColors = [
       { gradientFrom: "#dcfce7", gradientTo: "#bbf7d0" }, // green
       { gradientFrom: "#fee2e2", gradientTo: "#fbcfe8" }, // red/pink
       { gradientFrom: "#f3e8ff", gradientTo: "#e9d5ff" }, // purple
       { gradientFrom: "#fef9c3", gradientTo: "#fef08a" }, // yellow
       { gradientFrom: "#dbeafe", gradientTo: "#bfdbfe" }, // blue
       { gradientFrom: "#ffedd5", gradientTo: "#fed7aa" }, // orange
       { gradientFrom: "#ccfbf1", gradientTo: "#99f6e4" }, // teal
       { gradientFrom: "#fce7f3", gradientTo: "#fbcfe8" }, // pink
       { gradientFrom: "#e0e7ff", gradientTo: "#c7d2fe" }, // indigo
       { gradientFrom: "#ecfccb", gradientTo: "#d9f99d" }, // lime
     ];
   
     if (isLoading) return (
<>
<CategorySkeletonLoading/>
</>

     )
     if (error) return <div className="text-center py-8 text-red-500">Error loading categories</div>;
  return (
    <div className="w-full py-8 ">
    <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
     
      
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {data?.data?.map((category, index) => {
     
     const colorIndex = index % gradientColors.length;
     return (
       <CategoryCard
         key={category.id}
         id={category.id}
         image={`${data.image_url.find(img => img.image_for === "Category").image_url}${category.category_image}`}
         title={category.category_name}
         itemCount={category.product_count}
         gradientFrom={gradientColors[colorIndex].gradientFrom}
         gradientTo={gradientColors[colorIndex].gradientTo}
       />
     );
   })}
      </div>

  
      
    </div>
  </div>
  )
}

export default CategoriesSection