import React, { useState, useEffect } from "react";
import ProductCard from "../../components/Cards/ProductCard";
import ProductViewCard from '../../components/Cards/ProductViewCard';
import axios from "axios";
import BASE_URL from "../../config/BaseUrl";
import { useQuery } from "@tanstack/react-query";
import SkeletonNewArrivalLoading from "../../components/skeletons/SkeletonNewArrivalLoading";

const fetchNewArrivals = async () => {
  const response = await axios.get(`${BASE_URL}/api/web-fetch-product-new-arrivals`);
  return response.data;
};

const NewArrival = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ['newArrivals'],
    queryFn: fetchNewArrivals
  });
  const handleCategoryChange = (category) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveCategory(category);
      setIsTransitioning(false);
    }, 300); 
  };

  

  const handleProductView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

 // Get unique categories from API data
 const getUniqueCategories = () => {
  if (!data || !data.data) return [];
  const categories = new Set(data.data.map(product => product.category_names));
  return Array.from(categories);
};

// Transform API data to match ProductCard props
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

const getMixedProducts = () => {
  if (!data) return [];
  
  const transformedProducts = transformProductData(data);
  const categories = getUniqueCategories();
  

  const mixedProducts = categories.flatMap(category => {
    const categoryProducts = transformedProducts.filter(p => p.category === category);
    return categoryProducts.sort(() => 0.5 - Math.random())
                          .slice(0, Math.min(categoryProducts.length, 3));
  });
  
  return mixedProducts.sort(() => 0.5 - Math.random());
};

const filteredProducts = activeCategory === 'All' 
  ? getMixedProducts()
  : transformProductData(data).filter(product => product.category === activeCategory)

if (isLoading) return (
  <>
  <SkeletonNewArrivalLoading/>
  </>
);
if (error) return <div>Error loading products</div>;

const categories = getUniqueCategories();

  return (
    <div className="w-full py-8">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div >
            <h2 className="text-3xl font-medium text-gray-900">
              New <span className="text-blue-900">Arrivals</span>
            </h2>
            <p className="text-gray-600 font mt-2">
              Shop online for new arrivals and get free shipping.
            </p>
          </div>
          <div className="flex flex-wrap  ">
            <button
              onClick={() => handleCategoryChange("All")}
              className={`px-4 py-2  cursor-pointer  transition-colors duration-200 ${
                activeCategory === "All"
                  ? " text-blue-900"
                  : " text-gray-800 hover:text-blue-900"
              }`}
            >
              All
            </button>
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 cursor-pointer transition-colors duration-200 ${
                  activeCategory === category
                    ? "text-blue-900"
                    : "text-gray-800 hover:text-blue-900"
                }`}
              >
                {category}
              </button>
            ))}


          </div>
        </div>

        <div
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 transition-opacity duration-300 ease-in-out ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {filteredProducts.map((product, index) => (
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
      {selectedProduct && (
    <ProductViewCard 
      isOpen={isModalOpen} 
      onClose={handleCloseModal}
      product={selectedProduct}
    />
  )}
    </div>
  );
};

export default NewArrival;
