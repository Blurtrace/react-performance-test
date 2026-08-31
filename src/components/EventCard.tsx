import React from 'react';
import { Link } from 'react-router-dom';
import type { Event } from '../types';
import { formatDate, formatPrice } from '../utils/formatters';
import { useFavorites } from '../hooks/useFavorites';

interface EventCardProps {
  event: Event;
}

const DEFAULT_EVENT_IMAGE = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80';

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(event.id);

  const imageUrl = event.images && event.images.length > 0 ? event.images[0].url : DEFAULT_EVENT_IMAGE;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(event);
  };

  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img
          src={imageUrl}
          alt={event.name}
          style={styles.image}
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_EVENT_IMAGE;
          }}
        />
        {event.category && (
          <span style={styles.categoryBadge}>{event.category.name}</span>
        )}

        <button
          onClick={handleFavoriteClick}
          style={{
            ...styles.favoriteButton,
            ...(favorite ? styles.activeFavorite : {}),
          }}
          title={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {favorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div style={styles.content}>
        <h3 style={styles.title}>{event.name}</h3>

        <div style={styles.infoRow}>
          <span>📅 {formatDate(event.date)}</span>
        </div>

        <div style={styles.infoRow}>
          <span>📍 {event.location}</span>
        </div>

        <div style={styles.footer}>
          <span style={styles.price}>{formatPrice(event.price)}</span>
          <Link to={`/events/${event.id}`} style={styles.detailButton}>
            Ver Detalle
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  imageContainer: {
    position: 'relative',
    height: '180px',
    width: '100%',
    backgroundColor: '#16213e',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#00d2ff',
    color: '#1a1a2e',
    padding: '0.3rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'rgba(26, 26, 46, 0.75)',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '1.1rem',
    backdropFilter: 'blur(4px)',
    transition: 'transform 0.2s ease, background-color 0.2s ease',
  },
  activeFavorite: {
    backgroundColor: 'rgba(233, 69, 96, 0.9)',
  },
  content: {
    padding: '1.2rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: '0.6rem',
  },
  title: {
    fontSize: '1.2rem',
    color: '#ffffff',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  infoRow: {
    fontSize: '0.9rem',
    color: '#a0a0a0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: '0.8rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  price: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#00e676',
  },
  detailButton: {
    backgroundColor: '#0f3460',
    color: '#00d2ff',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
};

