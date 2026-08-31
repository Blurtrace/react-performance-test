import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1>404 - Página no encontrada</h1>
      <p>La página que estás buscando no existe.</p>
      <Link to="/" style={{ color: '#00d2ff', marginTop: '1rem', display: 'inline-block' }}>
        Volver al inicio
      </Link>
    </div>
  );
};
