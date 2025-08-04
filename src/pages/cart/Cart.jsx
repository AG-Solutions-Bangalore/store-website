import React from 'react';
import { Trash2, Plus, Minus, ChevronLeft } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateCartItems } from '../../redux/slices/CartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  const updateQuantity = (id, change) => {
    const updatedItems = cartItems.map(item => 
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    );
    dispatch(updateCartItems(updatedItems));
  };

  const removeItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const subTotalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const subtotalMrp = cartItems.reduce((sum, item) => sum + (item.mrp * item.quantity), 0);
  const deliveryCharges = 0.00;
  const discount =subtotalMrp - subTotalPrice
  const total = (subtotalMrp + deliveryCharges) - discount ;

  const discountPercentage =((discount / subtotalMrp) * 100).toFixed(2)
 

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/checkout');
  };

  return (
    <div className="w-full py-8 min-h-screen ">
   
      

      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items Section */}
          <div className={`w-full  ${cartItems.length === 0 ? "lg:w-[100%]" : "lg:w-[65%]"}`}>
            <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Your Cart ({cartItems.length})
                </h2>
              </div>

              {cartItems.length === 0 ? (
                <div className="p-8 text-center ">
                  <svg className="w-16 h-16 mx-auto  text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-600 mt-4">Your cart is empty</h3>
                  <Link 
                    to="/" 
                    className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-4 py-2 rounded-md transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                        <tr className="text-sm text-gray-600">
                          <th className="py-3 px-4 text-left font-medium">Product</th>
                          {/* <th className="py-3 px-4 text-center font-medium">Mrp</th> */}
                          <th className="py-3 px-4 text-center font-medium">Price</th>
                          <th className="py-3 px-4 text-center font-medium">Quantity</th>
                          <th className="py-3 px-4 text-center font-medium">Total</th>
                          {/* <th className="py-3 px-4 text-center font-medium">Total MRp</th> */}
                          <th className="py-3 px-4 text-right font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {cartItems.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden border border-gray-200">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                                  {item.size && <p className="text-xs text-gray-500 mt-1">Size: {item.size}</p>}
                                </div>
                              </div>
                            </td>
                            {/* <td className="py-4 px-4 text-center font-normal">
                              ₹{item.mrp}
                            </td> */}
                            {/* <td className="py-4 px-4 text-center text-blue-700 font-medium">
                              ₹{item.price}
                            </td> */}
                   <td className="py-4 px-4 text-center align-middle">
  <div className="flex items-center justify-center gap-2">
  <span className="text-blue-700 font-semibold text-base">₹{item.price}</span>
    <span className="text-gray-600 text-xs line-through">₹{item.mrp}</span>
  
  </div>
</td>



                            <td className="py-4 px-4">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-blue-700 transition-colors cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center font-medium text-gray-800">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-blue-700 transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center font-medium text-blue-700">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </td>
                            {/* <td className="py-4 px-4 text-center font-medium text-blue-700">
                              ₹{(item.mrp * item.quantity).toFixed(2)}
                            </td> */}
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden border border-gray-200">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                              {item.size && <p className="text-xs text-gray-500 mt-1">Size: {item.size}</p>}
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="bg-gray-50 p-2 rounded-md">
  <p className="text-xs text-gray-500">Price</p>
  <div className="flex items-center gap-2 mt-1">
  <span className="text-blue-700 text-sm font-semibold">₹{item.price}</span>
    <span className="text-gray-400 text-xs line-through">₹{item.mrp}</span>
   
  </div>
</div>

                          <div className="bg-gray-50 p-2 rounded-md">
                            <p className="text-xs text-gray-500">Qty</p>
                            <div className="flex items-center justify-center gap-1 mt-1">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-blue-700 transition-colors cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-medium text-gray-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-blue-700 transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        
                          <div className="bg-gray-50 p-2 rounded-md">
                            
                            <p className="text-xs text-gray-500">Total</p>
                            <p className="text-sm font-medium text-blue-700">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Order Summary Section */}
          {cartItems.length > 0 && (
            <div className="w-full lg:w-[35%]">
              <div className="bg-white rounded-md border border-gray-200 shadow-sm sticky top-6 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Order Summary
                  </h2>
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
                     - ₹{discount.toFixed(2)}
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
                                          discount
                                        ).toFixed(2)} 
                                      </span>
                                    </div>
                                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center text-lg font-medium">
                      <span className="text-gray-900">Total Amount</span>
                      <span className="text-green-600">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="pt-4 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                    <Link 
                      to="/" 
                      className="text-gray-600 hover:text-blue-800 text-sm font-medium flex items-center bg-gray-50 px-4 py-2 rounded-md transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Continue Shopping
                    </Link>
                    <button 
                      onClick={handleCheckout}
                      className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors shadow-sm flex-1 sm:flex-none text-center"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;