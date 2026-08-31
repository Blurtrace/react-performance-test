import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { EventCard } from '../components/EventCard';

export const FavoritesPage: React.FC = () => {
  const { favorites, isLoading } = useFavorites();

  return (
    <div style={styles.container}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>Mis Favoritos ❤️</h1>
        <p>Tus actividades y eventos guardados en PlanCity.</p>
      </header>

      {isLoading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: '#a0a0a0' }}>
          ⏳ Cargando tus eventos favoritos...
        </p>
      ) : favorites.length === 0 ? (
        <div style={styles.emptyCard}>
          <h3>Aún no tienes eventos guardados</h3>
          <p style={{ margin: '1rem 0', color: '#a0a0a0' }}>
            Explora el catálogo de eventos y presiona el icono de corazón ❤️ para agregarlos a tus favoritos.
          </p>
          <Link to="/events" style={styles.exploreBtn}>
            🎭 Explorar Eventos
          </Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {favorites.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  emptyCard: {
    textAlign: 'center',
    padding: '3rem 1.5rem',
    backgroundColor: '#1a1a2e',
    borderRadius: '10px',
    color: '#ffffff',
  },
  exploreBtn: {
    display: 'inline-block',
    backgroundColor: '#00d2ff',
    color: '#1a1a2e',
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};
