import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Auth
export const login = (data) => API.post('/auth/login', data);
export const logout = () => API.post('/auth/logout');
export const register = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');

// Services
export const getServices = () => API.get('/services');
export const createService = (data) => API.post('/services', data);

// Cars
export const getCars = () => API.get('/cars');
export const createCar = (data) => API.post('/cars', data);

// Service Records
export const getServiceRecords = () => API.get('/service-records');
export const createServiceRecord = (data) => API.post('/service-records', data);
export const updateServiceRecord = (id, data) => API.put(`/service-records/${id}`, data);
export const deleteServiceRecord = (id) => API.delete(`/service-records/${id}`);

// Payments
export const getPayments = () => API.get('/payments');
export const createPayment = (data) => API.post('/payments', data);

// Reports
export const getPaymentReport = () => API.get('/reports/payments');
export const getSummary = () => API.get('/reports/summary');
