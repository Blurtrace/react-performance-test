/**
 * Formatea una fecha ISO en un texto legible en español.
 * Ejemplo: "Viernes, 15 de octubre de 2026, 19:00"
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'Fecha no disponible';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

/**
 * Formatea un precio numérico a moneda local ($ USD / COP / etc.).
 * Muestra "Gratis" si el precio es 0.
 */
export const formatPrice = (price: number): string => {
  if (price === undefined || price === null) return '$0.00';
  if (price === 0) return 'Gratis';
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};
