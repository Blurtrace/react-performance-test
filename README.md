# PlanCity — Documentación Técnica y Sustentación del Proyecto

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x/6.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.20.0-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📋 1. Visión General del Proyecto

**PlanCity** es una plataforma web moderna e interactiva diseñada para la exploración, descubrimiento y gestión de eventos culturales, recreativos y urbanos en la ciudad. El sistema permite a los ciudadanos consultar eventos disponibles por categorías, gestionar una lista personalizada de favoritos y a los administradores gestionar de forma integral el catálogo de eventos y categorías.

### 🔗 Repositorio

El código fuente del proyecto se encuentra disponible en:

**Repositorio:** https://github.com/Blurtrace/react-performance-test.git

---

## 🏗️ 2. Arquitectura del Sistema

La solución está desarrollada bajo una arquitectura de **Single Page Application (SPA)** desacoplada con backend RESTful.

### Frontend
- **Librería Core:** React 19 (TypeScript)
- **Empaquetador & Servidor Dev:** Vite
- **Enrutamiento:** React Router DOM v7
- **Cliente HTTP:** Axios centralizado con interceptores
- **Gestión de Estado Global:** Context API (`AuthContext`, `FavoritesContext`)
- **Estabilidad y Resiliencia:** `ErrorBoundary` de React para captura de excepciones en renderizado.

### Backend
- **Framework:** NestJS / Node.js
- **API Standard:** RESTful (JSON)
- **Autenticación:** JWT (JSON Web Tokens)

---

## 🔑 3. Credenciales de Acceso y Roles

El sistema cuenta con 3 niveles de acceso claramente definidos:

### 1. 🌐 Visitante (Guest)
- **Acceso:** Libre (Sin iniciar sesión).
- **Funcionalidades:**
  - Exploración del catálogo de eventos (`/events`).
  - Búsqueda por nombre y filtrado dinámico por categoría.
  - Visualización del detalle completo de eventos (`/events/:id`).
  - Consulta del catálogo de categorías (`/categories`).

### 2. 👤 Usuario Registrado
- **Credenciales de prueba:**
  - **Email:** `usuario@plancity.com` / `user@ejemplo.com`
  - **Contraseña:** `UserPassword123!`
- **Funcionalidades adicionales:**
  - Guardar y remover eventos de la lista personal de **Favoritos** (`/favorites`).
  - Persistencia de favoritos en servidor/almacenamiento local.
  - Gestión de perfil de sesión.

### 3. 🛡️ Administrador (Admin)
- **Credenciales de prueba:**
  - **Email:** `admin@plancity.com` / `admin@ejemplo.com`
  - **Contraseña:** `AdminPassword123!`
- **Funcionalidades administrativas:**
  - **Gestión de Categorías (`/admin/categories`):** Crear, editar y eliminar categorías.
  - **Gestión de Eventos (`/admin/events`):** Crear eventos, modificar información, asignar categorías, fechas, capacidad, ubicación, precio y eliminar eventos.
  - Acceso protegido mediante `AdminRoute` (guardia de enrutamiento).

---

## ⚡ 4. Guía de Instalación y Ejecución

### Requisitos Previos
- **Node.js** (v18.x o superior)
- **npm** (v9.x o superior) o **yarn**
- **Git**

### 🔐 Variables de Entorno

El frontend utiliza una variable de entorno para definir la URL base del backend. Crea un archivo `.env` en la raíz de la carpeta `front` con la siguiente configuración:

```env
VITE_API_URL=http://localhost:3000
```

Asegúrate de ajustar `VITE_API_URL` si el backend utiliza una dirección o puerto diferente.

### Pasos para Ejecutar el Proyecto

#### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd performance-test
```

#### 2. Configurar y ejecutar el Backend
```bash
cd backend
npm install
npm run start:dev
```
El servidor backend se iniciará en `http://localhost:3000` (o el puerto configurado).

#### 3. Configurar y ejecutar el Frontend
En una nueva terminal:
```bash
cd front
npm install
npm run dev
```
La aplicación cliente estará disponible en `http://localhost:5173`.


---

## 🛡️ 5. Manejo de Tokens, HTTP e Interceptores

### Almacenamiento del Token JWT
- Al iniciar sesión o registrarse con éxito, el servidor responde con un token de acceso JWT (`accessToken`) y los datos del usuario.
- El token se almacena en el `localStorage` del navegador mediante las claves estructuradas:
  - `plancity_token`: Cadena JWT de autenticación.
  - `plancity_user`: Datos de perfil y rol (`USER` | `ADMIN`).
- Esto garantiza la persistencia de la sesión tras recargar la página y permite la hidratación inmediata del `AuthProvider`.

### Interceptores de Axios (`axiosInstance.ts`)

#### 1. Interceptor de Solicitud (Request Interceptor)
Cada petición saliente enviada a través de `axiosInstance` pasa por un interceptor que adjunta automáticamente el token Bearer en las cabeceras HTTP:

```typescript
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### 2. Interceptor de Respuesta (Response Interceptor)
Permite la captura y centralización de errores HTTP:
- **401 Unauthorized:** Si la sesión ha expirado o el token es inválido, el interceptor remueve las claves de `localStorage` y limpia el estado de autenticación.
- **403 Forbidden:** Notifica al usuario que carece de permisos administrativos para la acción requerida.
- **400 / 404 / 409 / Network Error:** Normaliza la respuesta para presentar mensajes legibles e informativos en la interfaz de usuario, evitando fallos silenciosos.

## 📡 6. Endpoints de la API

La aplicación consume una API REST para autenticación, categorías, eventos y favoritos:

| Módulo | Método | Endpoint |
|---|---|---|
| Auth | POST | `/auth/register` |
| Auth | POST | `/auth/login` |
| Auth | POST | `/auth/logout` |
| Auth | GET | `/users/me` |
| Categories | GET | `/categories` |
| Categories | GET | `/categories/:id` |
| Categories | POST | `/categories` |
| Categories | PATCH | `/categories/:id` |
| Categories | DELETE | `/categories/:id` |
| Events | GET | `/events` |
| Events | GET | `/events/:id` |
| Events | POST | `/events` |
| Events | PATCH | `/events/:id` |
| Events | DELETE | `/events/:id` |
| Favorites | GET | `/favorites` |
| Favorites | POST | `/favorites/:eventId` |
| Favorites | DELETE | `/favorites/:eventId` |

---

## ⚠️ 7. Estrategia de Control de Errores y ErrorBoundary

Para dar cumplimiento a los criterios de estabilidad y feedback visual:
1. **Resiliencia de Renderizado (`ErrorBoundary`):** Envuelve la aplicación principal en `App.tsx`. Ante cualquier error inesperado en el árbol de componentes React, intercepta la excepción y muestra una pantalla amigable de recuperación en lugar de la "pantalla blanca de la muerte".
2. **Normalización de Errores de API (`apiError.ts`):** Convierte errores HTTP y de red en mensajes claros para el usuario, clasificándolos en:
   - Errores de Red / Desconexión.
   - Errores de Validación (400).
   - Errores de Autenticación / Autorización (401, 403).
   - Errores de Conflicto (409) y Recurso no encontrado (404).

---

## 🧪 8. Pruebas y Validación de Calidad

El proyecto cuenta con verificación de tipos estáticos, linting y pruebas unitarias/integración:

### Comandos de Validación
- **Verificación de Tipos (TypeScript):**
  ```bash
  npx tsc --noEmit
  ```
- **Auditoría de Código (ESLint):**
  ```bash
  npm run lint
  ```
- **Compilación de Producción (Vite Build):**
  ```bash
  npm run build
  ```

---

## 🔄 9. Flujo de Uso Sugerido

El flujo principal de uso de PlanCity es:

1. Explorar eventos y categorías como visitante.
2. Registrarse como usuario nuevo.
3. Iniciar sesión.
4. Gestionar eventos favoritos.
5. Cerrar sesión.
6. Iniciar sesión con credenciales de administrador.
7. Gestionar categorías y eventos desde el panel administrativo.

---

## 📁 10. Estructura de Directorios (Frontend)

```
front/
├── public/                  # Recursos estáticos
├── src/
│   ├── api/                 # Definición de servicios REST (Axios)
│   │   ├── auth.api.ts
│   │   ├── axiosInstance.ts
│   │   ├── categories.api.ts
│   │   ├── events.api.ts
│   │   ├── favorites.api.ts
│   │   └── health.api.ts
│   ├── components/          # Componentes reutilizables de UI
│   │   ├── ErrorBoundary.tsx
│   │   ├── EventCard.tsx
│   │   ├── EventForm.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── context/             # Contextos globales (Auth, Favorites)
│   │   ├── AuthProvider.tsx
│   │   └── FavoritesProvider.tsx
│   ├── hooks/               # Custom Hooks
│   │   ├── useAuth.ts
│   │   └── useFavorites.ts
│   ├── pages/               # Vistas principales y panel admin
│   │   ├── admin/
│   │   │   ├── AdminCategoriesPage.tsx
│   │   │   └── AdminEventsPage.tsx
│   │   ├── CategoriesPage.tsx
│   │   ├── EventsPage.tsx
│   │   ├── HomePage.tsx
│   │   └── LoginPage.tsx
│   ├── routes/              # Enrutamiento (AppRouter, AdminRoute)
│   ├── types/               # Interfaces y tipos de TypeScript
│   └── utils/               # Formateadores, constantes y mapeador de errores
├── package.json
└── vite.config.ts
```

---

*Desarrollado como parte de la evaluación de desempeño y requerimientos de la plataforma PlanCity.*
