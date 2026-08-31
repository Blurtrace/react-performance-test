import React, { useState, useEffect } from 'react';
import type { Event, Category } from '../types';
import { getEventsApi } from '../api/events.api';
import { getCategoriesApi } from '../api/categories.api';
import { EventCard } from '../components/EventCard';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cargar la lista de categorías para el filtro
    getCategoriesApi()
      .then(setCategories)
      .catch(() => {
        // Error no bloqueante para categorías
      });
  }, []);

  useEffect(() => {
    getEventsApi({
      search: searchTerm.trim() || undefined,
      categoryId: selectedCategoryId || undefined,
    })
      .then((data) => {
        setEvents(data);
        setError(null);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Ocurrió un error al cargar la lista de eventos. Por favor intenta de nuevo.');
        setIsLoading(false);
      });
  }, [searchTerm, selectedCategoryId]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Explorar Eventos 🎭</h1>
        <p>Descubre conciertos, obras, talleres y las mejores actividades en tu ciudad.</p>
      </header>

      <div style={styles.filterSection}>
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
        />
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
      </div>

      {error && (
        <div style={styles.errorBox}>
          ⚠️ {error}
        </div>
      )}

      {isLoading ? (
        <div style={styles.loadingContainer}>
          <p>⏳ Cargando eventos disponibles...</p>
        </div>
      ) : events.length === 0 ? (
        <div style={styles.emptyContainer}>
          <h3>No se encontraron eventos</h3>
          <p>Intenta cambiar los términos de búsqueda o seleccionar otra categoría.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {events.map((event) => (
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
  header: {
    marginBottom: '2rem',
  },
  filterSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#a0a0a0',
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: '#1a1a2e',
    borderRadius: '8px',
    color: '#a0a0a0',
  },
  errorBox: {
    backgroundColor: 'rgba(220, 53, 69, 0.2)',
    border: '1px solid #dc3545',
    color: '#ff6b6b',
    padding: '1rem',
    borderRadius: '6px',
    marginBottom: '1.5rem',
  },
};

