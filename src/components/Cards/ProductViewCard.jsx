import React, { useState, useRef, useEffect } from 'react';
import { X, Star, ShoppingCart, Plus, Minus } from 'lucide-react';

const ProductViewCard = ({ isOpen, onClose, product }) => {
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
            // Set default size based on product data if available
            if (product.productData?.product_unit_value && product.productData?.unit_name) {
                setSelectedSize(`${product.productData.product_unit_value}${product.productData.unit_name}`);
            } else {
                setSelectedSize('250g'); // Fallback default
            }
        }
    }, [product]);

    if (!isOpen || !product) return null;

    const handleQuantityChange = (change) => {
        setQuantity(prev => Math.max(1, prev + change));
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
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
            {currentImage && (
                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 relative">
                        <button
                            onClick={onClose}
                            className="absolute top-1 right-1 text-gray-600 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="w-full flex flex-row gap-4">
                            {/* Image Section */}
                            <div className="space-y-4 w-[35%] border border-gray-200 rounded-md">
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
                                <div className="flex space-x-2 border-t border-gray-200">
                                    <div
                                        className={`w-16 h-16 bg-gray-100 rounded-none overflow-hidden cursor-pointer transition-all ${currentImage === product.image ? 'border-2 border-blue-500' : 'border border-gray-200'}`}
                                        onClick={() => handleThumbnailClick(product.image)}
                                    >
                                        <img
                                            src={product.image}
                                            alt="Thumbnail"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {product.hoverImage && (
                                        <div
                                            className={`w-16 h-16 bg-gray-100 rounded overflow-hidden cursor-pointer transition-all ${currentImage === product.hoverImage ? 'border-2 border-blue-500' : 'border border-gray-200'}`}
                                            onClick={() => handleThumbnailClick(product.hoverImage)}
                                        >
                                            <img
                                                src={product.hoverImage}
                                                alt="Thumbnail"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Product Details Section */}
                            <div className="w-[75%] pl-4 p-2 space-y-4">
                                <div>
                                    <h1 className="text-2xl font-medium text-gray-700 mb-2">
                                        {product.title}
                                    </h1>
                                    <p className="text-sm text-gray-500 mb-2">
                                        Brand: {product.productData?.product_brand || 'N/A'}
                                    </p>

                                    <div className="flex items-center space-x-2 mb-4">
                                        <div className="flex">
                                            {renderStars(product.rating)}
                                        </div>
                                        <span className="text-sm text-gray-500">({product.rating}/5)</span>
                                    </div>

                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {product.productData?.product_short_description !== 'undefined' 
                                            ? product.productData.product_short_description 
                                            : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'}
                                    </p>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <span className="text-3xl font-bold text-gray-900">
                                        ₹{product.price}
                                    </span>
                                    {product.originalPrice && product.originalPrice !== product.price && (
                                        <span className="text-xl text-gray-500 line-through">
                                            ₹{product.originalPrice}
                                        </span>
                                    )}
                                    {product.productData?.product_spl_offer_price > 0 && (
                                        <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                                            Special Offer: ₹{product.productData.product_spl_offer_price}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Size
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {sizeOptions.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-2 py-1 border rounded-sm text-xs font-medium transition-colors ${selectedSize === size
                                                        ? 'bg-blue-900 text-white border-blue-900'
                                                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
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

                                    <button className="bg-gray-600 text-white p-2 rounded-sm hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2">
                                        <ShoppingCart className="w-5 h-5" />
                                        <span>Add To Cart</span>
                                    </button>
                                </div>

                                {/* <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Category:</span>
                                        <span className="text-gray-900">{product.category}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Weight:</span>
                                        <span className="text-gray-900">{selectedSize || product.weight}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Product ID:</span>
                                        <span className="text-gray-900">{product.id}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Availability:</span>
                                        <span className="text-green-600">In Stock</span>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductViewCard;