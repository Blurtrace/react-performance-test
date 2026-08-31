import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Category, Event } from '../types';
import { getCategoryByIdApi } from '../api/categories.api';
import { getEventsApi } from '../api/events.api';
import { EventCard } from '../components/EventCard';

export const CategoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    Promise.all([getCategoryByIdApi(id), getEventsApi({ categoryId: id })])
      .then(([catData, eventsData]) => {
        setCategory(catData);
        setEvents(eventsData);
        setError(null);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudo obtener la información de la categoría o sus eventos.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={styles.container}><p>⏳ Cargando categoría...</p></div>;
  if (error || !category) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <h2>⚠️ Categoría No Encontrada</h2>
          <p>{error}</p>
          <Link to="/categories" style={styles.backBtn}>← Volver a Categorías</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Link to="/categories" style={styles.backLink}>← Volver a todas las categorías</Link>
      
      <header style={styles.header}>
        <span style={styles.badge}>Categoría</span>
        <h1 style={{ fontSize: '2.2rem', margin: '0.5rem 0' }}>{category.name}</h1>
        {category.description && <p style={{ color: '#b0b0b0' }}>{category.description}</p>}
      </header>

      <section>
        <h2 style={{ marginBottom: '1.5rem', color: '#fff' }}>
          Eventos en {category.name} ({events.length})
        </h2>

        {events.length === 0 ? (
          <div style={styles.emptyBox}>
            No hay eventos registrados actualmente en esta categoría.
          </div>
        ) : (
          <div style={styles.grid}>
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' },
  backLink: { color: '#00d2ff', textDecoration: 'none', fontWeight: 'bold', marginBottom: '1rem', display: 'inline-block' },
  header: { backgroundColor: '#1a1a2e', padding: '2rem', borderRadius: '10px', color: '#fff', marginBottom: '2rem' },
  badge: { backgroundColor: '#0f3460', color: '#00d2ff', padding: '0.3rem 0.8rem', borderRadius: '15px', fontWeight: 'bold', fontSize: '0.85rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' },
  errorBox: { backgroundColor: '#1a1a2e', padding: '2rem', borderRadius: '8px', textAlign: 'center', color: '#ff6b6b' },
  backBtn: { backgroundColor: '#00d2ff', color: '#1a1a2e', padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block', marginTop: '1rem' },
  emptyBox: { textAlign: 'center', padding: '3rem', backgroundColor: '#1a1a2e', borderRadius: '8px', color: '#a0a0a0' },
};
