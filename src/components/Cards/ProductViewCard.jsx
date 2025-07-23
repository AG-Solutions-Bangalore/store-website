import React, { useState, useRef, useEffect } from 'react';
import { X, Star, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/CartSlice';

import { toast } from 'sonner';


const ProductViewCard = ({ isOpen, onClose, product }) => {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);
    const [showZoom, setShowZoom] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [currentImage, setCurrentImage] = useState(null);
    const imageRef = useRef(null);

    useEffect(() => {
        if (product) {
            setCurrentImage(product.image);
            setQuantity(1);
      
            if (product.productData?.product_unit_value && product.productData?.unit_name) {
                setSelectedSize(`${product.productData.product_unit_value}${product.productData.unit_name}`);
            } else {
                setSelectedSize('250g'); 
            }
        }
    }, [product]);

    if (!isOpen || !product) return null;

    const handleQuantityChange = (change) => {
        setQuantity(prev => Math.max(1, prev + change));
    };
    const handleAddToCart = () => {
            if (!product) return;
            
            const cartItem = {
                id: product.id,
                name: product.title,
                price: product.originalPrice,
                quantity: quantity,
                image: product.image,
                size: selectedSize,
                
            };
            
            dispatch(addToCart(cartItem)); 
         
       toast.success(`${product.title} added to cart`)
       onClose()
           
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

    const handleThumbnailClick = (image) => {
        setCurrentImage(image);
        setShowZoom(false);
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`w-4 h-4 ${index < rating ? 'text-orange-400 fill-orange-400' : 'text-gray-300'}`}
            />
        ));
    };

    // Generate size options based on product data or use defaults
    const sizeOptions = product.productData?.product_unit_value && product.productData?.unit_name
        ? [`${product.productData.product_unit_value}${product.productData.unit_name}`]
        : ['250g', '500g', '1kg', '2kg'];

    return (
        <>
        
    
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
    {currentImage && (
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            <div className="p-4 md:p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0  hover:text-red-900 transition-colors z-50 text-red-600"
                >
                    <X className="w-8 h-8" />
                </button>
                <div className="w-full flex flex-col md:flex-row gap-4">
                    {/* Image Section */}
                    <div className="space-y-4 w-full md:w-[35%] border border-gray-200 rounded-md">
                        <div className="relative">
                            <div
                                ref={imageRef}
                                className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square cursor-crosshair"
                                onMouseMove={handleMouseMove}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <img
                                    src={currentImage}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                                {/* Sale & New badges */}
                                {product.onSale && (
                                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs md:text-sm font-medium z-10">
                                        Sale
                                    </div>
                                )}
                                {product.isNew && (
                                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs md:text-sm font-medium z-10">
                                        New
                                    </div>
                                )}

                                {showZoom && (
                                    <div className="absolute inset-0 overflow-hidden">
                                        <img
                                            src={currentImage}
                                            alt={`${product.title} - Zoomed`}
                                            className="w-full h-full object-cover"
                                            style={{
                                                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                                transform: 'scale(2)',
                                            }}
                                        />
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
                        </div>
                        <div className="flex space-x-2 border-t border-gray-200 p-2">
                            <div
                                className={`w-14 h-14 bg-gray-100 overflow-hidden cursor-pointer transition-all ${currentImage === product.image ? 'border-2 border-blue-500' : 'border border-gray-200'}`}
                                onClick={() => handleThumbnailClick(product.image)}
                            >
                                <img src={product.image} alt="Thumbnail" className="w-full h-full object-cover" />
                            </div>
                            {product.hoverImage && (
                                <div
                                    className={`w-14 h-14 bg-gray-100 overflow-hidden cursor-pointer transition-all ${currentImage === product.hoverImage ? 'border-2 border-blue-500' : 'border border-gray-200'}`}
                                    onClick={() => handleThumbnailClick(product.hoverImage)}
                                >
                                    <img src={product.hoverImage} alt="Thumbnail" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Details Section */}
                    <div className="w-full md:w-[65%] pl-0 md:pl-4 space-y-4">
                        <div>
                            <h1 className="text-xl md:text-2xl font-medium text-gray-700 mb-1">
                                {product.title}
                            </h1>
                            <p className="text-xs md:text-sm text-gray-500 mb-2">
                                Brand: {product.productData?.product_brand || 'N/A'}
                            </p>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {product.productData?.product_short_description !== 'undefined' 
                                    ? product.productData.product_short_description 
                                    : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center space-x-3">
                            <span className="text-2xl md:text-3xl font-bold text-gray-900">
                                ₹{product.originalPrice}
                            </span>
                            {product.price && product.price !== product.originalPrice && (
                                <span className="text-lg md:text-xl text-gray-500 line-through">
                                    ₹{product.price}
                                </span>
                            )}
                            {product.productData?.product_spl_offer_price > 0 && (
                                <span className="text-xs md:text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                                    Special Offer: ₹{product.productData.product_spl_offer_price}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Unit
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {sizeOptions.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-2 py-1 border rounded-sm text-xs font-medium transition-colors ${
                                            selectedSize === size
                                                ? 'bg-blue-900 text-white border-blue-900'
                                                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center border rounded-sm border-gray-200">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    className="p-2 hover:bg-gray-100 transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-2 text-center min-w-[3rem]">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    className="p-2 hover:bg-gray-100 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="bg-gray-600 text-white px-4 py-2 rounded-sm hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                <span>Add To Cart</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )}
</div>

        </>
    );
};

export default ProductViewCard;