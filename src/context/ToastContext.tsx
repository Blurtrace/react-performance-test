import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'error' | 'success';

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Simple event emitter to show toast from outside React components
const listeners: ((message: string, type: ToastType) => void)[] = [];
export const triggerToast = (message: string, type: ToastType) => {
  listeners.forEach((listener) => listener(message, type));
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  React.useEffect(() => {
    listeners.push(showToast);
    return () => {
      const index = listeners.indexOf(showToast);
      if (index > -1) listeners.splice(index, 1);
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px 20px',
          backgroundColor: toast.type === 'error' ? '#f44336' : '#4caf50',
          color: 'white',
          borderRadius: '4px',
          zIndex: 1000
        }}>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
