export const ROUTES = {
  LOGIN: '/login',
  ADMIN: '/admin',
  ADMIN_USUARIOS: '/admin/users',
  ADMIN_CONFIGURACION: '/admin/configuration',
  ADMIN_REPORTES: '/admin/reports',
  ADMIN_ATTENDACE: '/admin/attendance',
  ADMIN_VISITS: '/admin/visits',
  ADMIN_COLLABORATORS: '/admin/collaborators',
  ADMIN_COMPANIES: '/admin/companies',
  ADMIN_POSITIONS: '/admin/positions',
  ADMIN_WORKPLACES: '/admin/workplaces',
  ADMIN_UNITYS: '/admin/unitys',
  ADMIN_AREAS: '/admin/areas',
  ADMIN_PARKING: '/admin/parking',
};

export const PERMISSIONS = {
  PERMITTED: true,
  NO_PERMITTED: false,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "v1/auth/login/",
    LOGOUT: 'v1/auth/logout',
    REFRESH: 'v1/auth/refresh',
    ME: 'v1//auth/me',
  },
  USERS: {
    LIST: "v1/users/list/",
    UPDATE: "v1/users/update/{pk}/",
    DELETE: "v1/users/delete/{pk}/",
  },
  ATTENDANCE: {
    LIST: "v1/attendance/list/",
    CREATE: "v1/attendance/create/",
    UPDATE: "v1/attendance/update/{pk}/",
    DELETE: "v1/attendance/delete/{pk}/",
  },
  VISITS: {
    LIST: "v1/visits/list/?page={page}&page_size={page_size}&query={query}",
    SEARCH: "v1/visits/search/?query={query}",
    CREATE: "v1/visits/create/",
    CREATE_MASIVE: "v1/visits/create-masive/",
    PATCH: "v1/visits/update/{pk}/",
    DELETE: "v1/visits/delete/{pk}/",
  },
  COLLABORATORS: {
    LIST: "v1/collaborators/list/",
    GET: "v1/collaborators/{pk}/",
    SEARCH: "v1/collaborators/search/?query={query}",
    UPDATE: "v1/collaborators/update/{pk}/",
    DELETE: "v1/collaborators/delete/{pk}/",
  },
  COMPANIES: {
    LIST: "v1/companies/list/",
    UPDATE: "v1/companies/update/{pk}/",
    DELETE: "v1/companies/delete/{pk}/",
  },
  POSITIONS: {
    LIST: "v1/positions/list/",
    CREATE: "v1/positions/create/",
    UPDATE: "v1/positions/{pk}/",
    DELETE: "v1/positions/{pk}/",
  },
  WORKPLACES: {
    LIST: "v1/workplaces/list/?page={page}&page_size={page_size}&query={query}",
  },
  UNITYS: {
    LIST: "v1/unitys/list/?page={page}&page_size={page_size}&query={query}",
  },
  AREAS: {
    LIST: "v1/areas/list/?page={page}&page_size={page_size}&query={query}",
    CREATE: "v1/areas/create/",
    UPDATE: "v1/areas/{pk}/",
    DELETE: "v1/areas/{pk}/",
  },
  PARKING: {
    LIST: "v1/parking/list/?page={page}&page_size={page_size}&query={query}",
    LIST_AVAILABLE: "v1/parking/list-available/",
  },
  DASHBOARD: {
    STATS: "v1/dashboard/",
    WORKERS_INSIDE_LIST: "v1/dashboard/workers-inside/",
    VISITORS_INSIDE_LIST: "v1/dashboard/visitors-inside/",
    WORKER_ENTRIES_TODAY_LIST: "v1/dashboard/worker-entries-today/",
    TOTAL_VISITS_TODAY_LIST: "v1/dashboard/total-visits-today/",
  },
  REPORTS: {
      GENERATE: "v1/report/generate/",
      COMPANIES: "v1/report/companies/",
      DOWNLOAD: "v1/report/download/",
    },
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
