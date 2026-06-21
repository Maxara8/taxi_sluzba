import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Automatski dodaje token u svaki zahtev
API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

// User rute
export const loginUser = (data) => API.post('/users/login', data);
export const registerUser = (data) => API.post('/users/register', data);
export const getUserProfile = () => API.get('/users/profile');

// Ride rute
export const createRide = (data) => API.post('/rides', data);
export const getMyRides = () => API.get('/rides/my');
export const getPendingRides = () => API.get('/rides/pending');
export const getDriverRides = () => API.get('/rides/driver');
export const getAllRides = () => API.get('/rides');
export const acceptRide = (id) => API.put(`/rides/${id}/accept`);
export const startRide = (id) => API.put(`/rides/${id}/start`);
export const completeRide = (id) => API.put(`/rides/${id}/complete`);
export const cancelRide = (id) => API.put(`/rides/${id}/cancel`);
export const rateRide = (id, data) => API.put(`/rides/${id}/rate`, data);

// Vehicle rute
export const getVehicles = () => API.get('/vehicles');
export const addVehicle = (data) => API.post('/vehicles', data);
export const deleteVehicle = (id) => API.delete(`/vehicles/${id}`);
export const toggleVehicle = (id) => API.put(`/vehicles/${id}/toggle`);