import React, { useState } from 'react';
import type { Category, Event } from '../types';
import type { CreateEventPayload } from '../api/events.api';

interface EventFormProps {
  categories: Category[];
  initialData?: Event | null;
  defaultCategoryId?: string;
  isEditing?: boolean;
  isSubmitting?: boolean;
  formError?: string | null;
  onSubmit: (payload: CreateEventPayload) => void;
  onCancel: () => void;
}

const formatDateForInput = (isoString?: string): string => {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const EventForm: React.FC<EventFormProps> = (props) => {
  const {
    categories, initialData, defaultCategoryId,
    isEditing = false, isSubmitting = false, formError,
    onSubmit, onCancel,
  } = props;

  const [name, setName] = useState(() => initialData?.name || '');
  const [categoryId, setCategoryId] = useState(
    () => initialData?.categoryId || defaultCategoryId || '',
  );
  const [description, setDescription] = useState(() => initialData?.description || '');
  const [date, setDate] = useState(() => formatDateForInput(initialData?.date));
  const [location, setLocation] = useState(() => initialData?.location || '');
  const [price, setPrice] = useState<number | ''>(() => (initialData ? initialData.price ?? 0 : ''));
  const [capacity, setCapacity] = useState<number | ''>(() => (initialData ? initialData.capacity ?? 1 : ''));
  const [imagesText, setImagesText] = useState(() =>
    initialData?.images?.map((img) => img.url).join('\n') || '',
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (!name.trim() || name.trim().length < 2) {
      setValidationError('El nombre debe tener al menos 2 caracteres.');
      return;
    }
    if (!categoryId) {
      setValidationError('Debes seleccionar una categoria.');
      return;
    }
    if (!date) {
      setValidationError('La fecha y hora son obligatorias.');
      return;
    }
    if (!location.trim() || location.trim().length < 2) {
      setValidationError('La ubicacion debe tener al menos 2 caracteres.');
      return;
    }
    if (price === '' || Number(price) < 0) {
      setValidationError('El precio debe ser mayor o igual a 0.');
      return;
    }
    if (capacity === '' || Number(capacity) <= 0 || !Number.isInteger(Number(capacity))) {
      setValidationError('La capacidad debe ser un entero positivo.');
      return;
    }
    const imgs = imagesText.split('\n').map((u) => u.trim()).filter((u) => u.length > 0);
    const payload: CreateEventPayload = {
      name: name.trim(),
      categoryId,
      description: description.trim() || undefined,
      date: new Date(date).toISOString(),
      location: location.trim(),
      price: Number(price),
      capacity: Number(capacity),
      images: imgs.length > 0 ? imgs : undefined,
    };
    onSubmit(payload);
  };

  const activeError = validationError || formError;

  return (
    <form onSubmit={handleSubmit} style={formStyles.form}>
      {activeError && <div style={formStyles.errorBox}>{activeError}</div>}

      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>
          Nombre del evento <span style={formStyles.required}>*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Concierto Sinfonico"
          style={formStyles.input}
          required
        />
      </div>

      <div style={formStyles.row}>
        <div style={{ ...formStyles.formGroup, flex: 1 }}>
          <label style={formStyles.label}>
            Categoria <span style={formStyles.required}>*</span>
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            style={formStyles.select}
            required
          >
            <option value="">-- Selecciona una categoria --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div style={{ ...formStyles.formGroup, flex: 1 }}>
          <label style={formStyles.label}>
            Fecha y Hora <span style={formStyles.required}>*</span>
          </label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={formStyles.input}
            required
          />
        </div>
      </div>

      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>
          Ubicacion <span style={formStyles.required}>*</span>
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ej. Teatro Colon"
          style={formStyles.input}
          required
        />
      </div>

      <div style={formStyles.row}>
        <div style={{ ...formStyles.formGroup, flex: 1 }}>
          <label style={formStyles.label}>
            Precio (COP) <span style={formStyles.required}>*</span>
          </label>
          <input
            type="number"
            min="0"
            step="100"
            value={price}
            onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="0 para gratuito"
            style={formStyles.input}
            required
          />
        </div>
        <div style={{ ...formStyles.formGroup, flex: 1 }}>
          <label style={formStyles.label}>
            Capacidad total <span style={formStyles.required}>*</span>
          </label>
          <input
            type="number"
            min="1"
            step="1"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="Ej. 150"
            style={formStyles.input}
            required
          />
        </div>
      </div>

      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>Descripcion</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalles sobre el evento..."
          style={formStyles.textarea}
          rows={3}
        />
      </div>

      <div style={formStyles.formGroup}>
        <label style={formStyles.label}>URLs de Imagenes (una por linea)</label>
        <textarea
          value={imagesText}
          onChange={(e) => setImagesText(e.target.value)}
          placeholder="https://example.com/imagen.jpg"
          style={formStyles.textarea}
          rows={2}
        />
      </div>

      <div style={formStyles.actions}>
        <button type="button" onClick={onCancel} style={formStyles.cancelBtn} disabled={isSubmitting}>
          Cancelar
        </button>
        <button type="submit" style={formStyles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Evento'}
        </button>
      </div>
    </form>
  );
};

const formStyles: Record<string, React.CSSProperties> = {
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  row: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  label: { fontSize: '0.9rem', color: '#e0e0e0', fontWeight: 500 },
  required: { color: '#ff6b6b' },
  input: { backgroundColor: '#0f3460', border: '1px solid #1f4068', color: '#fff', padding: '0.65rem 0.9rem', borderRadius: '6px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', width: '100%' },
  select: { backgroundColor: '#0f3460', border: '1px solid #1f4068', color: '#fff', padding: '0.65rem 0.9rem', borderRadius: '6px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', width: '100%' },
  textarea: { backgroundColor: '#0f3460', border: '1px solid #1f4068', color: '#fff', padding: '0.65rem 0.9rem', borderRadius: '6px', fontSize: '0.95rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', width: '100%' },
  errorBox: { backgroundColor: 'rgba(220, 53, 69, 0.2)', border: '1px solid #dc3545', color: '#ff6b6b', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.5rem' },
  cancelBtn: { backgroundColor: 'transparent', border: '1px solid #a0a0a0', color: '#a0a0a0', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  submitBtn: { backgroundColor: '#00d2ff', border: 'none', color: '#1a1a2e', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
};

