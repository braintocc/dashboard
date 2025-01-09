import axios from "axios";

export const requestor = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
  });

requestor.interceptors.request.use((config: any) => {
    const token = window.localStorage.getItem('token');
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
});