import axios from 'axios';

const API_URL = 'https://api.example.com'; // Replace with your actual API URL

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const fetchCourses = async () => {
    try {
        const response = await axios.get(`${API_URL}/courses`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const fetchCourseDetails = async (courseId) => {
    try {
        const response = await axios.get(`${API_URL}/courses/${courseId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Create a default export with axios methods
const api = {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete
};

export default api;