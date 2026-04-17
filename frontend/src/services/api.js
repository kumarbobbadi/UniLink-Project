import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('unilink_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('unilink_token');
      localStorage.removeItem('unilink_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
};

export const profileAPI = {
  getMe: () => api.get('/profile/me'),
  update: (data) => api.put('/profile/update', data),
  getUser: (userId) => api.get(`/profile/user/${userId}`)
};

export const postsAPI = {
  create: (data) => api.post('/posts/create', data),
  getAll: () => api.get('/posts'),
  like: (id) => api.put(`/posts/${id}/like`),
  comment: (id, data) => api.post(`/posts/${id}/comment`, data),
  delete: (id) => api.delete(`/posts/${id}`)
};

export const connectionsAPI = {
  send: (data) => api.post('/connections/send', data),
  accept: (data) => api.put('/connections/accept', data),
  getAll: () => api.get('/connections')
};

export const groupsAPI = {
  create: (data) => api.post('/groups/create', data),
  getAll: () => api.get('/groups'),
  join: (data) => api.post('/groups/join', data)
};

export const eventsAPI = {
  create: (data) => api.post('/events/create', data),
  getAll: () => api.get('/events'),
  register: (data) => api.post('/events/register', data)
};

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/user/${id}`),
  approveEvent: (data) => api.post('/admin/approve-event', data),
  getPendingEvents: () => api.get('/admin/pending-events')
};

export default api;
