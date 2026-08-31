import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={styles.footer}>
      <p>&copy; {new Date().getFullYear()} PlanCity - Descubrimiento de Eventos y Actividades Locales.</p>
    </footer>
  );
};

const styles: Record<string, React.CSSProperties> = {
  footer: {
    backgroundColor: '#16213e',
    color: '#8a8d9b',
    textAlign: 'center',
    padding: '1.5rem',
    marginTop: 'auto',
  },
};
