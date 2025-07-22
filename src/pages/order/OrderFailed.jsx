import { XCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderFailed = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const errorMessage = state?.error || "Something went wrong with your order.";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <XCircle className="mx-auto h-16 w-16 text-red-600" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Order Failed
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {errorMessage}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Your cart has been preserved so you can try again.
          </p>
        </div>

        <div className="mt-16 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">What you can do next</h2>
          </div>

          <div className="px-6 py-5 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Retry Order</h3>
              <p className="mt-2 text-sm text-gray-500">
                Try placing your order again with the same items.
              </p>
              <button
                onClick={() => navigate('/checkout')}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Checkout
              </button>
            </div>

          

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600 mb-4">
                <svg
                  className="h-6 w-6"
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
              </div>
              <h3 className="text-lg font-medium text-gray-900">Contact Support</h3>
              <p className="mt-2 text-sm text-gray-500">
                Get help from our customer service team.
              </p>
              <a
                href="tel:18001234567"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Call Support
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Cart
          </button>
        </div>

        <div className="mt-16 bg-red-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-12 w-12 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800">Troubleshooting Tips</h3>
              <ul className="mt-2 text-sm text-red-700 list-disc pl-5 space-y-1">
                <li>Check your internet connection</li>
                <li>Verify your payment details</li>
                <li>Ensure your cart total is correct</li>
                <li>Try again in a few minutes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFailed;