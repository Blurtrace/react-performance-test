import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Event, Category } from '../types';
import { getEventsApi } from '../api/events.api';
import { getCategoriesApi } from '../api/categories.api';
import { EventCard } from '../components/EventCard';
import { ApiStatusBadge } from '../components/ApiStatusBadge';

export const HomePage: React.FC = () => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getEventsApi(), getCategoriesApi()])
      .then(([eventsData, catData]) => {
        setFeaturedEvents(eventsData.slice(0, 6));
        setCategories(catData);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.hero}>
        <h1 style={styles.title}>Bienvenido a PlanCity 🌆</h1>
        <p style={styles.subtitle}>
          Tu plataforma ideal para descubrir los mejores eventos y actividades de la ciudad.
        </p>
        <div style={styles.heroActions}>
          <Link to="/events" style={styles.primaryBtn}>
            🎭 Explorar Eventos
          </Link>
          <Link to="/categories" style={styles.secondaryBtn}>
            🏷️ Ver Categorías
          </Link>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <ApiStatusBadge />
        </div>
      </header>

      {categories.length > 0 && (
        <section style={styles.section}>
          <h2>Categorías Destacadas</h2>
          <div style={styles.categoryContainer}>
            {categories.map((cat) => (
              <Link key={cat.id} to={`/categories/${cat.id}`} style={styles.categoryChip}>
                🏷️ {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2>Eventos Destacados</h2>
          <Link to="/events" style={styles.viewAllLink}>
            Ver todos ({featuredEvents.length}) →
          </Link>
        </div>

        {isLoading ? (
          <p style={{ color: '#a0a0a0', textAlign: 'center', padding: '2rem' }}>
            ⏳ Cargando eventos...
          </p>
        ) : featuredEvents.length === 0 ? (
          <div style={styles.emptyCard}>
            <p>No hay eventos disponibles por el momento.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  hero: {
    textAlign: 'center',
    padding: '3rem 1.5rem',
    backgroundColor: '#0f3460',
    borderRadius: '12px',
    color: '#ffffff',
    marginBottom: '2.5rem',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#e0e0e0',
    marginBottom: '1.5rem',
  },
  heroActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    backgroundColor: '#00d2ff',
    color: '#1a1a2e',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    border: '2px solid #00d2ff',
    color: '#00d2ff',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  section: {
    marginBottom: '2.5rem',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.2rem',
  },
  viewAllLink: {
    color: '#00d2ff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  categoryContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.8rem',
    marginTop: '1rem',
  },
  categoryChip: {
    backgroundColor: '#1a1a2e',
    color: '#00d2ff',
    padding: '0.5rem 1.2rem',
    borderRadius: '20px',
    textDecoration: 'none',
    fontWeight: 'bold',
    border: '1px solid #0f3460',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  emptyCard: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: '#1a1a2e',
    borderRadius: '8px',
    color: '#a0a0a0',
  },
};

