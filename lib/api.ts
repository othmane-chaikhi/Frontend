import axios from 'axios';

// ✅ Use environment variable for flexibility
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Export pour utilisation dans d'autres fichiers
export const API_BASE_URL = API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token is invalid, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// API service functions
export const authAPI = {
  register: (data: any) => api.post('/api/auth/register/', data),
  login: (data: any) => api.post('/api/auth/login/', data),
  logout: (refreshToken: string) => api.post('/api/auth/logout/', { refresh_token: refreshToken }),
  getUser: () => api.get('/api/auth/me/'),
};

export const postsAPI = {
  list: (params?: any) => api.get('/api/posts/', { params }),
  get: (id: number) => api.get(`/api/posts/${id}/`),
  create: (data: FormData) => api.post('/api/posts/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: number, data: FormData) => api.patch(`/api/posts/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => api.delete(`/api/posts/${id}/`),
  recent: () => api.get('/api/posts/recent/'),
  stats: () => api.get('/api/posts/stats/'),
};

export const commentsAPI = {
  list: (postId?: number) => api.get('/api/comments/', { params: postId ? { post: postId } : {} }),
  create: (data: any) => api.post('/api/comments/', data),
  delete: (id: number) => api.delete(`/api/comments/${id}/`),
  toggleApproval: (id: number) => api.post(`/api/comments/${id}/toggle_approval/`),
};

export const profileAPI = {
  get: (id: number) => api.get(`/api/profiles/${id}/`),
  me: () => api.get('/api/profiles/me/'),
  update: (data: FormData) => api.patch('/api/profiles/me/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const siteConfigAPI = {
  get: () => api.get('/api/site-config/current/'),
  update: (id: number, data: any) => {
    // If data is FormData, use multipart/form-data, otherwise use JSON
    if (data instanceof FormData) {
      return api.patch(`/api/site-config/${id}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.patch(`/api/site-config/${id}/`, data);
  },
  updateCV: (data: FormData) => api.patch('/api/site-config/update_cv/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const academyAPI = {
  // Courses (Series)
  courses: {
    list: () => api.get('/api/academy/courses/'),
    get: (id: number | string) => api.get(`/api/academy/courses/${id}/`),
    create: (data: any) => api.post('/api/academy/courses/', data),
    update: (id: number | string, data: any) => api.patch(`/api/academy/courses/${id}/`, data),
    delete: (id: number | string) => api.delete(`/api/academy/courses/${id}/`),
    start: (id: number | string) => api.post(`/api/academy/courses/${id}/start/`),
    getProgress: (id: number | string) => api.get(`/api/academy/courses/${id}/progress/`),
    completeItem: (courseId: number | string, itemId: number) => 
      api.post(`/api/academy/courses/${courseId}/complete_item/`, { item_id: itemId }),
  },
  
  // Course Items
  courseItems: {
    list: (courseId?: number | string) => {
      if (courseId) {
        return api.get(`/api/academy/courses/${courseId}/items/`);
      }
      return api.get('/api/academy/course-items/');
    },
    get: (id: number) => api.get(`/api/academy/course-items/${id}/`),
    create: (data: any) => api.post('/api/academy/course-items/', data),
    update: (id: number, data: any) => api.patch(`/api/academy/course-items/${id}/`, data),
    delete: (id: number) => api.delete(`/api/academy/course-items/${id}/`),
    getNavigation: (id: number) => api.get(`/api/academy/course-items/${id}/navigation/`),
  },
  
  // Videos
  videos: {
    list: () => api.get('/api/academy/videos/'),
    get: (id: number) => api.get(`/api/academy/videos/${id}/`),
    create: (data: any) => api.post('/api/academy/videos/', data),
    update: (id: number, data: any) => api.patch(`/api/academy/videos/${id}/`, data),
    delete: (id: number) => api.delete(`/api/academy/videos/${id}/`),
    markCompleted: (id: number) => api.post(`/api/academy/videos/${id}/mark_completed/`),
  },
  
  // Exercises
  exercises: {
    list: () => api.get('/api/academy/exercises/'),
    get: (id: number) => api.get(`/api/academy/exercises/${id}/`),
    create: (data: any) => api.post('/api/academy/exercises/', data),
    update: (id: number, data: any) => api.patch(`/api/academy/exercises/${id}/`, data),
    delete: (id: number) => api.delete(`/api/academy/exercises/${id}/`),
    execute: (id: number, data: {code: string, stdin?: string}) => 
      api.post(`/api/academy/exercises/${id}/execute/`, data).then(res => res.data),
    submit: (id: number, code: string) => api.post(`/api/academy/exercises/${id}/submit/`, { code }),
    getSolution: (id: number) => api.get(`/api/academy/exercises/${id}/solution/`),
  },
  
  // Progress
  progress: {
    get: () => api.get('/api/academy/progress/me/'),
    stats: () => api.get('/api/academy/progress/stats/'),
  },
};

