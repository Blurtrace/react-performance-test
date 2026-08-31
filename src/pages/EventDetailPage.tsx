import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Event } from '../types';
import { getEventByIdApi } from '../api/events.api';
import { formatDate, formatPrice } from '../utils/formatters';
import { useFavorites } from '../hooks/useFavorites';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [activeImg, setActiveImg] = useState<string>(DEFAULT_IMAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (!id) return;
    getEventByIdApi(id)
      .then((data) => {
        setEvent(data);
        if (data.images && data.images.length > 0) setActiveImg(data.images[0].url);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudo encontrar la información del evento.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={styles.container}><p>⏳ Cargando evento...</p></div>;
  if (error || !event) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <h2>⚠️ Evento No Encontrado</h2>
          <p>{error}</p>
          <Link to="/events" style={styles.backBtn}>← Volver a Eventos</Link>
        </div>
      </div>
    );
  }

  const favorite = isFavorite(event.id);

  return (
    <div style={styles.container}>
      <Link to="/events" style={styles.backLink}>← Volver a eventos</Link>
      <div style={styles.grid}>
        <div>
          <div style={styles.imgBox}>
            <img src={activeImg} alt={event.name} style={styles.img} onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }} />
          </div>
          {event.images && event.images.length > 1 && (
            <div style={styles.thumbs}>
              {event.images.map((img) => (
                <img key={img.id} src={img.url} alt={event.name} onClick={() => setActiveImg(img.url)} style={styles.thumb} onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }} />
              ))}
            </div>
          )}
        </div>
        <div style={{ color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {event.category ? (
              <Link to={`/categories/${event.categoryId}`} style={styles.badge}>🏷️ {event.category.name}</Link>
            ) : <div />}
            <button
              onClick={() => toggleFavorite(event)}
              style={{
                ...styles.favBtn,
                ...(favorite ? styles.activeFavBtn : {}),
              }}
            >
              {favorite ? '❤️ En Favoritos' : '🤍 Agregar a Favoritos'}
            </button>
          </div>

          <h1 style={{ fontSize: '2rem', margin: '0.8rem 0' }}>{event.name}</h1>
          <p style={{ fontSize: '1.2rem', color: '#00e676', fontWeight: 'bold' }}>{formatPrice(event.price)}</p>
          <div style={styles.info}>
            <p>📅 <strong>Fecha:</strong> {formatDate(event.date)}</p>
            <p>📍 <strong>Lugar:</strong> {event.location}</p>
            {event.capacity !== undefined && <p>👥 <strong>Aforo:</strong> {event.capacity} personas</p>}
          </div>
          {event.description && (
            <div>
              <h3>Descripción</h3>
              <p style={{ color: '#b0b0b0', lineHeight: 1.5 }}>{event.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' },
  backLink: { color: '#00d2ff', textDecoration: 'none', fontWeight: 'bold', marginBottom: '1rem', display: 'inline-block' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' },
  imgBox: { width: '100%', height: '300px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#16213e' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  thumbs: { display: 'flex', gap: '0.5rem', marginTop: '0.5rem' },
  thumb: { width: '60px', height: '60px', borderRadius: '4px', objectFit: 'cover', cursor: 'pointer' },
  badge: { backgroundColor: '#0f3460', color: '#00d2ff', padding: '0.3rem 0.8rem', borderRadius: '15px', textDecoration: 'none', fontWeight: 'bold' },
  favBtn: { backgroundColor: '#16213e', color: '#fff', border: '1px solid #00d2ff', padding: '0.4rem 0.8rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' },
  activeFavBtn: { backgroundColor: '#e94560', borderColor: '#e94560' },
  info: { backgroundColor: '#1a1a2e', padding: '1rem', borderRadius: '8px', margin: '1rem 0' },
  errorBox: { backgroundColor: '#1a1a2e', padding: '2rem', borderRadius: '8px', textAlign: 'center', color: '#ff6b6b' },
  backBtn: { backgroundColor: '#00d2ff', color: '#1a1a2e', padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block', marginTop: '1rem' },
};

