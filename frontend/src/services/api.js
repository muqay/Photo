import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Portfolio API
export const portfolioAPI = {
  getAll: async (category = null) => {
    const params = category && category !== 'All' ? { category } : {};
    const response = await apiClient.get('/portfolio', { params });
    return response.data;
  },

  getFeatured: async () => {
    const response = await apiClient.get('/portfolio/featured');
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/portfolio', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/portfolio/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/portfolio/${id}`);
    return response.data;
  }
};

// Services API
export const servicesAPI = {
  getAll: async () => {
    const response = await apiClient.get('/services');
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/services', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/services/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/services/${id}`);
    return response.data;
  }
};

// Testimonials API
export const testimonialsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/testimonials');
    return response.data;
  },

  getFeatured: async () => {
    const response = await apiClient.get('/testimonials/featured');
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/testimonials', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/testimonials/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/testimonials/${id}`);
    return response.data;
  }
};

// Contact & Booking API
export const contactAPI = {
  submitMessage: async (data) => {
    const response = await apiClient.post('/contact', data);
    return response.data;
  },

  submitBooking: async (data) => {
    const response = await apiClient.post('/booking', data);
    return response.data;
  },

  getMessages: async (status = null) => {
    const params = status ? { status } : {};
    const response = await apiClient.get('/messages', { params });
    return response.data;
  },

  updateMessageStatus: async (id, status) => {
    const response = await apiClient.put(`/messages/${id}`, { status });
    return response.data;
  },

  getBookings: async (status = null) => {
    const params = status ? { status } : {};
    const response = await apiClient.get('/bookings', { params });
    return response.data;
  },

  updateBookingStatus: async (id, status) => {
    const response = await apiClient.put(`/bookings/${id}`, { status });
    return response.data;
  }
};

// Settings API
export const settingsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/settings');
    return response.data;
  },

  get: async (key) => {
    const response = await apiClient.get(`/settings/${key}`);
    return response.data;
  },

  update: async (key, value) => {
    const response = await apiClient.put(`/settings/${key}`, { value });
    return response.data;
  }
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await apiClient.get('/');
    return response.data;
  }
};

// Export the axios instance for direct usage if needed
export { apiClient };

// Error handler utility
export const handleAPIError = (error, fallbackMessage = 'Something went wrong') => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return fallbackMessage;
};