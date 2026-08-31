import React, { useState, useEffect, useCallback } from 'react';
import type { Category } from '../../types';
import {
  getCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from '../../api/categories.api';
import { styles } from './AdminCategoriesStyles';
import { CategoryFormModal, CategoryDeleteModal } from './AdminCategoryModal';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation modal states
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategoriesApi();
      setCategories(data);
    } catch {
      setError('Error al cargar la lista de categorias.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    getCategoriesApi()
      .then((data) => {
        if (!ignore) {
          setCategories(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setError('Error al cargar la lista de categorias.');
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setName('');
    setDescription('');
    setFormError(null);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('El nombre de la categoria es obligatorio.');
      return;
    }
    if (name.trim().length < 2) {
      setFormError('El nombre debe tener al menos 2 caracteres.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategoryApi(editingCategory.id, {
          name: name.trim(),
          description: description.trim() || undefined,
        });
      } else {
        await createCategoryApi({
          name: name.trim(),
          description: description.trim() || undefined,
        });
      }
      handleCloseModal();
      await fetchCategories();
    } catch (err: unknown) {
      let msg = 'Ocurrio un error al procesar la solicitud.';
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
    if (!deletingCategory) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteCategoryApi(deletingCategory.id);
      setDeletingCategory(null);
      await fetchCategories();
    } catch (err: unknown) {
      let msg = 'Ocurrio un error al eliminar la categoria.';
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string | string[] } } };
        const serverMsg = axiosError.response?.data?.message;
        if (serverMsg) {
          msg = Array.isArray(serverMsg) ? serverMsg.join(', ') : serverMsg;
        }
      }
      setError(msg);
      setDeletingCategory(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Gestion de Categorias</h1>
          <p style={styles.subtitle}>Panel de administracion para la organizacion de eventos</p>
        </div>
        <button onClick={handleOpenCreateModal} style={styles.createButton}>
          + Nueva Categoria
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

      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: '#a0a0a0' }}>
          Cargando categorias...
        </p>
      ) : categories.length === 0 ? (
        <div style={styles.emptyCard}>
          <p>No hay categorias registradas.</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Descripcion</th>
                <th style={styles.thRight}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} style={styles.tr}>
                  <td style={styles.tdName}>{cat.name}</td>
                  <td style={styles.tdDesc}>{cat.description || 'Sin descripcion'}</td>
                  <td style={styles.tdRight}>
                    <button
                      onClick={() => handleOpenEditModal(cat)}
                      style={styles.editBtn}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setDeletingCategory(cat)}
                      style={styles.deleteBtn}
                    >
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
        <CategoryFormModal
          isEditing={Boolean(editingCategory)}
          name={name}
          description={description}
          formError={formError}
          isSubmitting={isSubmitting}
          onNameChange={setName}
          onDescriptionChange={setDescription}
          onSubmit={handleSubmitForm}
          onClose={handleCloseModal}
        />
      )}

      {deletingCategory && (
        <CategoryDeleteModal
          category={deletingCategory}
          isDeleting={isDeleting}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingCategory(null)}
        />
      )}
    </div>
  );
};
