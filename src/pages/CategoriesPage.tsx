import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '../types';
import { getCategoriesApi } from '../api/categories.api';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategoriesApi()
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Ocurrió un error al cargar las categorías.');
        setLoading(false);
      });
  }, []);

  return (
    <div style={styles.container}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>Categorías de Eventos 🏷️</h1>
        <p>Explora actividades clasificadas por tus intereses favoritos.</p>
      </header>

      {error && <div style={styles.errorBox}>⚠️ {error}</div>}

      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem' }}>⏳ Cargando categorías...</p>
      ) : categories.length === 0 ? (
        <div style={styles.emptyBox}>No hay categorías registradas en este momento.</div>
      ) : (
        <div style={styles.grid}>
          {categories.map((category) => (
            <div key={category.id} style={styles.card}>
              <h3 style={styles.title}>{category.name}</h3>
              <p style={styles.desc}>
                {category.description || 'Sin descripción disponible.'}
              </p>
              <Link to={`/categories/${category.id}`} style={styles.btn}>
                Ver Eventos Relacionados →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' },
  card: { backgroundColor: '#1a1a2e', padding: '1.5rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#fff' },
  title: { fontSize: '1.4rem', margin: 0, color: '#00d2ff' },
  desc: { color: '#a0a0a0', fontSize: '0.95rem', flex: 1 },
  btn: { alignSelf: 'flex-start', backgroundColor: '#0f3460', color: '#00d2ff', padding: '0.5rem 1rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' },
  errorBox: { backgroundColor: 'rgba(220, 53, 69, 0.2)', border: '1px solid #dc3545', color: '#ff6b6b', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem' },
  emptyBox: { textAlign: 'center', padding: '3rem', backgroundColor: '#1a1a2e', borderRadius: '8px', color: '#a0a0a0' },
};
