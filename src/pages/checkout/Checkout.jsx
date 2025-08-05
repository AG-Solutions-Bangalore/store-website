import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/CartSlice";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../config/BaseUrl";

import { toast } from "sonner";
import useNumericInput from "../../hooks/useNumericInput";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const keyDown = useNumericInput();
  const nameInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firm_name: "",
    gstin: "",
    name: "",
    mobile: "",
    whatsapp: "",
    email: "",
    address: "",
    delivery_instructions: "",
    delivery_charges: "0",
    discount_amount: "0",
  });
  const [sameAsMobile, setSameAsMobile] = useState(false);
  const [billingType, setBillingType] = useState("individual"); 
  const [errors, setErrors] = useState({
    firm_name: "",
    name: "",
    mobile: "",
    email: "",
    address: "",
    gstin: "",
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const subtotalMrp = cartItems.reduce(
    (sum, item) => sum + item.mrp * item.quantity,
    0
  );
  const deliveryCharges = parseFloat(formData.delivery_charges) || 0;
  // const discountAmount = parseFloat(formData.discount_amount) || 0;
  const discountAmount =subtotalMrp - subtotal
  const total = (subtotalMrp + deliveryCharges) - discountAmount;
  const discountPercentage =((discountAmount / subtotalMrp) * 100).toFixed(2)
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firm_name":
        if (value && value.length < 2) error = "Firm name must be at least 2 characters";
        break;
      case "name":
        if (!value.trim()) error = "Full name is required";
        else if (value.length < 3) error = "Name must be at least 3 characters";
        break;
      case "mobile":
        if (!value.trim()) error = "Mobile number is required";
        else if (!/^[0-9]{10}$/.test(value))
          error = "Invalid mobile number (10 digits required)";
        break;
      case "whatsapp":
        if (value && !/^[0-9]{10}$/.test(value))
          error = "Invalid WhatsApp number (10 digits required)";
        break;
      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Invalid email address";
        break;
      case "address":
        if (!value.trim()) error = "Address is required";
        else if (value.length < 10)
          error = "Address must be at least 10 characters";
        break;
      case "gstin":
        if (
          value &&
          !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
            value
          )
        ) {
          error = "Invalid GSTIN format eg.11AAAAA1111Z1A1";
        }
        break;
      default:
        break;
    }

    return error;
  };
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const transformedValue = name === "gstin" ? value.toUpperCase() : value;
    const error = validateField(name, transformedValue);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: transformedValue,
      };

      if (sameAsMobile && name === "mobile") {
        updated.whatsapp = transformedValue;
      }

      return updated;
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
  
    
    const requiredFields = ["name", "mobile", "email", "address"];
    
   
    if (billingType === "company" && formData.firm_name) {
      const error = validateField("firm_name", formData.firm_name);
      newErrors.firm_name = error;
      if (error) isValid = false;
    }
  
    requiredFields.forEach((key) => {
      const error = validateField(key, formData[key]);
      newErrors[key] = error;
      if (error) isValid = false;
    });
  
    setErrors(newErrors);
    return isValid;
  };

  const { mutate: placeOrder, isLoading } = useMutation({
    mutationFn: async (orderData) => {
      const response = await axios.post(
        `${BASE_URL}/api/web-create-guest-user-order`,
        orderData
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.code === 201) {
        const orderData = {
          order_id: `${data.data}`,
          total_amount: total.toFixed(2),
          address: formData.address,
          mobile: formData.mobile,
          support_phone: "+9198745632",
          subs: cartItems.map((item) => ({
            product_id: item.id,
            product_name: item.name,
            product_image: item.image,
            product_price: item.price.toString(),
            product_qnty: item.quantity.toString(),
            size: item.size || "Standard",
          })),
        };
        dispatch(clearCart());
        navigate("/order-success", { state: { orderData } });
        toast.success(`${data.message}`);
      }
    },
    onError: (error) => {
      console.error("Order placement failed:", error);
      navigate("/order-failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const orderData = {
      ...formData,
      subs: cartItems.map((item) => ({
        product_id: item.id,
        product_price: item.price.toString(),
        product_qnty: item.quantity.toString(),
      })),
    };

    placeOrder(orderData);
  };

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
                    ₹{subtotalMrp.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className="text-gray-900 font-medium">
                    ₹{deliveryCharges.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount Amount</span>
                  <span className="text-gray-900 font-medium">
                    -₹{discountAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-center">
                                    <div className="inline-flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg text-xs">
                                      <span className="bg-green-600 text-white px-2 py-0.5 rounded font-semibold">
                                      {
                                     discountPercentage

                                      }
                                   
                                        % OFF
                                      </span>
                                      <span className="text-green-600 font-medium">
                                        Congrats! 🎉 You Saved ₹
                                        {(
                                          discountAmount
                                        ).toFixed(2)} 
                                      </span>
                                    </div>
                                  </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-lg font-medium">
                    <span className="text-gray-900">Total Amount</span>
                    <span className="text-gray-900">₹{total.toFixed(2)}</span>
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
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-medium text-gray-800">
                          ₹{item.price}
                        </span>
                        <span className="text-gray-500 text-xs">
                          Qty: {item.quantity}
                        </span>
                      </div>
                      {item.size && (
                        <p className="text-xs text-gray-500 mt-1">
                          Size: {item.size}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Billing Details */}
          <div className="w-full lg:w-[65%]">
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-md border border-gray-200">
              <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Billing Details
              </h2>
              
              {/* Billing Type Tabs */}
              <div className="flex border-b border-gray-200 mt-4">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 text-center font-medium text-sm ${
                    billingType === "individual"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setBillingType("individual")}
                >
                  Individual
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 text-center font-medium text-sm ${
                    billingType === "company"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setBillingType("company")}
                >
                  Company
                </button>
              </div>
            </div>

                <div className="p-4 space-y-6">
                  <div className="space-y-4">
                  {billingType === "company" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Firm Name
                      </label>
                      <input
                        type="text"
                        name="firm_name"
                        maxLength={150}
                        value={formData.firm_name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${
                          errors.firm_name
                            ? "border-red-500"
                            : "border-gray-200"
                        } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm`}
                      />
                      {errors.firm_name && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.firm_name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GSTIN
                      </label>
                      <input
                        type="text"
                        name="gstin"
                        minLength={15}
                        maxLength={15}
                        placeholder="11AAAAA1111Z1A1"
                        value={formData.gstin}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${
                          errors.gstin ? "border-red-500" : "border-gray-200"
                        } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm`}
                      />
                      {errors.gstin && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.gstin}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name*
                      </label>
                      <input
                        ref={nameInputRef}
                        type="text"
                        name="name"
                        maxLength={80}
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border ${
                          errors.name ? "border-red-500" : "border-gray-200"
                        } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mobile Number*
                        </label>
                        <input
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          onKeyDown={keyDown}
                          maxLength="10"
                          className={`w-full px-3 py-2 border ${
                            errors.mobile ? "border-red-500" : "border-gray-200"
                          } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm`}
                        />
                        {errors.mobile && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.mobile}
                          </p>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            WhatsApp Number
                          </label>
                          <div className="flex items-center gap-2 mb-1">
                            <input
                              id="sameAsMobile"
                              type="checkbox"
                              checked={sameAsMobile}
                              disabled={!/^[0-9]{10}$/.test(formData.mobile)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setSameAsMobile(checked);

                                setFormData((prev) => ({
                                  ...prev,
                                  whatsapp: checked ? prev.mobile : "",
                                }));

                                setErrors((prev) => ({
                                  ...prev,
                                  whatsapp: "",
                                }));
                              }}
                              className="accent-blue-600"
                            />
                            <label
                              htmlFor="sameAsMobile"
                              className="text-sm text-gray-700"
                            >
                              Same as mo.
                            </label>
                          </div>
                        </div>
                        <input
                          type="tel"
                          name="whatsapp"
                          value={formData.whatsapp}
                          onChange={handleInputChange}
                          onKeyDown={keyDown}
                          maxLength="10"
                          className={`w-full px-3 py-2 border ${
                            errors.whatsapp
                              ? "border-red-500"
                              : "border-gray-200"
                          } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm`}
                        />

                        {errors.whatsapp && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.whatsapp}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address*
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        maxLength={100}
                        className={`w-full px-3 py-2 border ${
                          errors.email ? "border-red-500" : "border-gray-200"
                        } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address*
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        maxLength={200}
                        className={`w-full px-3 py-2 border ${
                          errors.address ? "border-red-500" : "border-gray-200"
                        } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm`}
                      />
                      {errors.address && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Delivery Charges (₹)
                        </label>
                        <input
                          type="number"
                          name="delivery_charges"
                          value={formData.delivery_charges}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Discount Amount (₹)
                        </label>
                        <input
                          type="number"
                          name="discount_amount"
                          value={formData.discount_amount}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Instructions
                      </label>
                      <textarea
                        name="delivery_instructions"
                        value={formData.delivery_instructions}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      />
                    </div> */}

                    <div className="pt-4 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                      <button
                        type="button"
                        onClick={() => navigate("/cart")}
                        className="text-gray-600 hover:text-blue-800 text-sm font-medium flex items-center"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Cart
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading || cartItems.length === 0}
                        className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {isLoading ? "Placing Order..." : "Place Order"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
