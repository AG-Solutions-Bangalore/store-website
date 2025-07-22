import React, { useState } from "react";
import { ChevronDown, ChevronLeft } from "lucide-react";
import ProductCard from "../../components/Cards/ProductCard";
import ProductViewCard from "../../components/Cards/ProductViewCard";

const Checkout = () => {
  const [couponCode, setCouponCode] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    country: "",
    region: "",
    city: "",
    postCode: "",
  });

  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
      const [selectedProduct, setSelectedProduct] = useState(null);
      const handleProductView = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
      };
    
      const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
      };
  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "India",
  ];
  const regions = ["California", "New York", "Texas", "Florida", "Illinois"];
  const cities = [
    "New York City",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
  ];
  const products = [
    {
      image: "https://maraviyainfotech.com/projects/grabit-react/assets/img/product-images/6_1.jpg",
      hoverImage: "https://maraviyainfotech.com/projects/grabit-react/assets/img/product-images/6_2.jpg",
      title: "Mixed Nuts Berries Pack",
      category: "Dried Fruits",
      price: "56.00",
      originalPrice: "45.00",
      rating: 4,
      onSale: true
    },
    {
      image: "https://maraviyainfotech.com/projects/grabit-react/assets/img/product-images/3_1.jpg",
      hoverImage: "https://maraviyainfotech.com/projects/grabit-react/assets/img/product-images/3_2.jpg",
      title: "Multi Grain Combo Cookies",
      category: "Cookies",
      price: "30.00",
      originalPrice: "25.00",
      rating: 3,
      weight: "10kg",
      onSale: true
    },
    {
      image: "https://maraviyainfotech.com/projects/grabit-react/assets/img/product-images/9_1.jpg",
      hoverImage: "https://maraviyainfotech.com/projects/grabit-react/assets/img/product-images/9_2.jpg",
      title: "Fresh Mango Juice Pack",
      category: "Foods",
      price: "65.00",
      originalPrice: "40.00",
      rating: 2,
      onSale: true
    },
    {
      image: "https://maraviyainfotech.com/projects/grabit-react/assets/img/product-images/2_1.jpg",
      hoverImage: "https://maraviyainfotech.com/projects/grabit-react/assets/img/product-images/2_2.jpg",
      title: "Dates Value Fresh Pouch",
      category: "Dried Fruits",
      price: "85.00",
      originalPrice: "70.00",
      rating: 3,
      onSale: true
    },
    {
      image: "https://maraviyainfotech.com/projects/grabit-react/assets/img/product-images/1_1.jpg",
      hoverImage: "https://maraviyainfotech.com/projects/grabit-react/assets/img/product-images/1_2.jpg",
      title: "Stick Fiber Masala Magic",
      category: "Foods",
      price: "50.00",
      originalPrice: "45.00",
      rating: 2,
      weight: "2pack",
      isNew: true
    }
  ];
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const cartItems = [
    {
      id: 1,
      name: "Women's Wallet Hand Purse",
      price: 70.0,
      originalPrice: 50.0,
      quantity: 1,
      image:
        "https://maraviyainfotech.com/projects/grabit-react/assets/img/product-images/6_1.jpg",
      rating: 5,
    },
    {
      id: 2,
      name: "Fresh Lichi",
      price: 11.0,
      originalPrice: 10.0,
      quantity: 1,
      image:
        "https://maraviyainfotech.com/projects/grabit-react/assets/img/product-images/2_1.jpg",
      rating: 0,
    },
  ];

  const subtotal = 203.0;
  const deliveryCharges = 40.6;
  const total = subtotal + deliveryCharges;

  return (
    <div className="w-full py-8 min-h-screen">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Column - Summary */}
          <div className="w-full lg:w-[35%]">
            <div className="bg-white rounded-md border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Summary</h2>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sub-Total</span>
                  <span className="text-gray-900 font-medium">
                  &#8377;{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className="text-gray-900 font-medium">
                  &#8377;{deliveryCharges.toFixed(2)}
                  </span>
                </div>

              

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-lg font-medium">
                    <span className="text-gray-900">Total Amount</span>
                    <span className="text-gray-900">&#8377;{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-md"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-800">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1 my-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-sm ${
                              star <= item.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">
                        &#8377;{item.price.toFixed(2)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-gray-500 line-through text-xs">
                            &#8377;{item.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Billing Details */}
          <div className="w-full lg:w-[65%]">
            <div className="bg-white rounded-md border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Billing Details
                </h2>
              </div>

              <div className="p-4 space-y-6">
                {/* Checkout Options */}
                

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name*
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name*
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setCountryDropdownOpen(!countryDropdownOpen)
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-left flex items-center justify-between hover:border-gray-400 focus:outline-none text-sm"
                        >
                          <span
                            className={`${
                              formData.country
                                ? "text-gray-700"
                                : "text-gray-400"
                            }`}
                          >
                            {formData.country || "Select Country"}
                          </span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                        {countryDropdownOpen && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                            {countries.map((country) => (
                              <button
                                key={country}
                                onClick={() => {
                                  setFormData({ ...formData, country });
                                  setCountryDropdownOpen(false);
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm text-gray-700"
                              >
                                {country}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Region State
                      </label>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setRegionDropdownOpen(!regionDropdownOpen)
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-left flex items-center justify-between hover:border-gray-400 focus:outline-none text-sm"
                        >
                          <span
                            className={`${
                              formData.region
                                ? "text-gray-700"
                                : "text-gray-400"
                            }`}
                          >
                            {formData.region || "Select Region/State"}
                          </span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                        {regionDropdownOpen && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                            {regions.map((region) => (
                              <button
                                key={region}
                                onClick={() => {
                                  setFormData({ ...formData, region });
                                  setRegionDropdownOpen(false);
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm text-gray-700"
                              >
                                {region}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City*
                      </label>
                      <div className="relative">
                        <button
                          onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-left flex items-center justify-between hover:border-gray-400 focus:outline-none text-sm"
                        >
                          <span
                            className={`${
                              formData.city ? "text-gray-700" : "text-gray-400"
                            }`}
                          >
                            {formData.city || "Select City"}
                          </span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                        {cityDropdownOpen && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                            {cities.map((city) => (
                              <button
                                key={city}
                                onClick={() => {
                                  setFormData({ ...formData, city });
                                  setCityDropdownOpen(false);
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm text-gray-700"
                              >
                                {city}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Post Code
                      </label>
                      <input
                        type="text"
                        name="postCode"
                        value={formData.postCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button className="text-gray-600 hover:text-blue-800 text-sm font-medium flex items-center">
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Back to Cart
                    </button>
                    <button className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800 text-sm font-medium">
                      Place Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>



        
        </div>
        <div className="mb-8 mt-20 flex flex-col   items-center justify-between gap-4">
          <div >
            <h2 className="text-3xl text-center font-medium text-gray-900">
            New <span className="text-blue-900">Arrivals</span>
            </h2>
            <p className="text-gray-600 font mt-2">
            Browse The Collection of Top Products
            </p>
          </div>
          </div>


          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
                       {products.map((product, index) => (
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

export default Checkout;
