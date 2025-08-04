import { CheckCircle2 } from 'lucide-react';
import moment from 'moment/moment';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const orderData = state?.orderData;

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString('default', { month: 'short' }); // 'Jan', 'Feb', etc.
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Order Placed Successfully!
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>
        </div>

        <div className="mt-16 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
            <div className="mt-3 sm:mt-0">
              <p className="text-sm text-gray-500">
                Order : <span className="font-medium text-gray-900">{orderData?.order_id}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Date: <span className="font-medium text-gray-900">
  {moment().format('DD-MMM-YYYY')}
</span>
              </p>
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-16 w-16 text-blue-100"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
                <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                    <dd className="mt-1 text-sm text-gray-900">₹{orderData?.total_amount}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                    <dd className="mt-1 text-sm text-gray-900">Cash on Delivery</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Delivery Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {orderData?.address}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Contact</dt>
                    <dd className="mt-1 text-sm text-gray-900">{orderData?.mobile}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Items Ordered</h3>
            <ul className="divide-y divide-gray-200">
              {orderData?.subs?.map((item) => (
                <li key={item.product_id} className="py-4 flex">
                  <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                    <img
                      src={item.product_image || "https://via.placeholder.com/150"}
                      alt={item.product_name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {item.product_name}
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        Size: {item.size || 'Standard'}
                      </p>
                    </div>
                    <div className="flex-1 flex items-end justify-between text-sm">
                      <p className="text-gray-500">Qty {item.product_qnty}</p>
                      <p className="font-medium text-gray-900">₹{item.product_qnty * item.product_price}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Continue Shopping
          </button>
      
        </div>

        <div className="mt-16">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-12 w-12 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-blue-800">Need help with your order?</h3>
                <p className="mt-1 text-sm text-blue-700">
                  Our customer service team is available to help with any questions about your order.
                </p>
                <div className="mt-2">
                  <a
                    href={`tel:${orderData?.support_phone || '1800-123-4567'}`}
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    <svg
                      className="mr-1.5 h-5 w-5 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {orderData?.support_phone || '1800-123-4567'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;