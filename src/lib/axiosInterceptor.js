import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000,
  withCredentials: true 
});

let isRefreshing = false;
let subscribers = [];


const handleTokenRefresh = async (error) => {
  const originalRequest = error.config;
  
  if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribers.push(() => resolve(axiosInstance(originalRequest))); // manejar caso de que se realiza multiples request de refesh a la vez
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post('/api/auth/refresh-token', {}, {
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-cache' // para que no usa contenido de cache! Comprueba siempre si el contenido actualziado o no
        }
      });

      const retryOriginal = await axiosInstance(originalRequest);
      subscribers.forEach(cb => cb());
      subscribers = [];
      return retryOriginal;

    } catch (refreshError) {
      console.error('No se ha podido actualizar el accessToken', refreshError);
      window.location.href = '/'; // par que redirige a pagina de login
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
  return Promise.reject(error);
};

axiosInstance.interceptors.response.use(
  response => response, // si no falla, devolvemos la respuesta
  error => handleTokenRefresh(error)
);

export default axiosInstance;