import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email.trim()) {
      setLocalError('El correo electrónico es requerido');
      return;
    }
    if (!password) {
      setLocalError('La contraseña es requerida');
      return;
    }

    try {
      await login({ email, password });
      navigate('/');
    } catch {
      // El error se gestiona mediante el estado global error de useAuth
    }
  };

  const displayError = localError || error;

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Iniciar Sesión en PlanCity</h2>

        {displayError && (
          <div style={styles.errorBox}>
            ⚠️ {displayError}
          </div>
        )}

        <div style={styles.field}>
          <label htmlFor="email">Correo Electrónico</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="santiago@ejemplo.com"
            required
            disabled={isLoading}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={isLoading}
            style={styles.input}
          />
        </div>

        <button type="submit" disabled={isLoading} style={styles.button}>
          {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>

        <p style={styles.linkContainer}>
          ¿No tienes una cuenta aún? <Link to="/register" style={styles.link}>Regístrate aquí</Link>
        </p>
      </form>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '70vh',
    padding: '1rem',
  },
  form: {
    backgroundColor: '#1a1a2e',
    padding: '2rem',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '420px',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  field: {
    marginBottom: '1.2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #333',
    backgroundColor: '#16213e',
    color: '#fff',
    fontSize: '1rem',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#00d2ff',
    color: '#1a1a2e',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  errorBox: {
    backgroundColor: 'rgba(220, 53, 69, 0.2)',
    border: '1px solid #dc3545',
    color: '#ff6b6b',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  linkContainer: {
    marginTop: '1.5rem',
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#aaa',
  },
  link: {
    color: '#00d2ff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

