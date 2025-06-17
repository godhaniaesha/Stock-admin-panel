import axios from 'axios';
import { BASE_URL } from './baseUrl';

// Create axios instance with auth header
export const getAxios = () => {
    const token = localStorage.getItem('token');
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}; 

