import React, { useState, useRef, useEffect } from 'react';
import { X, ShoppingCart, Plus, Minus, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/CartSlice';
import { toast } from 'sonner';
import { addToRecentlyViewed } from '../../redux/slices/recentlyViewedSlice';

const ProductViewCard = ({ isOpen, onClose, product }) => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);
    const [showZoom, setShowZoom] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [currentImage, setCurrentImage] = useState(null);
    const modalRef = useRef(null);
    const imageRef = useRef(null);


    const cartItem = product ? cartItems.find(item => item.id === product.id && item.size === selectedSize) : null;
    const currentCartQuantity = cartItem ? cartItem.quantity : 0;
    const isInCart = currentCartQuantity > 0;
useEffect(() => {
  if (product && Object.keys(product).length > 0) {
    dispatch(addToRecentlyViewed({
      id: product.id,
      title: product.title,
      image: product.image,
      hoverImage: product.hoverImage || product.image,
      price: product.price,
      originalPrice: product.originalPrice,
      weight: product.weight,
      category: product.category,
      rating: product.rating || 4,
      onSale: product.onSale,
      isNew: product.isNew
    }));
  }
}, [product, dispatch]);
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    useEffect(() => {
        if (product) {
            setCurrentImage(product.image);
   
            setQuantity(isInCart ? currentCartQuantity : 1);

            const defaultSize = product.productData?.product_unit_value && product.productData?.unit_name
                ? `${product.productData.product_unit_value}${product.productData.unit_name}`
                : '250g';
            setSelectedSize(defaultSize);
        }
    }, [product, isInCart, currentCartQuantity]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !product) return null;

    const handleQuantityChange = (change) => {
        setQuantity(prev => {
            const newQuantity = prev + change;
          
            return Math.max(1, newQuantity);
        });
    };

    const handleAddToCart = () => {
        if (!product) return;

       
        const quantityDifference = quantity - currentCartQuantity;

  
        if (quantityDifference === 0 && isInCart) {
            toast.info(`${product.title} quantity remains the same`);
            onClose();
            return;
        }

        const cartItem = {
            id: product.id,
            name: product.title,
            price: product.originalPrice,
            quantity: Math.abs(quantityDifference), 
            image: product.image,
            size: selectedSize,
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
        
        onClose();
    };

    const handleMouseMove = (e) => {
        if (!imageRef.current) return;

        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setZoomPosition({
            x: Math.max(0, Math.min(x, 100)),
            y: Math.max(0, Math.min(y, 100))
        });
    };

    const handleThumbnailClick = (image) => {
        setCurrentImage(image);
        setShowZoom(false);
    };

    const sizeOptions = product.productData?.product_unit_value && product.productData?.unit_name
        ? [`${product.productData.product_unit_value}${product.productData.unit_name}`]
        : ['250g', '500g', '1kg', '2kg'];

    const discountPercent = product.price && product.originalPrice
        ? Math.round(((product.price - product.originalPrice) / product.price) * 100)
        : 0;

    return (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4 overflow-y-auto ">
            <div
                ref={modalRef}
                className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] md:max-h-[95vh] overflow-y-auto custom-scroll"
            >
                <div className="p-4 md:p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 hover:text-red-900 transition-colors z-50 text-red-600"
                        aria-label="Close product view"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Compact Image Section */}
                        <div className="w-full md:w-[35%] space-y-2">
                            <div className="relative border border-gray-200 rounded-md overflow-hidden">
                                <div
                                    ref={imageRef}
                                    className="relative bg-gray-100 rounded-lg aspect-square cursor-crosshair"
                                    onMouseMove={handleMouseMove}
                                    onMouseEnter={() => setShowZoom(true)}
                                    onMouseLeave={() => setShowZoom(false)}
                                >
                                    <img
                                        src={currentImage}
                                        alt={product.title}
                                        className="w-full h-full object-contain p-2"
                                        loading="lazy"
                                    />

                                    {product.onSale && (
                                        <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded text-xs font-semibold bg-green-400 text-black">
                                            {discountPercent}% OFF
                                        </div>
                                    )}

                                    {showZoom && (
                                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                            <img
                                                src={currentImage}
                                                alt={`${product.title} - Zoomed`}
                                                className="w-full h-full object-cover"
                                                style={{
                                                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                                    transform: 'scale(2)',
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {product.productData.allImages.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto py-2">
                                    {/* Show default image first */}
                                    {product.productData.allImages
                                        .filter(img => img.is_default === "true")
                                        .map((img, idx) => (
                                            <button
                                                key={`default-${idx}`}
                                                onClick={() => handleThumbnailClick(img.url)}
                                                className={`flex-shrink-0 w-10 h-10 bg-gray-100 overflow-hidden cursor-pointer transition-all border ${currentImage === img.url ? 'border-2 border-blue-500' : 'border-gray-200'
                                                    }`}
                                            >
                                                <img
                                                    src={img.url}
                                                    alt="Default thumbnail"
                                                    className="w-full h-full object-contain p-1"
                                                    loading="lazy"
                                                />
                                            </button>
                                        ))}

                                    {/* Show remaining images */}
                                    {product.productData.allImages
                                        .filter(img => img.is_default !== "true")
                                        .map((img, idx) => (
                                            <button
                                                key={`other-${idx}`}
                                                onClick={() => handleThumbnailClick(img.url)}
                                                className={`flex-shrink-0 w-10 h-10 bg-gray-100 overflow-hidden cursor-pointer transition-all border ${currentImage === img.url ? 'border-2 border-blue-500' : 'border-gray-200'
                                                    }`}
                                            >
                                                <img
                                                    src={img.url}
                                                    alt={`Thumbnail ${idx + 1}`}
                                                    className="w-full h-full object-contain p-1"
                                                    loading="lazy"
                                                />
                                            </button>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* Product Details Section */}
                        <div className="w-full md:w-[65%] space-y-3">
                            <div>
                                <h1 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
                                    {product.title}
                                </h1>
                                <p className="text-xs text-gray-500 mb-2">
                                    Brand: {product.productData?.product_brand || 'N/A'}
                                </p>
                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                    {product.productData?.product_short_description !== 'undefined'
                                        ? product.productData.product_short_description
                                        : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xl font-bold text-gray-900">
                                    ₹{product.originalPrice}
                                </span>
                                {product.price && product.price !== product.originalPrice && (
                                    <span className="text-base text-gray-500 line-through">
                                        ₹{product.price}
                                    </span>
                                )}
                                {product.productData?.product_spl_offer_price > 0 && (
                                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                        Special Offer: ₹{product.productData.product_spl_offer_price}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                {/* <label className="block text-sm font-medium text-gray-700">
                                    Unit
                                </label> */}
                                <div className="flex flex-wrap gap-2">
                                    {sizeOptions.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-2 py-1 text-xs border rounded transition-colors ${selectedSize === size
                                                    ? 'bg-blue-900 text-white border-blue-900'
                                                    : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <div className="flex-1 flex items-center border rounded border-gray-200">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        className={`flex-1 p-1 hover:bg-gray-100 transition-colors ${
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
                                        className="flex-1 p-1 hover:bg-gray-100 transition-colors"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus className="w-3 h-3 mx-auto" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className={`flex-1 px-3 py-2 rounded transition-colors flex items-center justify-center gap-2 text-sm ${
                                        isInCart 
                                            ? 'bg-green-700 hover:bg-green-600 text-white'
                                            : 'bg-blue-900 hover:bg-blue-600 text-white'
                                    }`}
                                >
                                    {isInCart ? (
                                        <CheckCircle className="w-4 h-4" />
                                    ) : (
                                        <ShoppingCart className="w-4 h-4" />
                                    )}
                                    <span>
                                        {isInCart ? 'Update Quantity' : 'Add To Cart'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductViewCard;