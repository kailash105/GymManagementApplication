import axios from 'axios';
import { getToken } from '../utils/storage';

// In a real app, this would be in an environment variable
// In a real app, this would be in an environment variable
// For Android Emulator use 'http://10.0.2.2:5001/api'
// For iOS Simulator use 'http://localhost:5001/api'
const BASE_URL = 'http://localhost:5001/api';

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

client.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401/403 globally if needed, though AuthContext usually handles the state
        if (error.response?.status === 401) {
            // Logic to trigger logout could be communicated via events or callbacks if outside React context
            console.warn('Unauthorized access - potential logout trigger');
        }
        return Promise.reject(error);
    }
);

export default client;
