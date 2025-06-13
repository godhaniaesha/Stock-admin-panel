import axios from 'axios';

const API_BASE_URL = 'http://localhost:2221/api/a1';

// Create axios instance with auth header
export const getAxios = () => {
    const token = localStorage.getItem('token');
    return axios.create({
        baseURL: API_BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}; 