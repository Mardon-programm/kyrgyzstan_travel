import axios from 'axios';

// Use VITE_API_URL for Vercel, relative /api for nginx proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const regionsApi = {
  list: (params) => api.get('/core/regions/', { params }),
  get: (slug) => api.get(`/core/regions/${slug}/`),
};

export const categoriesApi = {
  list: (params) => api.get('/core/categories/', { params }),
  get: (slug) => api.get(`/core/categories/${slug}/`),
};

export const locationsApi = {
  list: (params) => api.get('/core/locations/', { params }),
  get: (slug) => api.get(`/core/locations/${slug}/`),
  featured: () => api.get('/core/locations/', { params: { featured: true } }),
};

export const destinationsApi = {
  list: (params) => api.get('/destinations/destinations/', { params }),
  get: (slug) => api.get(`/destinations/destinations/${slug}/`),
  featured: () => api.get('/destinations/destinations/', { params: { featured: true } }),
  tags: () => api.get('/destinations/tags/'),
};

export const toursApi = {
  list: (params) => api.get('/tours/tours/', { params }),
  get: (slug) => api.get(`/tours/tours/${slug}/`),
  featured: () => api.get('/tours/tours/', { params: { featured: true } }),
};

export const bookingsApi = {
  create: (data) => api.post('/bookings/bookings/', data),
  list: (params) => api.get('/bookings/bookings/', { params }),
  get: (reference) => api.get(`/bookings/bookings/${reference}/`),
  confirm: (reference) => api.post(`/bookings/bookings/${reference}/confirm/`),
  cancel: (reference) => api.post(`/bookings/bookings/${reference}/cancel/`),
};

export const authApi = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (data) => api.post('/auth/register/', data),
  logout: () => api.post('/auth/logout/'),
  me: () => api.get('/auth/me/'),
  passwordReset: (email) => api.post('/auth/password/reset/', { email }),
  passwordResetConfirm: (data) => api.post('/auth/password/reset/confirm/', data),
};

export const itinerariesApi = {
  list: (params) => api.get('/itineraries/itineraries/', { params }),
  get: (slug) => api.get(`/itineraries/itineraries/${slug}/`),
  featured: () => api.get('/itineraries/itineraries/', { params: { featured: true } }),
};

export const servicesApi = {
  guides: {
    list: (params) => api.get('/services/guides/', { params }),
    get: (slug) => api.get(`/services/guides/${slug}/`),
  },
  vehicles: {
    list: (params) => api.get('/services/vehicles/', { params }),
    get: (slug) => api.get(`/services/vehicles/${slug}/`),
  },
  yurtCamps: {
    list: (params) => api.get('/services/yurt-camps/', { params }),
    get: (slug) => api.get(`/services/yurt-camps/${slug}/`),
  },
};

export const guideApi = {
  categories: {
    list: (params) => api.get('/guide/categories/', { params }),
    get: (slug) => api.get(`/guide/categories/${slug}/`),
  },
  articles: {
    list: (params) => api.get('/guide/articles/', { params }),
    get: (slug) => api.get(`/guide/articles/${slug}/`),
    featured: () => api.get('/guide/articles/', { params: { featured: true } }),
  },
  faqs: {
    list: (params) => api.get('/guide/faqs/', { params }),
    get: (id) => api.get(`/guide/faqs/${id}/`),
  },
};

export const reviewsApi = {
  list: (params) => api.get('/core/reviews/', { params }),
  get: (id) => api.get(`/core/reviews/${id}/`),
};

export const eventsApi = {
  list: (params) => api.get('/core/events/', { params }),
  get: (slug) => api.get(`/core/events/${slug}/`),
  featured: () => api.get('/core/events/', { params: { featured: true } }),
  upcoming: () => api.get('/core/events/', { params: { upcoming: true } }),
  ongoing: () => api.get('/core/events/', { params: { ongoing: true } }),
};

export default api;