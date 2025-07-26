import React, { useState, useEffect } from "react";
import ProductCard from "../../components/Cards/ProductCard";
import ProductViewCard from '../../components/Cards/ProductViewCard';
import axios from "axios";
import BASE_URL from "../../config/BaseUrl";
import { useQuery } from "@tanstack/react-query";
import SkeletonNewArrivalLoading from "../../components/skeletons/SkeletonNewArrivalLoading";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const fetchNewArrivals = async () => {
  const response = await axios.get(`${BASE_URL}/api/web-fetch-product-new-arrivals`);
  return response.data;
};

const NewArrival = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 10;
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['newArrivals'],
    queryFn: fetchNewArrivals
  });

  const handleCategoryChange = (category) => {
    setIsTransitioning(true);
    setCurrentIndex(0); 
    setTimeout(() => {
      setActiveCategory(category);
      setIsTransitioning(false);
    }, 300); 
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => {
      const nextIndex = prevIndex + itemsPerPage;
      const filtered = getFilteredProducts();
      return nextIndex >= filtered.length ? 0 : nextIndex;
    });
  };

  const handlePrev = () => {
    setCurrentIndex(prevIndex => {
      const prevIndexNew = prevIndex - itemsPerPage;
      const filtered = getFilteredProducts();
      return prevIndexNew < 0 ? filtered.length - (filtered.length % itemsPerPage || itemsPerPage) : prevIndexNew;
    });
  };

  const getVisibleItems = () => {
    const filtered = getFilteredProducts();
    return filtered.slice(currentIndex, currentIndex + itemsPerPage);
  };

  const handleProductView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const getUniqueCategories = () => {
    if (!data || !data.data) return [];
    const categories = new Set(data.data.map(product => product.category_names));
    return Array.from(categories);
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
        productData: {
          ...product,
         
          allImages: product.subs.map(sub => ({
            url: `${productImageUrl}${sub.product_images}`,
            is_default: sub.is_default
          }))
        }
      };
    });
  };
  const products = transformProductData(data);
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentPage = Math.floor(currentIndex / itemsPerPage) + 1;
  const getFilteredProducts = () => {
    if (!data) return [];
    const transformed = transformProductData(data);
    return activeCategory === 'All' 
      ? transformed
      : transformed.filter(product => product.category === activeCategory);
  };

  if (isLoading) return <SkeletonNewArrivalLoading/>;
  if (error) return <div>Error loading products</div>;

  const categories = getUniqueCategories();
  const visibleProducts = getVisibleItems();
  const filteredProducts = getFilteredProducts();

  return (
    <div className="w-full py-8">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-medium text-gray-900">
              New <span className="text-blue-900">Arrivals</span>
            </h2>
            <p className="text-gray-600 font mt-2">
              Shop online for new arrivals and get free shipping.
            </p>
          </div>
          <div className="flex flex-wrap">
            <button
              onClick={() => handleCategoryChange("All")}
              className={`px-2  py-1 cursor-pointer transition-colors duration-200 ${
                activeCategory === "All"
                  ? "text-blue-900 border border-blue-900"
                  : "text-gray-800 hover:text-blue-900 border border-gray-100"
              }`}
            >
              All
            </button>
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryChange(category)}
                className={`px-2  text-sm py-1 cursor-pointer transition-colors duration-200 ${
                  activeCategory === category
                    ? "text-blue-900 border border-blue-900"
                    : "text-gray-800 hover:text-blue-900 border border-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        {filteredProducts.length > itemsPerPage && (
                    <div className="flex justify-end items-center mb-2 space-x-4">
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <div className="flex space-x-2">
                        <button 
                          className="p-2 hover:bg-gray-200 rounded"
                          onClick={handlePrev}
                        >
                          <ChevronLeft size={18} className="text-gray-600" />
                        </button>
                        <button 
                          className="p-2 hover:bg-gray-200 rounded"
                          onClick={handleNext}
                        >
                          <ChevronRight size={18} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                  )}
        {/* {filteredProducts.length > itemsPerPage && (
            <div className="flex justify-end  mb-2 space-x-2">
              <button 
                className="p-2 hover:bg-gray-200 rounded"
                onClick={handlePrev}
              >
                <ChevronLeft size={18} className="text-gray-600" />
              </button>
              <button 
                className="p-2 hover:bg-gray-200 rounded"
                onClick={handleNext}
              >
                <ChevronRight size={18} className="text-gray-600" />
              </button>
            </div>
          )} */}
        <div className="relative">
          <div
            className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 transition-opacity duration-300 ease-in-out ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            {visibleProducts.map((product, index) => (
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