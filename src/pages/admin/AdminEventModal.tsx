import React from 'react';
import type { Category, Event } from '../../types';
import type { CreateEventPayload } from '../../api/events.api';
import { EventForm } from '../../components/EventForm';
import { styles } from './AdminEventsStyles';

interface EventFormModalProps {
  categories: Category[];
  initialData?: Event | null;
  defaultCategoryId?: string;
  isEditing?: boolean;
  isSubmitting?: boolean;
  formError?: string | null;
  onSubmit: (payload: CreateEventPayload) => void;
  onClose: () => void;
}

export const EventFormModal: React.FC<EventFormModalProps> = ({
  categories,
  initialData,
  defaultCategoryId,
  isEditing = false,
  isSubmitting = false,
  formError,
  onSubmit,
  onClose,
}) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modalCard}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            {isEditing ? 'Editar Evento' : 'Crear Nuevo Evento'}
          </h2>
          <button onClick={onClose} style={styles.closeBtn}>
            &times;
          </button>
        </div>

        <EventForm
          categories={categories}
          initialData={initialData}
          defaultCategoryId={defaultCategoryId}
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          formError={formError}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

interface EventDeleteModalProps {
  event: Event;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const EventDeleteModal: React.FC<EventDeleteModalProps> = ({
  event,
  isDeleting,
  onConfirm,
  onClose,
}) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.deleteCard}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#ff6b6b' }}>
          Eliminar Evento
        </h3>
        <p style={{ color: '#e0e0e0', marginBottom: '1.5rem' }}>
          ¿Esta seguro de que desea eliminar el evento{' '}
          <strong style={{ color: '#ffffff' }}>"{event.name}"</strong>? Esta accion
          no se puede deshacer.
        </p>

        <div style={styles.deleteActions}>
          <button
            onClick={onClose}
            style={styles.cancelBtn}
            disabled={isDeleting}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={styles.confirmDeleteBtn}
            disabled={isDeleting}
          >
            {isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};
