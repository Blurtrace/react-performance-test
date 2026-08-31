# 📍 PlanCity

PlanCity es una aplicación web diseñada para el descubrimiento y la organización de eventos y actividades locales, como conciertos, talleres y eventos deportivos. El sistema permite a los usuarios buscar eventos, gestionar sus favoritos y ofrece un panel de administración para el control de categorías y eventos.

---

## 🚀 Características

*   **Autenticación:** Registro e inicio de sesión seguro.
*   **Gestión de Eventos:** Visualización de eventos, detalle y búsqueda.
*   **Gestión de Favoritos:** Marcado y consulta de actividades favoritas por usuario.
*   **Panel Administrativo:** CRUD completo de categorías y eventos para usuarios con rol `admin`.
*   **Protección de Rutas:** Acceso restringido según el rol del usuario.
*   **Manejo de Errores:** Feedback visual mediante toasts y un `ErrorBoundary` para evitar pantallas en blanco.
*   **Interfaz:** Diseño responsivo.

---

## 🛠️ Tecnologías

![React](https://img.shields.io/badge/React-19.2.8-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-~6.0.2-blue)
![Vite](https://img.shields.io/badge/Vite-^8.2.2-yellow)
![Axios](https://img.shields.io/badge/Axios-^1.20.0-green)
![React Router](https://img.shields.io/badge/React_Router-^7.18.3-red)
![Vitest](https://img.shields.io/badge/Vitest-^4.1.11-orange)
![Testing Library](https://img.shields.io/badge/Testing_Library-^16.3.3-red)

---

## 👥 Roles y permisos

### Visitante
*   Puede ver eventos, categorías y detalles.

### Usuario autenticado
*   Puede realizar todas las acciones del visitante.
*   Puede gestionar y consultar sus eventos favoritos.

### Administrador
*   Tiene acceso total.
*   Puede gestionar (crear, editar, eliminar) categorías y eventos.
*   Las rutas administrativas (`/admin/*`) están protegidas mediante el componente `AdminRoute`.

---

## 📋 Requisitos previos

*   [Node.js](https://nodejs.org/) (versión recomendada LTS)
*   [npm](https://www.npmjs.com/)
*   [Git](https://git-scm.com/)

---

## ⚙️ Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Blurtrace/react-performance-test.git
cd front

# Instalar dependencias
npm install
🔐 Variables de entorno
Crea un archivo .env en la raíz del proyecto basándote en la configuración de Vite:


VITE_API_URL=http://localhost:3000
Asegúrate de ajustar VITE_API_URL a la dirección de tu servidor backend.

▶️ Ejecución
Desarrollo

npm run dev
Producción

npm run build
npm run preview
🔑 Credenciales de prueba
Admin

Email: admin@examen.com
Password: Admin123!
Nota: Estas son credenciales de prueba; no deben usarse en entornos de producción.

Los usuarios normales pueden registrarse a través de la interfaz de registro.

🔐 Autenticación y sesión
Endpoint: /auth/login
Almacenamiento: Se utiliza localStorage con la clave definida en STORAGE_KEYS.TOKEN.
Persistencia: El token se guarda al iniciar sesión y se elimina en el interceptor de respuesta si se recibe un error 401 Unauthorized.
Recuperación: La sesión se valida al cargar la aplicación utilizando el hook useAuth y el contexto AuthProvider.
🌐 Cliente HTTP e interceptor
Se utiliza Axios para las peticiones debido a su robustez y facilidad para gestionar interceptores.

Instancia: Configurada en src/api/axiosInstance.ts con una baseURL y timeout.
Interceptor de Request: Inyecta automáticamente el token JWT en la cabecera Authorization: Bearer <token> si está presente en localStorage.
Interceptor de Response:
Normaliza errores mediante normalizeApiError.
Desencadena mensajes de error visuales mediante un sistema de Toast.
Gestiona errores críticos (como el 401) limpiando las credenciales de localStorage.
🛡️ Protección de rutas
El control de acceso se realiza mediante componentes de envoltura:

Rutas Públicas: Accesibles sin autenticación.
AdminRoute: Verifica si el usuario está autenticado y posee el rol admin antes de renderizar los componentes administrativos. Si el usuario no tiene permisos, se redirige o se bloquea el acceso.
📡 API consumida
Módulo	Endpoints
Auth	POST /auth/register, POST /auth/login, POST /auth/logout, GET /users/me
Categories	GET /categories, GET /categories/:id, POST /categories, PATCH /categories/:id, DELETE /categories/:id
Events	GET /events, GET /events/:id, POST /events, PATCH /events/:id, DELETE /events/:id
Favorites	GET /favorites, POST /favorites/:eventId, DELETE /favorites/:eventId
⚠️ Manejo de errores
Normalización: src/utils/apiError.ts transforma errores de Axios en una interfaz NormalizedApiError para facilitar el manejo.
Feedback: Se utiliza un componente de Toast (gestionado por ToastContext) para mostrar mensajes claros al usuario.
Resiliencia: Un ErrorBoundary en src/components/ErrorBoundary.tsx envuelve la aplicación para capturar errores de renderizado y ofrecer una opción de recarga al usuario, evitando pantallas en blanco.
🧪 Testing
Se utiliza Vitest con React Testing Library.

Ejecutar pruebas: npm run test
Pruebas unitarias: Ej: src/tests/apiError.test.ts para validar la lógica de normalización de errores.
Pruebas de integración: Ej: src/tests/integration.test.ts para verificar flujos básicos.
📁 Estructura del proyecto

src/
├── api/          # Configuraciones de Axios y endpoints de API
├── components/   # Componentes UI reutilizables y ErrorBoundary
├── context/      # Contextos React (Auth, Toast, Favorites)
├── hooks/        # Hooks personalizados (useAuth, useFavorites)
├── pages/        # Componentes de página (rutas principales)
├── routes/       # Definición de rutas y componentes de protección
├── tests/        # Pruebas unitarias e integración
├── types/        # Definiciones de TypeScript
└── utils/        # Funciones de utilidad (constants, apiError, formatters)
🧪 Flujo de uso sugerido
Explorar eventos y categorías como visitante.
Registrarse como usuario nuevo.
Iniciar sesión.
Gestionar eventos favoritos.
Cerrar sesión.
Iniciar sesión con credenciales de administrador.
Gestionar categorías y eventos desde el panel administrativo.