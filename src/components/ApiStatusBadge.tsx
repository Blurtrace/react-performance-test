import React, { useState, useEffect } from 'react';
import { checkBackendHealth } from '../api/health.api';

export const ApiStatusBadge: React.FC = () => {
  const [status, setStatus] = useState<{ loading: boolean; connected: boolean; message: string }>({
    loading: true,
    connected: false,
    message: 'Verificando conexión...',
  });

  useEffect(() => {
    checkBackendHealth()
      .then((res) => {
        setStatus({ loading: false, connected: res.connected, message: res.message });
      })
      .catch(() => {
        setStatus({ loading: false, connected: false, message: 'Backend no disponible' });
      });
  }, []);

  if (status.loading) {
    return <div style={{ ...styles.badge, backgroundColor: '#f0ad4e' }}>🔄 Probando conexión a la API...</div>;
  }

  return (
    <div
      style={{
        ...styles.badge,
        backgroundColor: status.connected ? '#28a745' : '#dc3545',
      }}
    >
      {status.connected ? '✅ API Conectada' : '❌ API Desconectada'} ({status.message})
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  badge: {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    color: '#ffffff',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    marginTop: '1rem',
  },
};
