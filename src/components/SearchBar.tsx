import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClear: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange, onClear }) => {
  return (
    <div style={styles.container}>
      <span style={styles.icon}>🔍</span>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Buscar eventos por nombre o descripción..."
        style={styles.input}
      />
      {searchTerm && (
        <button onClick={onClear} style={styles.clearButton} title="Limpiar búsqueda">
          ✖
        </button>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    border: '1px solid #333',
    flex: 1,
    minWidth: '260px',
  },
  icon: {
    marginRight: '0.6rem',
    fontSize: '1rem',
  },
  input: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
    width: '100%',
  },
  clearButton: {
    background: 'none',
    border: 'none',
    color: '#a0a0a0',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '0 0.4rem',
  },
};
