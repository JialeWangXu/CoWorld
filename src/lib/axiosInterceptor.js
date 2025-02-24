import axios from "axios";
import { cookies } from 'next/headers'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 1000,
    withCredentials: true // para poder enviar cookies con las solicitudes
  });

  let isRefreshing = false;
  let unautorizedQueue =[]; // para manejar el caso de que se realicen varias solicitudes al mismo tiempo y todas devuelvan 401


  axiosInstance.interceptors.response.use(
    response => { // Si la solicitud es exitosa, simplemente devuelva la respuesta
      return response; 
    },
    async(error) => { // sino tenemos que verificar si se puede renovar el accesstoken o no
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise(function(resolve) {
              unautorizedQueue.push((accessToken) => {
                originalRequest.headers['authorization'] = `Bearer ${accessToken}`;
                resolve(axiosInstance(originalRequest));
              });
            });
          }
          originalRequest._retry = true;
          isRefreshing = true;
          try{
            const cookiesStore = await cookies();
            const refreshToken = cookiesStore.get('refreshTokenCookie')?.value;
            if (!refreshToken) {
              throw new Error('No se encontró el refresh token');
            }
            cookiesStore.set('refreshTokenCookie',refreshToken)
            const response = await axiosInstance.post("/auth/refresh-token", {}, {
              withCredentials: true,
              headers: {
                Cookie: `refreshTokenCookie=${refreshToken};`
              }
            });
            const newAccsessToken = response.data.newAccsessToken
            isRefreshing = false;
            originalRequest._retry = false;

            unautorizedQueue.forEach(callback => callback(newAccsessToken));
            unautorizedQueue = [];
            originalRequest.headers['authorization'] = `Bearer ${newAccsessToken}`;

            return axiosInstance(originalRequest);
          }catch(e){
            console.log('Hay error actualizar'+e)
            isRefreshing = false;
            originalRequest._retry = false;
            return Promise.reject(e);
          }
        }
      return Promise.reject(e);
    }
  );
export default axiosInstance;