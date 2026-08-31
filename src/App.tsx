import React from 'react';
import { AuthProvider } from './context/AuthProvider';
import { ToastProvider } from './context/ToastContext';
import { AppRouter } from './routes/AppRouter';
import { ErrorBoundary } from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;

