import { useState, useEffect } from 'react';

const useNotification = () => {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success', 
  });

  
  const showNotification = (message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type,
    });
  };

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000); 

      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const NotificationComponent = () => {
    if (!notification.show) return null;

    const bgColor = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500',
    }[notification.type];

    const icon = {
      success: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ),
      error: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      warning: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      info: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    }[notification.type];

    return (
      <div className="fixed top-4 right-4 z-50">
        <div
          className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in-up`}
        >
          {icon}
          <span>{notification.message}</span>
        </div>
      </div>
    );
  };

  return { showNotification, NotificationComponent };
};

export default useNotification;