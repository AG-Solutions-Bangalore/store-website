
import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  List,
  Search,
  ChevronRight,
  X,
  Frown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import BASE_URL from "../../config/BaseUrl";
import { encryptId } from "../../utils/Encyrption";

export function AppBottombar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showSearchModal, setShowSearchModal] = React.useState(false);
  const [searchHistory, setSearchHistory] = React.useState([]);
  const [showHistory, setShowHistory] = React.useState(true);

  
  React.useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);


  React.useEffect(() => {
    if (searchHistory.length > 0) {
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
  }, [searchHistory]);


  const fetchCategories = async () => {
    const response = await axios.get(`${BASE_URL}/api/web-fetch-category`);
    return response.data;
  };

  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });


  const fetchAllProducts = async () => {
    const response = await axios.get(`${BASE_URL}/api/web-fetch-product`);
    return response.data;
  };

  const { data: productsData } = useQuery({
    queryKey: ["allProducts"],
    queryFn: fetchAllProducts,
  });

  const navItems = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Categories",
      url: "#",
      icon: List,
      items: categoryData?.data?.map(category => ({
        title: category.category_name,
        url: `/product/${encodeURIComponent(encryptId(category.id))}`
      })) || []
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
      isSearch: true
    },
    {
      title: "Products",
      url: "/products",
      icon: ShoppingBag,
    }
  ];


  const mobileNavItems = navItems.slice(0, 4);

  const handleItemClick = (item, e) => {
    if (item.items || item.isSearch) {
      e.preventDefault();
      if (item.isSearch) {
        setShowSearchModal(true);
      } else {
        setActiveDropdown(activeDropdown === item.title ? null : item.title);
      }
    }
  };

  const isItemActive = (item) => {
    if (item.url !== "#" && location.pathname.startsWith(item.url)) {
      return true;
    }
    if (item.items) {
      return item.items.some(subItem => location.pathname.startsWith(subItem.url));
    }
    return false;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
     
      if (!searchHistory.includes(searchQuery.trim())) {
        setSearchHistory(prev => [searchQuery.trim(), ...prev].slice(0, 5));
      }
      
    //   navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchModal(false);
      setSearchQuery("");
      setShowHistory(false);
    }
  };

  const handleProductClick = (productId) => {
    const encryptedId = encryptId(productId);
    navigate(`/product-details/${encodeURIComponent(encryptedId)}`);
    setShowSearchModal(false);
    setSearchQuery("");
    setShowHistory(false);
  };

  const handleHistoryItemClick = (query) => {
    setSearchQuery(query);
    setShowHistory(false);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  const filteredProducts = React.useMemo(() => {
    if (!searchQuery || !productsData?.data) return [];
    
    const query = searchQuery.toLowerCase();
    return productsData.data.filter(product => {
      const nameMatch = product.product_name.toLowerCase().includes(query);
      const categoryMatch = product.category_names.toLowerCase().includes(query);
      const descriptionMatch = product.product_description?.toLowerCase().includes(query);
      
      return nameMatch || categoryMatch || descriptionMatch;
    });
  }, [searchQuery, productsData]);


  const activeMenu = activeDropdown ? navItems.find(item => item.title === activeDropdown) : null;

  return (
    <>
  
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 rounded-t-lg shadow-lg z-40">
        <div className="flex justify-around items-center h-14 px-1">
          {mobileNavItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = isItemActive(item);
            const hasDropdown = !!item.items || item.isSearch;
            
            return (
              <Link 
                key={item.title}
                to={hasDropdown ? "#" : item.url}
                onClick={(e) => handleItemClick(item, e)}
                className={`flex flex-col items-center justify-center p-1 rounded-lg relative ${
                  isActive 
                    ? "text-blue-600" 
                    : "text-gray-500"
                }`}
              >
                <div className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-blue-500 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <IconComponent className="h-4 w-4" />
                </div>
                <span className="text-xs mt-1 font-medium">{item.title}</span>
                
                {hasDropdown && (
                  <span className={`absolute top-0 right-0 w-1.5 h-1.5 rounded-full ${
                    isActive ? "bg-blue-500" : "bg-gray-400"
                  }`} />
                )}
              </Link>
            );
          })}
        </div>
      </div>

    
      <AnimatePresence>
        {activeMenu && (
          <motion.div 
            className="fixed inset-0 bg-black/30 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveDropdown(null)}
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
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
              {React.createElement(activeMenu.icon, { className: "h-4 w-4 text-blue-600" })}
            </div>
            <h3 className="font-semibold text-gray-900">
              {activeMenu.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigate('/categories');
                setActiveDropdown(null);
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#f8f8fb] text-blue-900 cursor-pointer text-sm rounded-md hover:bg-[#e2e8f0] transition-all duration-200"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
            <motion.button
              onClick={() => setActiveDropdown(null)}
              className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-3 w-3 text-gray-600" />
            </motion.button>
          </div>
        </div>
              
           
              <div className="py-1 max-h-[60vh] overflow-y-auto custom-scroll">
                {activeMenu.items.map((subItem, index) => (
                  <motion.div
                    key={subItem.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <Link
                      to={subItem.url}
                      onClick={() => setActiveDropdown(null)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-200 ${
                        location.pathname.startsWith(subItem.url)
                          ? "bg-blue-50 border-l-2 border-blue-500"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <span className={`text-sm font-medium ${
                        location.pathname.startsWith(subItem.url)
                          ? "text-blue-700"
                          : "text-gray-700"
                      }`}>
                        {subItem.title}
                      </span>
                      <motion.div
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className={`h-4 w-4 ${
                          location.pathname.startsWith(subItem.url)
                            ? "text-blue-500"
                            : "text-gray-400"
                        }`} />
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

   
      <AnimatePresence>
        {showSearchModal && (
          <motion.div 
            className="fixed inset-0 bg-black/30 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowSearchModal(false);
              setShowHistory(true);
            }}
          >
            <motion.div 
              className="w-full max-w-md mx-4 mb-16 bg-white rounded-xl shadow-xl overflow-hidden "
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={e => e.stopPropagation()}
            >
              
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                      <Search className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Search Products</h3>
                  </div>
                  <motion.button
                    onClick={() => {
                      setShowSearchModal(false);
                      setShowHistory(true);
                    }}
                    className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="h-3 w-3 text-gray-600" />
                  </motion.button>
                </div>

              
                <form onSubmit={handleSearch} className="mt-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowHistory(e.target.value === "");
                      }}
                      autoFocus
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    {searchQuery && (
                      <motion.button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </motion.button>
                    )}
                  </div>
                </form>
              </div>
              
              
              <div className="max-h-[70vh] overflow-hidden flex flex-col">
              
                {showHistory && searchHistory.length > 0 && (
                  <div className="px-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Searches</h4>
                      <button 
                        onClick={clearSearchHistory}
                        className="text-xs text-blue-500 hover:text-blue-700"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="space-y-1">
                      {searchHistory.map((query, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center px-3 py-2 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100"
                          onClick={() => handleHistoryItemClick(query)}
                        >
                          <Search className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700">{query}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

            
                {!showHistory && (
                  <div className="overflow-y-auto custom-scroll flex-1">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                          onClick={() => handleProductClick(product.id)}
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0 mr-3">
                              {product.subs?.[0]?.product_images ? (
                                <img
                                  src={`${productsData.image_url.find(img => img.image_for === "Product").image_url}${product.subs[0].product_images}`}
                                  alt={product.product_name}
                                  className="h-10 w-10 object-cover rounded"
                                />
                              ) : (
                                <img
                                  src={productsData.image_url.find(img => img.image_for === "No Image").image_url}
                                  alt="No image"
                                  className="h-10 w-10 object-cover rounded"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {product.product_name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {product.category_names}
                              </div>
                              {product.product_description && (
                                <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                                  {product.product_description}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : searchQuery ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-8 px-4 text-center"
                      >
                        <Frown className="h-10 w-10 text-gray-400 mb-3" />
                        <h4 className="text-lg font-medium text-gray-700">No results found</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          We couldn't find any products matching "{searchQuery}"
                        </p>
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setShowHistory(true);
                          }}
                          className="mt-4 text-sm text-blue-500 hover:text-blue-700"
                        >
                          Back to search
                        </button>
                      </motion.div>
                    ) : null}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}