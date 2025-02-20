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
                originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
                const cookiesstore = cookies();
                cookiesstore.set("accessTokenCookie",accessToken,{
                  sameSite:"strict",
                  secure:process.env.NODE_ENV==="production",
                  maxAge:900, //15 minutos= 15x60
                  httpOnly:true
                });
                resolve(axiosInstance(originalRequest));
              });
            });
          }
          originalRequest._retry = true;
          isRefreshing = true;
          try{
            const newAccessToken = await axios.post("/auth/refresh-token");
            isRefreshing = false;
            originalRequest._retry = false;
            unautorizedQueue.forEach(callback => callback(newAccessToken));
            unautorizedQueue = [];
            originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
            const cookiesstore = cookies();
            cookiesstore.set("accessTokenCookie",newAccessToken,{
                sameSite:"strict",
                secure:process.env.NODE_ENV==="production",
                maxAge:900, //15 minutos= 15x60
                httpOnly:true
            });
            return axiosInstance(originalRequest);
          }catch(e){
            isRefreshing = false;
            originalRequest._retry = false;
            return Promise.reject(e);
          }
        }
      return Promise.reject(e);
    }
  );
export default axiosInstance;