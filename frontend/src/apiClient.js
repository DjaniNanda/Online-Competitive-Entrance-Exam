import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000', // Set your base URL
});

// Set the Authorization header for every request
apiClient.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken'); // Retrieve only the access token
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`; // Use 'Bearer' for JWT
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;

