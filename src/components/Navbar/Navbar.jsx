import React, { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Phone,
  Gift,
  MessageCircleCode,
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useCompanyData } from "../../hooks/useCompanyData";
import axios from "axios";
import BASE_URL from "../../config/BaseUrl";
import { useQuery } from "@tanstack/react-query";
import { encryptId } from "../../utils/Encyrption";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  
  const {
    storeName,
    storeDescription,
    storeLogoImage,
    supportEmail,
    supportPhone,
    supportWhatsapp,
    appStoreUrl,
    googleStoreUrl,
    isLoading,
    error,
  } = useCompanyData();

  // Fetch categories from API
  const fetchCategories = async () => {
    const response = await axios.get(`${BASE_URL}/api/web-fetch-category`);
    return response.data;
  };

  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useQuery({
    queryKey: ["categoriesFooter"],
    queryFn: fetchCategories,
  });

  // Process categories data
  const categories = {
    left: categoryData?.data?.slice(0, 5) || [], // First 5 categories for Popular
    right: categoryData?.data?.slice(5) || []    // Remaining categories for More
  };

  const fetchAllProducts = async () => {
    const response = await axios.get(`${BASE_URL}/api/web-fetch-product`);
    return response.data;
  };

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["allProducts"],
    queryFn: fetchAllProducts,
  });

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const navbarVariants = {
    hidden: { y: 0, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  const logoVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, delay: 0.5 },
    },
  };

  const cartVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, delay: 0.5 },
    },
  };

  const socialVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, delay: 0.3 },
    },
  };

  const sidebarVariants = {
    closed: {
      x: "-100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  const menuItemVariants = {
    closed: { x: -50, opacity: 0 },
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const mobileCategoryVariants = {
    closed: { height: 0, opacity: 0 },
    open: { height: "auto", opacity: 1 }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    if (productsData?.data) {
      const results = productsData.data.filter(
        (product) =>
          product.product_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.category_names
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
      setSearchResults(results.slice(0, 5));
    }
  }, [searchQuery, productsData]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
      setSearchQuery("");
    }
  };

  const handleProductClick = (productId) => {
    const encryptedId = encryptId(productId);
    navigate(`/product-details/${encodeURIComponent(encryptedId)}`);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
    { name: "Products", path: "/products" },
  ];

  const toggleMobileCategories = () => {
    setMobileCategoriesOpen(!mobileCategoriesOpen);
  };

  return (
    <motion.div
      className={`w-full transition-all duration-300 relative`}
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Top Header */}
      <motion.div
        className="bg-gray-100 border-b border-gray-200"
        variants={itemVariants}
      >
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile  */}
          <div className="flex items-center justify-center h-8 text-xs text-gray-600 font-medium sm:hidden">
            World's Fastest Online Shopping Destination
          </div>

          {/* Desktop  */}
          <div className="hidden sm:block">
            <div className="flex items-center justify-between h-10 text-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone size={12} />
                  <span>{supportPhone}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MessageCircleCode size={12} />
                  <span>{supportWhatsapp}</span>
                </div>
              </div>

              <div className="absolute left-1/2 transform -translate-x-1/2 text-gray-600 font-medium hidden lg:block">
                World's Fastest Online Shopping Destination
              </div>

              <div className="flex items-center space-x-2 lg:space-x-4">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                    variants={socialVariants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Navigation */}
      <motion.div
        className="bg-white border-b border-gray-200 shadow-sm"
        variants={itemVariants}
      >
        <div className="max-w-[85rem] mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex-shrink-0 flex items-center cursor-pointer"
              variants={logoVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
            >
              <img
                src={storeLogoImage}
                alt="Store Logo"
                className="h-10 w-auto"
              />
            </motion.div>

            {/* Desktop Navigation Menu */}
            <div className="hidden lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:flex lg:items-center lg:space-x-8">
              {menuItems.map((item) => (
                <div key={item.name} className="relative group">
                  <motion.div
                    onClick={() => item.name !== "Categories" && navigate(item.path)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 cursor-pointer px-3 py-2 rounded-md transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.05,
                      color: "#2563eb",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.icon && <item.icon size={16} />}
                    <span className="font-medium">{item.name}</span>
                    {item.name === "Categories" && (
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </motion.div>

                  {/* Categories Dropdown */}
                  {item.name === "Categories" && (
                    <motion.div
                      className="absolute left-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 10, opacity: 0 }}
                    >
                      <div className="p-4 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Popular Categories
                          </h3>
                          {categories.left.map((category) => (
                            <motion.div
                              key={category.id}
                              onClick={() => {
                                const encryptedId = encryptId(category.id);
                                navigate(`/product/${encodeURIComponent(encryptedId)}`);
                              }}
                              className="block px-1.5 py-1 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200 cursor-pointer"
                              whileHover={{ x: 5 }}
                            >
                              {category.category_name}
                            </motion.div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            More Categories
                          </h3>
                          {categories.right.map((category) => (
                            <motion.div
                              key={category.id}
                              onClick={() => {
                                const encryptedId = encryptId(category.id);
                                navigate(`/product/${encodeURIComponent(encryptedId)}`);
                              }}
                              className="block px-1.5 py-1 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200 cursor-pointer"
                              whileHover={{ x: 5 }}
                            >
                              {category.category_name}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 text-center border-t border-gray-200">
                        <div
                          onClick={() => navigate("/categories")}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          View all categories →
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Right side - Search and Cart */}
            <div className="flex items-center space-x-6">
              <div className="relative hidden md:block">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => {
                        setIsSearchFocused(true);
                        setShowSearchResults(true);
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          setIsSearchFocused(false);
                          setShowSearchResults(false);
                        }, 200);
                      }}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-gray-400" />
                    </div>
                  </div>
                </form>

                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute z-50 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="py-1">
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => handleProductClick(product.id)}
                        >
                          <div className="flex-shrink-0 mr-3">
                            {product.subs?.[0]?.product_images ? (
                              <img
                                src={`${
                                  productsData.image_url.find(
                                    (img) => img.image_for === "Product"
                                  ).image_url
                                }${product.subs[0].product_images}`}
                                alt={product.product_name}
                                className="h-10 w-10 object-cover rounded"
                              />
                            ) : (
                              <img
                                src={
                                  productsData.image_url.find(
                                    (img) => img.image_for === "No Image"
                                  ).image_url
                                }
                                alt="No image"
                                className="h-10 w-10 object-cover rounded"
                              />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {product.product_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {product.category_names}
                            </div>
                            <div className="text-sm font-semibold text-blue-600">
                              ₹
                              {product.product_spl_offer_price > 0
                                ? product.product_spl_offer_price
                                : product.product_selling_price}
                              {product.product_mrp !=
                                product.product_selling_price && (
                                <span className="ml-2 text-xs text-gray-500 line-through">
                                  ₹{product.product_mrp}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <motion.div
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors duration-300 "
                variants={cartVariants}
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart size={20} onClick={() => navigate("/cart")} />
                <div
                  onClick={() => navigate("/cart")}
                  className=" flex  flex-col text-sm"
                >
                  <span className="text-xs">Cart</span>
                  <span className="font-medium">
                    {useSelector((state) => state.cart.items).length}-
                    {useSelector((state) => state.cart.items).length > 1
                      ? "ITEMS"
                      : "ITEM"}
                  </span>
                </div>
              </motion.div>

              {/* Mobile menu button */}
              <div className="hidden  md:block lg:hidden ">
                <motion.button
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  className="text-gray-600 hover:text-blue-600 focus:outline-none transition-colors duration-300"
                  aria-label="Toggle menu"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    {mobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X size={24} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu size={24} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="hidden sm:hidden md:block lg:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              className="hidden sm:hidden md:block lg:hidden fixed top-0 left-0 h-full w-72 bg-white z-50 overflow-y-auto border-r border-gray-100"
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {/* Sidebar Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <motion.div
                    className="flex items-center"
                    variants={menuItemVariants}
                  >
                    <img src={storeLogoImage} alt="Logo" className="h-8 w-auto" />
                  </motion.div>
                  <motion.button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    variants={menuItemVariants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-4">
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <div key={item.name}>
                      <motion.div
                        onClick={() => {
                          if (item.name !== "Categories") {
                            navigate(item.path);
                            setMobileMenuOpen(false);
                          } else {
                            toggleMobileCategories();
                          }
                        }}
                        className="px-3 py-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200 group"
                        variants={menuItemVariants}
                        whileHover={{
                          backgroundColor: "#f9fafb",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {item.icon ? (
                              <item.icon
                                size={18}
                                className="text-gray-500 group-hover:text-blue-600 transition-colors"
                              />
                            ) : (
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full group-hover:bg-blue-600 transition-colors"></div>
                            )}
                            <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                              {item.name}
                            </span>
                          </div>
                          {item.name === "Categories" && (
                            <svg
                              className={`w-4 h-4 text-gray-400 transition-transform ${
                                mobileCategoriesOpen ? "rotate-90" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          )}
                        </div>
                      </motion.div>

                      {/* Mobile Categories Dropdown */}
                      {item.name === "Categories" && (
                        <motion.div
                          className="overflow-hidden"
                          initial="closed"
                          animate={mobileCategoriesOpen ? "open" : "closed"}
                          variants={mobileCategoryVariants}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="pl-8 py-2 space-y-2">
                            {categoryData?.data?.map((category) => (
                              <motion.div
                                key={category.id}
                                onClick={() => {
                                  const encryptedId = encryptId(category.id);
                                  navigate(`/product/${encodeURIComponent(encryptedId)}`);
                                  setMobileMenuOpen(false);
                                }}
                                className="px-3 py-2 text-gray-600 hover:text-blue-600 cursor-pointer"
                                whileHover={{ x: 5 }}
                              >
                                {category.category_name}
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Search Box */}
                <motion.div className="mb-4" variants={menuItemVariants}>
                  <form onSubmit={handleSearchSubmit}>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search products..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-0 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm placeholder-gray-400 transition-all duration-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setShowSearchResults(true)}
                        onBlur={() =>
                          setTimeout(() => setShowSearchResults(false), 200)
                        }
                      />
                    </div>
                  </form>

                  {/* Mobile Search Results */}
                  {showSearchResults && searchResults.length > 0 && (
                    <motion.div
                      className="mt-2 bg-white rounded-lg shadow-md border border-gray-200"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="py-1">
                        {searchResults.map((product) => (
                          <motion.div
                            key={product.id}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              handleProductClick(product.id);
                              setMobileMenuOpen(false);
                            }}
                            whileHover={{ backgroundColor: "#f3f4f6" }}
                          >
                            <div className="flex items-center">
                              <div className="flex-shrink-0 mr-3">
                                {product.subs?.[0]?.product_images ? (
                                  <img
                                    src={`${
                                      productsData.image_url.find(
                                        (img) => img.image_for === "Product"
                                      ).image_url
                                    }${product.subs[0].product_images}`}
                                    alt={product.product_name}
                                    className="h-8 w-8 object-cover rounded"
                                  />
                                ) : (
                                  <img
                                    src={
                                      productsData.image_url.find(
                                        (img) => img.image_for === "No Image"
                                      ).image_url
                                    }
                                    alt="No image"
                                    className="h-8 w-8 object-cover rounded"
                                  />
                                )}
                              </div>
                              <div className="truncate">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {product.product_name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ₹{product.product_selling_price}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  className="mt-6 pt-6 border-t border-gray-100"
                  variants={menuItemVariants}
                >
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Contact
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-3">
                      <Phone size={14} className="text-gray-400" />
                      <span>{supportPhone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MessageCircleCode size={14} className="text-gray-400" />
                      <span>{supportWhatsapp}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Social Links */}
                <motion.div
                  className="mt-6 pt-6 border-t border-gray-100"
                  variants={menuItemVariants}
                >
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Follow Us
                  </h3>
                  <div className="flex items-center space-x-4">
                    {[Facebook, Twitter, Instagram, Youtube].map(
                      (Icon, index) => (
                        <motion.a
                          key={index}
                          href="#"
                          className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Icon className="w-5 h-5" />
                        </motion.a>
                      )
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;