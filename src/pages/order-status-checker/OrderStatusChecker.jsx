import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

const OrderStatusChecker = () => {
  const [orderId, setOrderId] = useState('LOH-2025-26-1023');
  const [orderFound, setOrderFound] = useState(null);
  
  const handleTrackOrder = (e) => {
    e.preventDefault();
    // Static check for the specific order ID
    if (orderId === 'LOH-2025-26-1023') {
      setOrderFound(true);
    } else {
      setOrderFound(false);
    }
  };

  return (
    <div className="w-full py-8 min-h-screen">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => window.history.back()}
          className="text-gray-600 hover:text-blue-800 text-sm font-medium flex items-center mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600 text-sm">Enter your Order ID to check the status of your purchase</p>
        </div>

        <div className="max-w-lg mx-auto bg-white rounded-md border border-gray-200 p-6 mb-8">
          <form onSubmit={handleTrackOrder}>
            <div className="mb-6">
              <label htmlFor="order-id" className="block text-sm font-medium text-gray-700 mb-2">
                Order ID
              </label>
              <input
                type="text"
                id="order-id"
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder="e.g. LOH-2025-26-1023"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition duration-200 text-sm"
            >
              Track Order
            </button>
          </form>
        </div>

        {/* Order Found Section */}
        {orderFound === true && (
          <div className="max-w-3xl mx-auto bg-white rounded-md border border-gray-200 overflow-hidden">
            <div className="bg-green-50 p-4 border-b border-green-100">
              <h2 className="text-lg font-medium text-green-800">
                Order Found
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">Order Information</h3>
                  <div className="space-y-3 text-sm">
                    <p className="flex items-start">
                      <span className="flex-1">
                        <span className="block text-xs text-gray-500">Placed On</span>
                        <span>July 29, 2025</span>
                      </span>
                    </p>
                    <p className="flex items-start">
                      <span className="flex-1">
                        <span className="block text-xs text-gray-500">Order ID</span>
                        <span>LOH-2025-26-1023</span>
                      </span>
                    </p>
                    <p className="flex items-start">
                      <span className="flex-1">
                        <span className="block text-xs text-gray-500">Status</span>
                        <span className="inline-flex items-center">
                          Shipped
                        </span>
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">Payment & Delivery</h3>
                  <div className="space-y-3 text-sm">
                    <p className="flex items-start">
                      <span className="flex-1">
                        <span className="block text-xs text-gray-500">Total Amount</span>
                        <span>₹1,999</span>
                      </span>
                    </p>
                    <p className="flex items-start">
                      <span className="flex-1">
                        <span className="block text-xs text-gray-500">Delivery ETA</span>
                        <span>August 2, 2025</span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-base font-medium text-gray-900 mb-3">Items in Your Order</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center p-3 bg-gray-50 rounded-md">
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden mr-3">
                      <div className="w-full h-full bg-gray-200"></div>
                    </div>
                    <span>Red T-shirt × 1</span>
                  </li>
                  <li className="flex items-center p-3 bg-gray-50 rounded-md">
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden mr-3">
                      <div className="w-full h-full bg-gray-200"></div>
                    </div>
                    <span>Sneakers × 1</span>
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-base font-medium text-gray-900 mb-3">Shipping Address</h3>
                <address className="not-italic text-sm p-3 bg-gray-50 rounded-md">
                  <p>Manoj Kumar</p>
                  <p>123 MG Road, Bangalore, KA</p>
                  <p>Pincode: 560001</p>
                </address>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200 text-sm">
                  View Invoice
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200 text-sm">
                  Edit Delivery Info
                </button>
                <button className="bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition duration-200 text-sm">
                  Track Live
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order Not Found Section */}
        {orderFound === false && (
          <div className="max-w-lg mx-auto bg-white rounded-md border border-gray-200 overflow-hidden">
            <div className="bg-red-50 p-4 border-b border-red-100">
              <h2 className="text-lg font-medium text-red-800">
                Order ID not found!
              </h2>
            </div>

            <div className="p-6 text-center">
              <p className="text-gray-700 mb-6 text-sm">Please double-check and try again.</p>

              <div className="flex flex-wrap justify-center gap-3">
                <button 
                  onClick={() => {
                    setOrderFound(null);
                    setOrderId('');
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200 text-sm"
                >
                  Retry
                </button>
                <button className="bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition duration-200 text-sm">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatusChecker;