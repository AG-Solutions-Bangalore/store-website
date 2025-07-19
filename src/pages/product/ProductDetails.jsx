import React, { useState, useRef, useEffect } from 'react';
import { Star, Heart, Eye, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import ProductCard from '../../components/Cards/ProductCard';
import ProductViewCard from '../../components/Cards/ProductViewCard';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BASE_URL from '../../config/BaseUrl';

const fetchProductDetails = async (productId) => {
  const response = await axios.get(`${BASE_URL}/api/web-fetch-product-by-id/${productId}`);
  return response.data;
};

const fetchRelatedProducts = async (categoryId) => {
  const response = await axios.get(`${BASE_URL}/api/web-fetch-categoryproduct-by-id/${categoryId}`);
  return response.data;
};

const ProductDetails = () => {
  const { id } = useParams();
  const [selectedWeight, setSelectedWeight] = useState('250g');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const imageRef = useRef(null);

  // Fetch product details
  const { data: productData, isLoading, error } = useQuery({
    queryKey: ['productDetails', id],
    queryFn: () => fetchProductDetails(id)
  });

  // Fetch related products
  const { data: relatedProductsData } = useQuery({
    queryKey: ['relatedProducts', productData?.data?.category_ids],
    queryFn: () => fetchRelatedProducts(productData?.data?.category_ids),
    enabled: !!productData?.data?.category_ids
  });

  const handleProductView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Transform product data for display
  const transformProductData = (apiData) => {
    if (!apiData || !apiData.data) return null;
    
    const product = apiData.data;
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
      isNew: true,
      productData: product
    };
  };

  // Transform related products data
  const transformRelatedProducts = (apiData) => {
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
          ? product.product_selling_price 
          : product.product_mrp,
        rating: 0,
        weight: `${product.product_unit_value}${product.unit_name}`,
        onSale: product.product_spl_offer_price > 0,
        isNew: true,
        productData: product
      };
    }).filter(product => product.id !== parseInt(id)); // Exclude current product
  };

  const product = transformProductData(productData);
  const relatedProducts = transformRelatedProducts(relatedProductsData);
  const productImages = product ? [product.image, product.hoverImage].filter(Boolean) : [];

  const weightOptions = product ? [product.weight] : ['250g', '500g', '1kg', '2kg'];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${index < rating ? 'text-orange-400 fill-orange-400' : 'text-gray-300'}`}
      />
    ));
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    const boundedX = Math.max(0, Math.min(x, 100));
    const boundedY = Math.max(0, Math.min(y, 100));

    setZoomPosition({ x: boundedX, y: boundedY });
  };

  const handleMouseEnter = () => {
    setShowZoom(true);
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleQuantityChange = (action) => {
    if (action === 'increment') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrement' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading product</div>;
  if (!product) return <div>Product not found</div>;

  // Calculate discount percentage if on sale
  const discountPercentage = product.onSale 
    ? Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)
    : 0;

  return (
    <div className="w-full py-8">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Product Images */}
          <div className="space-y-4 border p-1 rounded-md border-gray-200 ">
            {/* Main Product Image */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
              <div
                ref={imageRef}
                className="relative w-full h-full cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={productImages[currentImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Sale/New badge */}
                {product.onSale && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium z-10">
                    Sale
                  </div>
                )}
                {product.isNew && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-sm font-medium z-10">
                    New
                  </div>
                )}
                
                {/* Zoom Effect */}
                {showZoom && (
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={productImages[currentImageIndex]}
                      alt={`${product.title} - Zoomed`}
                      className="w-full h-full object-cover"
                      style={{
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        transform: 'scale(2)',
                      }}
                    />
                    {/* Zoom indicator */}
                    <div
                      className="absolute border-2 border-white rounded-full pointer-events-none shadow-lg"
                      style={{
                        width: '1px',
                        height: '1px',
                        left: `calc(${zoomPosition.x}% - 75px)`,
                        top: `calc(${zoomPosition.y}% - 75px)`,
                      }}
                    />
                  </div>
                )}
              </div>
              
              {/* Navigation arrows */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md z-20"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md z-20"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex space-x-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right side - Product Details */}
          <div className="space-y-6 relative">
            {/* Product Title */}
            <div>
              <h1 className="text-2xl font-medium text-gray-800 mb-2">
                {product.title}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-gray-500">0 Ratings</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
              {product.originalPrice && product.originalPrice !== product.price && (
                <>
                  <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                  {discountPercentage > 0 && (
                    <span className="text-green-600 font-medium">-{discountPercentage}%</span>
                  )}
                </>
              )}
            </div>

            {/* SKU and Stock */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">SKU#: {product.productData?.product_unique || 'N/A'}</span>
              <span className="text-sm text-green-600">IN STOCK</span>
            </div>

            {/* MRP */}
            <div className="text-sm text-gray-600">
              M.R.P.: ₹{product.productData?.product_mrp || 'N/A'}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.productData?.product_short_description !== 'undefined' 
                ? product.productData.product_short_description 
                : 'No description available.'}
            </p>

            {/* Product Details */}
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="text-gray-600 w-32">Brand:</span>
                <span className="text-gray-900">{product.productData?.product_brand || 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">Category:</span>
                <span className="text-gray-900">{product.category}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">Weight:</span>
                <span className="text-gray-900">{product.weight}</span>
              </div>
            </div>

            {/* Weight Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                WEIGHT
              </label>
              <div className="flex flex-wrap gap-2">
                {weightOptions.map((weight) => (
                  <button
                    key={weight}
                    onClick={() => setSelectedWeight(weight)}
                    className={`px-4 py-2 border rounded text-sm font-medium transition-colors ${
                      selectedWeight === weight
                        ? 'bg-blue-900 text-white border-blue-500'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {weight}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => handleQuantityChange('decrement')}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-center min-w-[3rem]">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange('increment')}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>

              <button className="flex-1 bg-blue-900 text-white px-6 py-3 rounded hover:bg-gray-700 transition-colors font-medium">
                ADD TO CART
              </button>

              <button className="p-3 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                <Heart className="w-5 h-5" />
              </button>

              <button className="p-3 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 3).map((product, index) => (
              <div key={index} className="bg-gray-200/70 flex flex-row items-center gap-4 rounded-md shadow-sm border border-gray-200 p-2">
                <div className="border border-gray-200 rounded-md bg-white">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-16 h-16 rounded-lg m-auto"
                  />
                </div>
                <div>
                  <h3 className="font-thin text-sm text-gray-600 mb-2">{product.title}</h3>
                  <div className="flex items-center space-x-1 mb-2">
                    {renderStars(product.rating)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">₹{product.price}</span>
                    {product.originalPrice && product.originalPrice !== product.price && (
                      <span className="text-gray-500 line-through text-sm">₹{product.originalPrice}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-12">
          <div className="flex space-x-2">
            <button className="text-white px-6 py-2 rounded-md shadow-md border border-bule-600 bg-blue-900 font-medium">
              Detail
            </button>
            <button className="px-6 py-2 rounded-md border border-gray-200">
              Specifications
            </button>
            <button className="px-6 py-2 rounded-md border border-gray-200">
              Vendor
            </button>
            <button className="px-6 py-2 rounded-md border border-gray-200">
              Reviews
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-1 border border-gray-200 rounded-md p-4">
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.productData?.product_short_description !== 'undefined' 
                ? product.productData.product_short_description 
                : 'No additional details available.'}
            </p>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mb-8 mt-20 flex flex-col items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl text-center font-medium text-gray-900">
              Related <span className="text-blue-900">Products</span>
            </h2>
            <p className="text-gray-600 font mt-2">
              Browse The Collection of Top Products
            </p>
          </div>
        </div>

        {/* Related Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
          {relatedProducts.slice(0, 5).map((product, index) => (
            <ProductCard
              key={index}
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
  );
};

export default ProductDetails;