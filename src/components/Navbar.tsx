import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, role, isAuthenticated, logout } = useAuth();

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          PlanCity
        </Link>
        <nav style={styles.nav}>
          <Link to="/" style={styles.link}>Inicio</Link>
          <Link to="/events" style={styles.link}>Eventos</Link>
          <Link to="/categories" style={styles.link}>Categorias</Link>
          {isAuthenticated && (
            <Link to="/favorites" style={styles.link}>Mis Favoritos</Link>
          )}
          {role === 'admin' && (
            <>
              <Link to="/admin/categories" style={styles.adminNavLink}>
                Admin Categorias
              </Link>
              <Link to="/admin/events" style={styles.adminNavLink}>
                Admin Eventos
              </Link>
            </>
          )}
          {isAuthenticated ? (
            <div style={styles.userInfo}>
              <span style={styles.userName}>
                Hola, {user?.name}{' '}
                <span style={role === 'admin' ? styles.adminBadge : styles.userBadge}>
                  [{role?.toUpperCase() || 'USER'}]
                </span>
              </span>
              <button onClick={() => logout()} style={styles.logoutButton}>Cerrar Sesion</button>
            </div>
          ) : (
            <div style={styles.authButtons}>
              <Link to="/login" style={styles.loginLink}>Iniciar Sesion</Link>
              <Link to="/register" style={styles.registerLink}>Registrarse</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    backgroundColor: '#1a1a2e',
    color: '#ffffff',
    padding: '1rem 2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#00d2ff',
    textDecoration: 'none',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  link: {
    color: '#ffffff',
    textDecoration: 'none',
    fontWeight: 500,
  },
  adminNavLink: {
    color: '#00d2ff',
    textDecoration: 'none',
    fontWeight: 'bold',
    border: '1px solid #00d2ff',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px',
  },
  authButtons: {
    display: 'flex',
    gap: '0.8rem',
  },
  loginLink: {
    backgroundColor: '#00d2ff',
    color: '#1a1a2e',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  registerLink: {
    backgroundColor: 'transparent',
    border: '1px solid #00d2ff',
    color: '#00d2ff',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userName: {
    fontSize: '0.9rem',
    color: '#e0e0e0',
  },
  adminBadge: {
    backgroundColor: '#e94560',
    color: '#fff',
    padding: '0.15rem 0.4rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    marginLeft: '0.4rem',
  },
  userBadge: {
    backgroundColor: '#0f3460',
    color: '#00d2ff',
    padding: '0.15rem 0.4rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    marginLeft: '0.4rem',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};


