import React from 'react';
import { ChevronDown, Trash2, Plus, Minus, ChevronLeft } from 'lucide-react';
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

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCharges = 0.00;
  const total = subtotal + deliveryCharges;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/checkout');
  };

  return (
    <div className="w-full py-8 min-h-screen">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-[100%] space-y-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b-2 border-gray-200">
                <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-1 text-center">Total</div>
                  <div className="col-span-1"></div>
                </div>
              </div>

              {cartItems.length === 0 ? (
                <div className="p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-600">Your cart is empty</h3>
                  <Link to="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-4">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-12 md:col-span-6 flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-gray-600">{item.name}</h3>
                            {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                            <div className="md:hidden mt-2">
                              <span className="text-gray-800 font-medium">₹{item.price}</span>
                            </div>
                          </div>
                        </div>

                        <div className="hidden md:block col-span-2 text-center text-gray-800 font-medium">
                          ₹{item.price}
                        </div>

                        <div className="col-span-8 md:col-span-2">
                          <div className="flex items-center md:justify-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="w-6 text-center font-medium text-gray-800">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </div>

                        <div className="col-span-2 md:col-span-1 text-right md:text-center font-medium text-gray-800">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>

                        <div className="col-span-2 md:col-span-1 text-right md:text-center">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cartItems.length > 0 && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                    <div className="w-full md:w-auto">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Delivery:</span>
                        <span className="font-medium">₹{deliveryCharges.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                      <Link to="/" className="text-gray-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Continue Shopping
                      </Link>
                      <button 
                        onClick={handleCheckout}
                        className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800 font-medium"
                      >
                        Check Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;