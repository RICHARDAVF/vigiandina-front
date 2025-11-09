export const ROUTES = {
  LOGIN: '/login',
  ADMIN: '/admin',
  ADMIN_USUARIOS: '/admin/users',
  ADMIN_CONFIGURACION: '/admin/configuration',
  ADMIN_REPORTES: '/admin/reports',
};

export const API_ENDPOINTS = {
  AUTH:{
    LOGIN:"v1/auth/login/",
    LOGOUT: 'v1/auth/logout',
    REFRESH: 'v1/auth/refresh',
    ME: 'v1//auth/me',
  },
  USERS:{
    LIST:"v1/users/list/"
  }
};

export const STORAGE_KEYS = {
  TOKEN: 'access',
  USER: 'auth_user',
  REFRESH_TOKEN: 'refresh',
};

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  SESSION_EXPIRED: 'Sesión expirada',
  NETWORK_ERROR: 'Error de conexión',
  UNAUTHORIZED: 'No autorizado',
  SERVER_ERROR: 'Error del servidor',
};