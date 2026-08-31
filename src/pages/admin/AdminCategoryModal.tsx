import React from 'react';
import type { Category } from '../../types';
import { styles } from './AdminCategoriesStyles';

interface FormModalProps {
  isEditing: boolean;
  name: string;
  description: string;
  formError: string | null;
  isSubmitting: boolean;
  onNameChange: (val: string) => void;
  onDescriptionChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const CategoryFormModal: React.FC<FormModalProps> = ({
  isEditing,
  name,
  description,
  formError,
  isSubmitting,
  onNameChange,
  onDescriptionChange,
  onSubmit,
  onClose,
}) => {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={{ marginTop: 0, color: '#00d2ff' }}>
          {isEditing ? 'Editar Categoria' : 'Crear Nueva Categoria'}
        </h2>

        {formError && <div style={styles.modalError}>{formError}</div>}

        <form onSubmit={onSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Ej. Conciertos"
              style={styles.input}
              disabled={isSubmitting}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Descripcion (Opcional)</label>
            <textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Ej. Presentaciones musicales y festivales en vivo"
              style={styles.textarea}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div style={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelBtn}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button type="submit" style={styles.saveBtn} disabled={isSubmitting}>
              {isSubmitting
                ? 'Guardando...'
                : isEditing
                ? 'Guardar Cambios'
                : 'Crear Categoria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface DeleteModalProps {
  category: Category;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const CategoryDeleteModal: React.FC<DeleteModalProps> = ({
  category,
  isDeleting,
  onConfirm,
  onClose,
}) => {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={{ marginTop: 0, color: '#ff4d4d' }}>Confirmar Eliminacion</h2>
        <p>
          ¿Esta seguro de que desea eliminar la categoria{' '}
          <strong>"{category.name}"</strong>? Esta accion no se puede deshacer.
        </p>
        <div style={styles.modalActions}>
          <button onClick={onClose} style={styles.cancelBtn} disabled={isDeleting}>
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
