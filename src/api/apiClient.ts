import axios from 'axios';
import { useLoadingStore } from '../store/loading';

export const apiClient = axios.create({
  timeout: 100000, 
  headers: {
    'Content-Type': 'application/json',
  }
});

apiClient.interceptors.request.use((config) => {
  config.baseURL = import.meta.env.VITE_API_BASE_URL;
  useLoadingStore.getState().startLoading();
  
  return config;
}, (error) => {
  useLoadingStore.getState().stopLoading();
  return Promise.reject(error);
});


apiClient.interceptors.response.use(
  (response) => {
    useLoadingStore.getState().stopLoading();
    return response;
  },
  (error) => {
    useLoadingStore.getState().stopLoading();
    return Promise.reject(error);
  }
);
