'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Stabilize removeToast with useCallback
  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Stabilize addToast with useCallback and include removeToast in dependencies
  const addToast = useCallback(
    (toast) => {
      const id = Date.now();
      setToasts((prevToasts) => [...prevToasts, { ...toast, id }]);
      // Automatically remove the toast after 3 seconds
      setTimeout(() => removeToast(id), 3000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded shadow-lg ${
              toast.variant === 'destructive'
                ? 'bg-red-500 text-white'
                : 'bg-green-500 text-white'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <strong>{toast.title}</strong>
                <p>{toast.description}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 text-lg font-bold"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};
