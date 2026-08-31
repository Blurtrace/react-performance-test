import React from 'react';
import type { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <div style={styles.container}>
      <button
        onClick={() => onSelectCategory('')}
        style={{
          ...styles.chip,
          ...(selectedCategoryId === '' ? styles.activeChip : {}),
        }}
      >
        Todas las Categorías
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          style={{
            ...styles.chip,
            ...(selectedCategoryId === category.id ? styles.activeChip : {}),
          }}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.6rem',
    margin: '1rem 0',
  },
  chip: {
    backgroundColor: '#16213e',
    color: '#a0a0a0',
    border: '1px solid #0f3460',
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
  },
  activeChip: {
    backgroundColor: '#00d2ff',
    color: '#1a1a2e',
    borderColor: '#00d2ff',
  },
};
