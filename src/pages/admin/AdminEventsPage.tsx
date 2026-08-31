import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Event, Category } from '../../types';
import {
  getEventsApi,
  createEventApi,
  updateEventApi,
  deleteEventApi,
} from '../../api/events.api';
import type { CreateEventPayload } from '../../api/events.api';
import { getCategoriesApi } from '../../api/categories.api';
import { formatDate, formatPrice } from '../../utils/formatters';
import { styles } from './AdminEventsStyles';
import { EventFormModal, EventDeleteModal } from './AdminEventModal';

export const AdminEventsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    () => searchParams.get('categoryId') || '',
  );

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(
    () => searchParams.get('create') === 'true',
  );
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [defaultCategoryId, setDefaultCategoryId] = useState<string | undefined>(
    () => searchParams.get('categoryId') || undefined,
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEventsApi({
        search: searchTerm.trim() || undefined,
        categoryId: selectedCategoryId || undefined,
      });
      setEvents(data);
    } catch {
      setError('Error al cargar la lista de eventos.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategoryId]);

  useEffect(() => {
    let ignore = false;
    getCategoriesApi()
      .then((data) => {
        if (!ignore) setCategories(data);
      })
      .catch(() => {
        // Non-blocking
      });
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    let ignore = false;
    getEventsApi({
      search: searchTerm.trim() || undefined,
      categoryId: selectedCategoryId || undefined,
    })
      .then((data) => {
        if (!ignore) {
          setEvents(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setError('Error al cargar la lista de eventos.');
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [searchTerm, selectedCategoryId]);

  // Clean URL query parameters after opening the create modal.
  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleOpenCreateModal = (catId?: string) => {
    setEditingEvent(null);
    setDefaultCategoryId(catId || selectedCategoryId || undefined);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event: Event) => {
    setEditingEvent(event);
    setDefaultCategoryId(event.categoryId);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setDefaultCategoryId(undefined);
    setFormError(null);
  };

  const handleSubmitForm = async (payload: CreateEventPayload) => {
    setFormError(null);
    setIsSubmitting(true);
    try {
      if (editingEvent) {
        await updateEventApi(editingEvent.id, payload);
      } else {
        await createEventApi(payload);
      }
      handleCloseModal();
      await fetchEvents();
    } catch (err: unknown) {
      let msg = 'Ocurrio un error al guardar el evento.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string | string[] } } };
        const serverMsg = axiosError.response?.data?.message;
        if (serverMsg) {
          msg = Array.isArray(serverMsg) ? serverMsg.join(', ') : serverMsg;
        }
      }
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEvent) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteEventApi(deletingEvent.id);
      setDeletingEvent(null);
      await fetchEvents();
    } catch (err: unknown) {
      let msg = 'Ocurrio un error al eliminar el evento.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string | string[] } } };
        const serverMsg = axiosError.response?.data?.message;
        if (serverMsg) {
          msg = Array.isArray(serverMsg) ? serverMsg.join(', ') : serverMsg;
        }
      }
      setError(msg);
      setDeletingEvent(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Gestion de Eventos</h1>
          <p style={styles.subtitle}>Panel de administracion para la creacion y edicion de eventos</p>
        </div>
        <button onClick={() => handleOpenCreateModal()} style={styles.createButton}>
          + Nuevo Evento
        </button>
      </header>

      {error && (
        <div style={styles.errorBox}>
          <span>{error}</span>
          <button onClick={() => setError(null)} style={styles.dismissBtn}>
            Cerrar
          </button>
        </div>
      )}

      <div style={styles.filterSection}>
        <input
          type="text"
          placeholder="Buscar evento por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          style={styles.selectFilter}
        >
          <option value="">Todas las categorias</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: '#a0a0a0' }}>
          Cargando eventos...
        </p>
      ) : events.length === 0 ? (
        <div style={styles.emptyCard}>
          <p>No se encontraron eventos.</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Categoria</th>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Ubicacion</th>
                <th style={styles.th}>Precio</th>
                <th style={styles.th}>Capacidad</th>
                <th style={styles.thRight}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt) => (
                <tr key={evt.id} style={styles.tr}>
                  <td style={styles.tdName}>{evt.name}</td>
                  <td style={styles.tdCategory}>
                    {evt.category?.name || categories.find((c) => c.id === evt.categoryId)?.name || 'Sin categoria'}
                  </td>
                  <td style={styles.tdDate}>{formatDate(evt.date)}</td>
                  <td style={styles.tdLocation}>{evt.location}</td>
                  <td style={styles.tdPrice}>
                    {evt.price === 0 ? 'Gratis' : formatPrice(evt.price)}
                  </td>
                  <td style={styles.tdCapacity}>{evt.capacity}</td>
                  <td style={styles.tdRight}>
                    <button onClick={() => handleOpenEditModal(evt)} style={styles.editBtn}>
                      Editar
                    </button>
                    <button onClick={() => setDeletingEvent(evt)} style={styles.deleteBtn}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <EventFormModal
          categories={categories}
          initialData={editingEvent}
          defaultCategoryId={defaultCategoryId}
          isEditing={Boolean(editingEvent)}
          isSubmitting={isSubmitting}
          formError={formError}
          onSubmit={handleSubmitForm}
          onClose={handleCloseModal}
        />
      )}

      {deletingEvent && (
        <EventDeleteModal
          event={deletingEvent}
          isDeleting={isDeleting}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingEvent(null)}
        />
      )}
    </div>
  );
};

