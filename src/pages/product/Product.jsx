import React, { useState, useMemo, useEffect } from 'react';
import { Star, StarHalf, ShoppingCart, Eye, ChevronDown, X, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import ProductViewCard from '../../components/Cards/ProductViewCard';
import ProductCard from '../../components/Cards/ProductCard';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BASE_URL from '../../config/BaseUrl';
import SkeletonProductCategoriesLoading from '../../components/skeletons/SkeletonProductCategoriesLoading';
import { decryptId } from '../../utils/Encyrption';
import { motion, AnimatePresence } from 'framer-motion';

const fetchCategoryProducts = async (categoryId) => {
  const response = await axios.get(`${BASE_URL}/api/web-fetch-categoryproduct-by-id/${categoryId}`);
  return response.data;
};

const Product = () => {
  const { id } = useParams();
  const decryptedId = decryptId(id);
  const { data, isLoading, error } = useQuery({
    queryKey: ['categoryProducts', decryptedId],
    queryFn: () => fetchCategoryProducts(decryptedId)
  });

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedRating, setSelectedRating] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const transformProductData = (apiData) => {
    if (!apiData || !apiData.products) return [];
    
    return apiData.products.map(product => {
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
  
  const weights = useMemo(() => {
    const weightSet = new Set();
    products.forEach(product => {
      weightSet.add(product.weight);
    });
    return Array.from(weightSet);
  }, [products]);

  const handleProductView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  
    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showMobileFilters]);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const categoryMatch = selectedCategories.length === 0 || 
        selectedCategories.some(category => product.category.includes(category));
      
      const weightMatch = selectedWeights.length === 0 || 
        selectedWeights.some(weight => product.weight.includes(weight));
      
      const price = parseFloat(product.price);
      const priceMatch = price >= priceRange[0] && price <= priceRange[1];
      
      const searchMatch = !searchTerm || 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      return categoryMatch && weightMatch && priceMatch && searchMatch;
    });

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [products, selectedCategories, selectedWeights, priceRange, searchTerm, selectedRating, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, selectedWeights, priceRange, searchTerm, selectedRating, sortBy]);

  const renderPagination = () => {
    const maxVisiblePages = 5;
    let startPage, endPage;
    
    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;
      
      if (currentPage <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrent;
        endPage = currentPage + maxPagesAfterCurrent;
      }
    }

    return (
      <div className="flex items-center justify-center space-x-1 py-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className={`px-3 py-1 rounded-md text-sm ${
                1 === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}
        
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded-md text-sm ${
              page === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => setCurrentPage(totalPages)}
              className={`px-3 py-1 rounded-md text-sm ${
                totalPages === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  if (isLoading) return <SkeletonProductCategoriesLoading/>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="w-full py-4 md:py-8">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8"> 
        {/* Mobile header with filter and search controls - shown on md and below */}
        <div className="lg:hidden mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {products.length > 0 && (
              <span className="inline-flex items-center text-xl font-medium text-black">
                {products[0].category} Products
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-md transition-colors ${showSearch ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="lg:hidden mb-4 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
          {/* Left Sidebar - Filters - Hidden on mobile and medium screens */}
          <div className="hidden lg:block w-full lg:w-80 space-y-4 md:space-y-6">
            <div className="bg-white rounded-md border border-gray-200 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Price</h3>
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </div>
              <hr className="mb-4 text-gray-200"/>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">From</span>
                  <span className="text-sm text-gray-600">To</span>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value || 0), priceRange[1]])}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-400">—</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value || 10000)])}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>
           
            <div className="bg-white rounded-md border border-gray-200 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Weight or Sizes</h3>
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </div>
              <hr className="mb-4 text-gray-200"/>
              <div className="space-y-3">
                {weights.map((weight, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={`weight-${index}`}
                      checked={selectedWeights.includes(weight)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedWeights(prev => [...prev, weight]);
                        } else {
                          setSelectedWeights(prev => prev.filter(w => w !== weight));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`weight-${index}`} className="text-sm text-gray-700 cursor-pointer">
                      {weight}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Products */}
          <div className="flex-1">
            {/* Desktop header - shown only on lg and above */}
            <div className="hidden lg:block bg-white rounded-md border border-gray-200 p-4 mb-4 md:mb-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {products.length > 0 && (
                      <span className="inline-flex items-center text-xl font-medium text-black">
                        {products[0].category} Products
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center w-full md:w-auto gap-3 md:gap-4">
                  <div className="relative flex items-center w-full md:w-auto">
                    <button
                      onClick={() => {
                        setShowSearch(true);
                        setTimeout(() => document.getElementById('search-input')?.focus(), 0);
                      }}
                      className={`p-2 rounded-md transition-colors ${showSearch ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Search className="w-4 h-4" />
                    </button>
                    
                    <AnimatePresence>
                      {showSearch && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-center ml-2">
                            <input
                              id="search-input"
                              type="text"
                              placeholder="Search product..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full min-w-[200px] px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              autoFocus
                            />
                            {searchTerm && (
                              <button
                                onClick={() => {
                                  setSearchTerm('');
                                  document.getElementById('search-input')?.focus();
                                }}
                                className="ml-2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="default">Sort by</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile sort dropdown - shown on md and below */}
            <div className="lg:hidden mb-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">Sort by</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
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

            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-8 md:py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
              </div>
            )}

            {totalPages > 1 && renderPagination()}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal - shown on md and below */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div 
            className="fixed inset-0 bg-black/30 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMobileFilters(false)}
          >
            <motion.div 
              className="w-full max-w-md mx-4 mb-16 bg-white rounded-xl shadow-xl overflow-hidden"
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                      <Filter className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      Filters
                    </h3>
                  </div>
                  <motion.button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="h-3 w-3 text-gray-600" />
                  </motion.button>
                </div>
              </div>
              
              {/* Filter Content */}
              <div className="py-4 max-h-[60vh] overflow-y-auto">
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Price</h3>
                  </div>
                  <hr className="mb-4 text-gray-200"/>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">From</span>
                      <span className="text-sm text-gray-600">To</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value || 0), priceRange[1]])}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-400">—</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value || 10000)])}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Weight or Sizes</h3>
                  </div>
                  <hr className="mb-4 text-gray-200"/>
                  <div className="space-y-3">
                    {weights.map((weight, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={`mobile-weight-${index}`}
                          checked={selectedWeights.includes(weight)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedWeights(prev => [...prev, weight]);
                            } else {
                              setSelectedWeights(prev => prev.filter(w => w !== weight));
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`mobile-weight-${index}`} className="text-sm text-gray-700 cursor-pointer">
                          {weight}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer with Apply button */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

export default Product;