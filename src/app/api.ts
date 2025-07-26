import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true, // если авторизация по cookie
});

export async function login(credentials: { email: string; password: string }) {
    const res = await api.post('/auth/login', credentials);
    return res.data;
}

export async function logout() {
    await api.post('/auth/logout');
}

export async function getMe() {
    const res = await api.get('/auth/me');
    return res.data;
}

export async function getUsers() {
    const res = await api.get('/users');
    return res.data;
}

export async function getUser(id: string) {
    const res = await api.get(`/users/${id}`);
    return res.data;
}

export async function createUser(data: any) {
    const res = await api.post('/users', data);
    return res.data;
}

export async function updateUser(id: string, data: any) {
    const res = await api.patch(`/users/${id}`, data);
    return res.data;
}

export async function deleteUser(id: string) {
    const res = await api.delete(`/users/${id}`);
    return res.data;
}

export default api;
