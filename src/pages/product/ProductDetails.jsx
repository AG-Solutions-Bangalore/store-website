import React, { useState, useRef, useEffect } from 'react';
import { Star, Heart, Eye, ChevronLeft, ChevronRight, Settings, X, ShoppingCart, Plus, Minus, CheckCircle } from 'lucide-react';
import ProductCard from '../../components/Cards/ProductCard';
import ProductViewCard from '../../components/Cards/ProductViewCard';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BASE_URL from '../../config/BaseUrl';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/CartSlice';
import { toast } from 'sonner';
import ProductDetailsSkeleton from '../../components/skeletons/ProductDetailsSkeleton';
import { decryptId } from '../../utils/Encyrption';

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
  const decryptedId = decryptId(id);

  const [activeTab, setActiveTab] = useState('specs');
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const imageRef = useRef(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const cartItems = useSelector(state => state.cart.items);


  const { data: productData, isLoading, error } = useQuery({
    queryKey: ['productDetails', decryptedId],
    queryFn: () => fetchProductDetails(decryptedId)
  });


  const { data: relatedProductsData } = useQuery({
    queryKey: ['relatedProducts', productData?.data?.category_ids],
    queryFn: () => fetchRelatedProducts(productData?.data?.category_ids),
    enabled: !!productData?.data?.category_ids
  });

  const handleProductView = (product) => {
    setSelectedProduct(product);
    if (window.innerWidth < 768) {
      setIsMobileDrawerOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCloseDrawer = () => {
    setIsMobileDrawerOpen(false);
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
    }).filter(product => product.id !== parseInt(decryptedId)); 
  };

  const product = transformProductData(productData);
  const relatedProducts = transformRelatedProducts(relatedProductsData);
  const productImages = product ? product.productData.allImages.map(img => img.url) : [];




  const cartItem = product ? cartItems.find(item => item.id === product.id && item.size === product.weight) : null;
  const currentCartQuantity = cartItem ? cartItem.quantity : 0;
  const isInCart = currentCartQuantity > 0;

  useEffect(() => {
    if (product) {
    
      setQuantity(isInCart ? currentCartQuantity : 1);
    }
  }, [ isInCart, currentCartQuantity]);

  const handleAddToCart = () => {
    if (!product) return;
    
 
    const quantityDifference = quantity - currentCartQuantity;


    if (quantityDifference === 0 && isInCart) {
      toast.info(`${product.title} quantity remains the same`);
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.title,
      price: product.originalPrice,
      quantity: Math.abs(quantityDifference), 
      image: product.image,
      size: product.weight,
      mrp:product.price,

      operation: quantityDifference > 0 ? 'increment' : 'decrement'
    };
    
    dispatch(addToCart(cartItem));
    
    if (isInCart) {
      if (quantityDifference > 0) {
        toast.success(`Added ${quantityDifference} more ${product.title} to cart`);
      } else {
        toast.success(`Removed ${Math.abs(quantityDifference)} ${product.title} from cart`);
      }
    } else {
      toast.success(`${quantity} ${product.title} added to cart`);
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => {
      const newQuantity = prev + change;
  
      return Math.max(1, newQuantity);
    });
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

  const discountPercent = product?.price && product?.originalPrice
    ? Math.round(((product.price - product.originalPrice) / product.price) * 100)
    : 0;

  if (isLoading) return <ProductDetailsSkeleton/>;
  
  if (error) return (
    <div className="flex justify-center items-center h-screen text-red-500">
      Error loading product
    </div>
  );
  
  if (!product) return (
    <div className="flex justify-center items-center h-screen text-gray-500">
      Product not found
    </div>
  );

  return (
    <div className="w-full py-4 md:py-8">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8">
          {/* Left side - Product Images */}
          <div className="space-y-4 border p-1 col-span-1 md:col-span-2 rounded-md border-gray-200">
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
                  loading="lazy"
                />
                
                {/* Sale/New badge */}
                {product.onSale && (
                 <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded text-xs font-semibold bg-green-400 text-black">
                 {discountPercent}% OFF
             </div>
                )}
             
                
                {/* Zoom Effect - Desktop only */}
                {showZoom && window.innerWidth > 768 && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
                        width: '150px',
                        height: '150px',
                        left: `calc(${zoomPosition.x}% - 75px)`,
                        top: `calc(${zoomPosition.y}% - 75px)`,
                        opacity: 0.3
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
                    className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-1 md:p-2 rounded-full shadow-md z-20"
                  >
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-1 md:p-2 rounded-full shadow-md z-20"
                  >
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.productData.allImages && product.productData.allImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.productData.allImages
                  .sort((a, b) => b.is_default === "true" - a.is_default === "true")
                  .map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(productImages.indexOf(img.url))}
                      className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 ${
                        currentImageIndex === productImages.indexOf(img.url) ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Right side - Product Details */}
          <div className="space-y-4 md:space-y-6 relative col-span-1 md:col-span-3">
            {/* Product Title */}
            <div>
              <h1 className="text-xl md:text-2xl font-medium text-gray-800 mb-1 md:mb-2">
                {product.title}
              </h1>
            </div>

            {/* Price */}
            {(product.price == product.originalPrice) ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl md:text-3xl font-bold text-gray-900">
                  &#8377;{product.price}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl md:text-3xl font-bold text-gray-900">
                  &#8377;{product.originalPrice}
                </span>
                {product.price && (
                  <span className="text-lg md:text-xl text-gray-500 line-through">
                    &#8377;{product.price}
                  </span>
                )}
              </div>
            )}

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.productData?.product_short_description !== 'undefined' 
                ? product.productData.product_short_description 
                : 'No description available.'}
            </p>

            {/* Product Details */}
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="text-gray-600 w-24 md:w-32">Brand:</span>
                <span className="text-gray-900">{product.productData?.product_brand || 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-24 md:w-32">Category:</span>
                <span className="text-gray-900">{product.category}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-24 md:w-32">Unit:</span>
                <span className="text-gray-900">{product.weight}</span>
              </div>
            </div>

            {/* Weight Selection */}
            <div>
              <div className="flex flex-wrap gap-2">
                <p className={`px-3 py-1 md:px-4 md:py-2 border rounded text-xs md:text-sm font-medium transition-colors bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200`}>
                  {product.weight}
                </p>
              </div>
            </div>

        
            <div className="flex flex-col sm:flex-row gap-3 w-full">

  <div className="flex-1 flex items-center border rounded border-gray-200 max-w-full sm:max-w-[150px] md:max-w-[300px]">
    <button
      onClick={() => handleQuantityChange(-1)}
      className={`flex-1 p-2 hover:bg-gray-100 transition-colors ${
        quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      aria-label="Decrease quantity"
      disabled={quantity <= 1}
    >
      <Minus className="w-3 h-3 mx-auto" />
    </button>
    <span className={`px-3 py-1 text-center min-w-[2rem] ${
      isInCart ? 'bg-green-100 text-green-800 font-medium' : ''
    }`}>
      {quantity}
    </span>
    <button
      onClick={() => handleQuantityChange(1)}
      className="flex-1 p-2 hover:bg-gray-100 transition-colors"
      aria-label="Increase quantity"
    >
      <Plus className="w-3 h-3 mx-auto" />
    </button>
  </div>

 
  <button
    onClick={handleAddToCart}
    className={`flex-1 px-4 py-2  rounded transition-colors flex items-center justify-center gap-2 text-sm ${
      isInCart 
        ? 'bg-green-600 hover:bg-green-600 text-white'
        : 'bg-blue-900 hover:bg-blue-600 text-white'
    }`}
  >
    {isInCart ? (
      <CheckCircle className="w-4 h-4" />
    ) : (
      <ShoppingCart className="w-4 h-4" />
    )}
    <span className="whitespace-nowrap">
      {isInCart ? 'Update Quantity' : 'Add To Cart'}
    </span>
  </button>
</div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-6 md:mt-8">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-1 md:px-6 md:py-2 rounded-md border font-medium whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'text-white bg-blue-900 border-blue-600'
                  : 'border-gray-200'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('detail')}
              className={`px-4 py-1 md:px-6 md:py-2 rounded-md shadow-md border font-medium whitespace-nowrap ${
                activeTab === 'detail'
                  ? 'text-white bg-blue-900 border-blue-600'
                  : 'border-gray-200'
              }`}
            >
              Detail
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-1 border border-gray-200 rounded-md p-4">
            {activeTab === 'detail' && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.productData?.product_short_description !== 'undefined'
                  ? product.productData.product_short_description
                  : 'No additional details available.'}
              </p>
            )}
            {activeTab === 'specs' && (
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex">
                  <span className="w-24 md:w-32 text-gray-600">Brand:</span>
                  <span>{product.productData?.product_brand || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="w-24 md:w-32 text-gray-600">Category:</span>
                  <span>{product.category}</span>
                </div>
                <div className="flex">
                  <span className="w-24 md:w-32 text-gray-600">Unit:</span>
                  <span>{product.weight}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mb-6 md:mb-8 mt-8 md:mt-12 flex flex-col items-center justify-between gap-3 md:gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl text-center font-medium text-gray-900">
              Related <span className="text-blue-900">Products</span>
            </h2>
            <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
              Browse The Collection of Top Products
            </p>
          </div>
        </div>

        {/* Related Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {relatedProducts.slice(0, 5).map((product, index) => (
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
      
      {/* Product View Modal - Desktop */}
      {selectedProduct  && (
        <ProductViewCard 
        isOpen={isModalOpen || isMobileDrawerOpen} 
        onClose={window.innerWidth < 768 ? handleCloseDrawer : handleCloseModal}
          product={{
            ...selectedProduct,
            allImages: selectedProduct.productData.allImages
          }}
          isMobile={window.innerWidth < 768}
        />
      )}
    </div>
  );
};

export default ProductDetails;