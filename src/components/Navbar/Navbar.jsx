import React, { useState, useEffect } from 'react';
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
  Youtube
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 


  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
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
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  const logoVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.6, delay: 0.5 }
    }
  };

  const cartVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.6, delay: 0.5 }
    }
  };

  const socialVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.5, delay: 0.3 }
    }
  };


  const sidebarVariants = {
    closed: {
      x: "-100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  const menuItemVariants = {
    closed: { x: -50, opacity: 0 },
    open: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'Products', path: '/product' },
    // { name: 'Checkout', path: '/checkout' },
    // { name: 'Offers', path: '/offers', icon: Gift }
  ];

  return (
    <motion.div 
      className={`w-full transition-all duration-300 relative `}
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
                  <span>+91 987 654 3210</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MessageCircleCode size={12} />
                  <span>+91 988 888 8888</span>
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
                    <Icon className='w-4 h-4'/>
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
              onClick={() => navigate('/')}
            >
              <img
                src="/logo-bg.png"
                alt="Lohiya's Logo"
                className="h-10 w-auto"
              />
            </motion.div>

            {/* Desktop Navigation Menu */}
            <div className="hidden lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:flex lg:items-center lg:space-x-8">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 cursor-pointer px-3 py-2 rounded-md transition-all duration-300"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    color: "#2563eb"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.icon && <item.icon size={16} />}
                  <span className="font-medium">{item.name}</span>
                </motion.div>
              ))}
            </div>

            {/* Right side - Search and Cart */}
            <div className="flex items-center space-x-6">
              <motion.div 
                className="text-gray-600 hover:text-gray-900 cursor-pointer hidden sm:block transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search size={20} />
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors duration-300"
                variants={cartVariants}
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5
                }}
                
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart size={20} onClick={() => navigate('/cart')} />
                <div onClick={() => navigate('/cart')} className="hidden sm:flex sm:flex-col text-sm">
                  <span className="text-xs">Cart</span>
                  <span className="font-medium">      {useSelector(state => state.cart.items).length}-ITEMS</span>
                </div>
              </motion.div>
              
              {/* Mobile menu button */}
              <div className="lg:hidden">
                <motion.button
                  onClick={() => setMobileMenuOpen(prev => !prev)}
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
        className="lg:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
        variants={overlayVariants}
        initial="closed"
        animate="open"
        exit="closed"
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <motion.div
        className="lg:hidden fixed top-0 left-0 h-full w-72 bg-white z-50 overflow-y-auto border-r border-gray-100"
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
              <img
                src="/logo-bg.png"
                alt="Logo"
                className="h-8 w-auto"
              />
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
            {menuItems.map((item, index) => (
              <motion.div
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200 group"
                variants={menuItemVariants}
                whileHover={{ 
                  backgroundColor: "#f9fafb" 
                }}
              >
                <div className="flex items-center space-x-3">
                  {item.icon ? (
                    <item.icon size={18} className="text-gray-500 group-hover:text-blue-600 transition-colors" />
                  ) : (
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full group-hover:bg-blue-600 transition-colors"></div>
                  )}
                  <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Search Box */}
          <motion.div
            className="mt-6"
            variants={menuItemVariants}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search..." 
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm placeholder-gray-400 transition-all duration-200"
              />
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="mt-6 pt-6 border-t border-gray-100"
            variants={menuItemVariants}
          >
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Contact</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-3">
                <Phone size={14} className="text-gray-400" />
                <span>+91 987 654 3210</span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircleCode size={14} className="text-gray-400" />
                <span>+91 988 888 8888</span>
              </div>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="mt-6 pt-6 border-t border-gray-100"
            variants={menuItemVariants}
          >
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Follow Us</h3>
            <div className="flex items-center space-x-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className='w-5 h-5'/>
                </motion.a>
              ))}
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