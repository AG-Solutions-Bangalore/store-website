import React, { useState, useMemo, useEffect } from 'react';
import { Star, StarHalf, ShoppingCart, Eye, ChevronDown, X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductViewCard from '../../components/Cards/ProductViewCard';
import ProductCard from '../../components/Cards/ProductCard';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import BASE_URL from '../../config/BaseUrl';

const fetchAllProducts = async () => {
  const response = await axios.get(`${BASE_URL}/api/web-fetch-product`);
  return response.data;
};

const ProductAll = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedRating, setSelectedRating] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['allProducts'],
    queryFn: fetchAllProducts
  });

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
          ? product.product_selling_price 
          : product.product_mrp,
        rating: 0,
        weight: `${product.product_unit_value}${product.unit_name}`,
        onSale: product.product_spl_offer_price > 0,
        isNew: false,
        productData: product
      };
    });
  };

  const products = transformProductData(data);

  // Get unique categories from products
  const categories = useMemo(() => {
    if (!data || !data.data) return [];
    const categorySet = new Set();
    data.data.forEach(product => {
      categorySet.add(product.category_names);
    });
    return Array.from(categorySet).map(category => ({
      name: category,
      icon: '🍎', // Default icon
      selected: false
    }));
  }, [data]);

  // Get unique weights from products
  const weights = useMemo(() => {
    const weightSet = new Set();
    products.forEach(product => {
      weightSet.add(product.weight);
    });
    return Array.from(weightSet);
  }, [products]);

  const handleTagRemove = (tag) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  const handleProductView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

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
      
      const ratingMatch = selectedRating === 'all' || 
        (selectedRating === '4+' && product.rating >= 4) ||
        (selectedRating === '3+' && product.rating >= 3) ||
        (selectedRating === '2+' && product.rating >= 2);
      
      return categoryMatch && weightMatch && priceMatch && searchMatch && ratingMatch;
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="w-full py-8">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8"> 
        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <div className="w-80 space-y-6">
            {/* Category Filter */}
            <div className="bg-white rounded-md border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Category</h3>
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </div>
              <hr className="mb-4 text-gray-200"/>
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={`category-${index}`}
                      checked={selectedCategories.includes(category.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories(prev => [...prev, category.name]);
                        } else {
                          setSelectedCategories(prev => prev.filter(c => c !== category.name));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`category-${index}`} className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm">{category.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Weight Filter */}
            <div className="bg-white rounded-md border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Weight</h3>
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

            {/* Price Filter */}
            <div className="bg-white rounded-md border border-gray-200 p-6">
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
          </div>

          {/* Right - Products */}
          <div className="flex-1">
            <div className="bg-white rounded-md border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
  {/* Show selected categories */}
  {selectedCategories.slice(0, 3).map((category, index) => (
    <span
      key={`category-${index}`}
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
    >
      {category}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedCategories(prev => prev.filter(c => c !== category));
        }}
        className="ml-1 hover:text-blue-600"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  ))}
  
  {/* Show selected weights */}
  {selectedWeights.slice(0, 3).map((weight, index) => (
    <span
      key={`weight-${index}`}
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
    >
      {weight}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedWeights(prev => prev.filter(w => w !== weight));
        }}
        className="ml-1 hover:text-blue-600"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  ))}

  {/* Clear All button */}
  {(selectedCategories.length > 0 || selectedWeights.length > 0) && (
    <button
      onClick={() => {
        setSelectedCategories([]);
        setSelectedWeights([]);
      }}
      className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
    >
      Clear All
    </button>
  )}
</div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowSearch(!showSearch)}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <Search className="w-4 h-4 text-gray-600" />
                    </button>
                    {showSearch && (
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
                        autoFocus
                      />
                    )}
                  </div>
                  
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Ratings</option>
                    <option value="4+">4+ Stars</option>
                    <option value="3+">3+ Stars</option>
                    <option value="2+">2+ Stars</option>
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="default">Sort by</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
              </div>
            )}
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

export default ProductAll;