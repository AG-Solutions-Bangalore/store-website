import React, { useState } from 'react';
import { X, Star, Package, MapPin, Building2, Hash, Weight, FileText, ChevronLeft, ShoppingCart, Eye, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { clearCompare, removeFromCompare } from '../../redux/slices/compareSlice';
import { addToCart } from '../../redux/slices/CartSlice';
import { encryptId } from '../../utils/Encyrption';

const Compare = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const compareItems = useSelector((state) => state.compare.items);
  const cartItems = useSelector((state) => state.cart.items);
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);

  const handleRemoveProduct = (productId) => {
    dispatch(removeFromCompare(productId));
    toast.info('Product removed from comparison');
    
    // Adjust mobile index if needed
    if (currentMobileIndex >= compareItems.length - 1 && currentMobileIndex > 0) {
      setCurrentMobileIndex(currentMobileIndex - 1);
    }
  };

  const handleClearCompare = () => {
    dispatch(clearCompare());
    setCurrentMobileIndex(0);
    toast.info('Comparison cleared');
  };

  const handleAddToCart = (product) => {
    const isInCart = cartItems.some(item => item.id === product.id);
    
    if (isInCart) {
      toast.warning(`${product.name} is already in your cart`);
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      size: product.weight,
    };

    dispatch(addToCart(cartItem));
    toast.success(`${product.name} added to cart`);
  };

  const handleViewDetails = (productId) => {
    const encryptedId = encryptId(productId);
    navigate(`/product-details/${encodeURIComponent(encryptedId)}`);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={14}
        className={index < Math.floor(rating) ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}
      />
    ));
  };

  const nextProduct = () => {
    setCurrentMobileIndex((prev) => (prev + 1) % compareItems.length);
  };

  const prevProduct = () => {
    setCurrentMobileIndex((prev) => (prev - 1 + compareItems.length) % compareItems.length);
  };

  // Desktop Comparison Row Component
  const ComparisonRow = ({ label, icon: Icon, children }) => (
    <div className="border-b border-gray-200 py-4">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-1 flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 xl:mb-0">
          {Icon && <Icon size={16} className="text-gray-500" />}
          {label}
        </div>
        <div className="xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4">
          {children}
        </div>
      </div>
    </div>
  );

  // Mobile Product Card Component
  const MobileProductCard = ({ product, index, total }) => {
    const isInCart = cartItems.some(item => item.id === product.id);
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header with navigation */}
        <div className="bg-blue-50 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={prevProduct}
              disabled={compareItems.length <= 1}
              className="p-1 rounded-full hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft size={18} className="text-blue-900" />
            </button>
            <span className="text-sm font-medium text-blue-900">
              {index + 1} of {total}
            </span>
            <button
              onClick={nextProduct}
              disabled={compareItems.length <= 1}
              className="p-1 rounded-full hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight size={18} className="text-blue-900" />
            </button>
          </div>
          <button
            onClick={() => handleRemoveProduct(product.id)}
            className="p-1 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Product Image */}
        <div className="p-4">
          <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 text-lg mb-2">{product.name}</h3>
              <div className="text-2xl font-bold text-blue-900">₹{product.price}</div>
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-gray-500">({product.reviews || 0} reviews)</span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <div className="text-gray-500">Category</div>
                <div className="font-medium">{product.category}</div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-500">Brand</div>
                <div className="font-medium">{product.brand || 'N/A'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-500">Weight</div>
                <div className="font-medium">{product.weight}</div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-500">SKU</div>
                <div className="font-medium font-mono text-xs">{product.sku || 'N/A'}</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="text-gray-500 text-sm mb-1">Description</div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description || 'No description available'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <button 
                onClick={() => handleAddToCart(product)}
                disabled={isInCart}
                className={`w-full py-3 px-4 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2 ${
                  isInCart
                    ? 'bg-green-100 text-green-800 cursor-not-allowed'
                    : 'bg-blue-900 hover:bg-blue-800 text-white'
                }`}
              >
                {isInCart ? (
                  <CheckCircle size={16} />
                ) : (
                  <ShoppingCart size={16} />
                )}
                {isInCart ? 'Added to Cart' : 'Add to Cart'}
              </button>
              <button 
                onClick={() => handleViewDetails(product.id)}
                className="w-full border border-gray-300 text-gray-700 text-sm py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (compareItems.length === 0) {
    return (
      <div className="w-full py-12 min-h-screen ">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">Product Comparison</h2>
            <p className="text-gray-500 mb-6">No products to compare yet</p>
            <Link 
              to="/" 
              className="inline-flex items-center bg-blue-900 text-white hover:bg-blue-800 font-medium px-6 py-3 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-6 min-h-screen ">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Product Comparison</h1>
              <p className="text-sm text-gray-600 mt-1">Compare {compareItems.length} products</p>
            </div>
            <button
              onClick={handleClearCompare}
              className="text-sm text-red-600 hover:text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center gap-2 border border-red-200"
            >
              <X size={16} />
              Clear All
            </button>
          </div>
        </div>

        {/* Mobile View - Card Carousel */}
        <div className="block lg:hidden">
          <MobileProductCard 
            product={compareItems[currentMobileIndex]} 
            index={currentMobileIndex}
            total={compareItems.length}
          />
          
          {/* Mobile Navigation Dots */}
          {compareItems.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {compareItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMobileIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentMobileIndex ? 'bg-blue-900' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Desktop View - Table Layout */}
        <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4">
            {/* Product Images - Smaller for desktop */}
            <ComparisonRow label="Product">
              {compareItems.map((product) => (
                <div key={product.id} className="relative group">
                  <button
                    onClick={() => handleRemoveProduct(product.id)}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-200 hover:bg-red-50 hover:text-red-600 transition-colors z-10"
                  >
                    <X size={14} />
                  </button>
                  <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                </div>
              ))}
            </ComparisonRow>

            {/* Price */}
            <ComparisonRow label="Price">
              {compareItems.map((product) => (
                <div key={product.id} className="text-blue-900 font-bold text-lg">
                  ₹{product.price}
                </div>
              ))}
            </ComparisonRow>

            {/* Category */}
            <ComparisonRow label="Category" icon={Package}>
              {compareItems.map((product) => (
                <div key={product.id} className="text-sm text-gray-600 font-medium">
                  {product.category}
                </div>
              ))}
            </ComparisonRow>

            {/* Ratings */}
            <ComparisonRow label="Ratings" icon={Star}>
              {compareItems.map((product) => (
                <div key={product.id} className="flex items-center gap-2">
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-xs text-gray-500">({product.reviews || 0})</span>
                </div>
              ))}
            </ComparisonRow>

            {/* Brand */}
            <ComparisonRow label="Brand" icon={Building2}>
              {compareItems.map((product) => (
                <div key={product.id} className="text-sm text-gray-600 font-medium">
                  {product.brand || 'N/A'}
                </div>
              ))}
            </ComparisonRow>

            {/* SKU */}
            <ComparisonRow label="SKU" icon={Hash}>
              {compareItems.map((product) => (
                <div key={product.id} className="text-sm text-gray-600 font-mono">
                  {product.sku || 'N/A'}
                </div>
              ))}
            </ComparisonRow>

            {/* Weight */}
            <ComparisonRow label="Weight" icon={Weight}>
              {compareItems.map((product) => (
                <div key={product.id} className="text-sm text-gray-600 font-medium">
                  {product.weight}
                </div>
              ))}
            </ComparisonRow>

            {/* Description */}
            <ComparisonRow label="Description" icon={FileText}>
              {compareItems.map((product) => (
                <div key={product.id} className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {product.description || 'No description available'}
                </div>
              ))}
            </ComparisonRow>
          </div>

          {/* Desktop Action Buttons */}
          <div className="p-4 ">
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
              <div className="lg:col-span-1"></div>
              <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3">
                {compareItems.map((product) => {
                  const isInCart = cartItems.some(item => item.id === product.id);
                  
                  return (
                    <div key={product.id} className="flex flex-col gap-2">
                      <button 
                        onClick={() => handleAddToCart(product)}
                        disabled={isInCart}
                        className={`w-full py-2.5 px-4 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2 ${
                          isInCart
                            ? 'bg-green-100 text-green-800 cursor-not-allowed'
                            : 'bg-blue-900 hover:bg-blue-800 text-white'
                        }`}
                      >
                        {isInCart ? (
                          <CheckCircle size={16} />
                        ) : (
                          <ShoppingCart size={16} />
                        )}
                        {isInCart ? 'Added' : 'Add to Cart'}
                      </button>
                      <button 
                        onClick={() => handleViewDetails(product.id)}
                        className="w-full border border-gray-300 text-gray-700 text-sm py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        View Details
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compare;