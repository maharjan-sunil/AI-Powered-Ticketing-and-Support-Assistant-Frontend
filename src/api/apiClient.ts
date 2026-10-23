import axios from 'axios';

export const apiClient = axios.create({
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  }
});

// Defer reading the env variable until the request actually leaves the browser
apiClient.interceptors.request.use((config) => {
  config.baseURL = import.meta.env.VITE_API_BASE_URL;
  return config;
});
