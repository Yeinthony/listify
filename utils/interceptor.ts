import axios from "axios";
import snackbarStore from "@/store/snackbarStore"; 
import * as SecureStore from 'expo-secure-store';

const REQUEST_TIMEOUT = 30000;

axios.interceptors.request.use(async(config) => {
  config.timeout = REQUEST_TIMEOUT;

  const token = await SecureStore.getItemAsync('sessionToken')
  const lang = await SecureStore.getItemAsync('lang')
  
  config.headers["Accept-Language"] = lang || "es";
  config.headers["Platform"] = "mobile";
  config.headers["X-Requested-Width"] = "XMLHttpRequest";
  if (token) config.headers["Authorization"] = "Bearer " + token;

  console.log('config interceptor', config);
  
  return config;
});

axios.interceptors.response.use(
  (response) => {
    switch (response.status) {
      case 200:
        break;
    }
    return response;
  },
  (error) => {
    const { showSnackbar } = snackbarStore.getState();
    
    if (error.code === 'ERR_NETWORK' || !error.response) {
      showSnackbar({
        message: 'Error de red: No se pudo conectar al servidor. Verifica tu conexión a internet.', 
        type: 'error'
      });
      return Promise.reject(error);
    }

    if (error.code === 'ECONNABORTED') {
      showSnackbar({
        message: "La petición ha tardado demasiado. Por favor, inténtalo de nuevo.", 
        type: 'error'
      });
      return Promise.reject(error);
    }

    if (!error.response) {
      // No hay respuesta del servidor (posiblemente no hay conexión)
      showSnackbar({
        message: "Error de conexión. Verifica tu conexión a internet.", 
        type: 'error'
      });
      return Promise.reject(error);
    }

    if (error.response) {
      const { status, data } = error.response;

      console.log("Error iterceptor: ", error.response);
      

      if(status === 400) showSnackbar({
        message: printMsg(data), 
        type: 'info'
      });
      if(status === 401 || status === 421) showSnackbar({
        message: printMsg(data), 
        type: 'info'
      });
      if(status === 422) showSnackbar({
        message: printMsg(data), 
        type: 'info'
      });
      if(status === 404) showSnackbar({
        message: printMsg(data), 
        type: 'error'
      });
      if(status === 413) showSnackbar({
        message: printMsg(data), 
        type: 'error'
      });
      if(status === 503) showSnackbar({
        message: 'Servidor no disponible', 
        type: 'error'
      });
      if(status >= 500 && status !== 503) showSnackbar({
        message: printMsg(data), 
        type: 'error'
      });
    }
    
    return Promise.reject(error);
  }
);

const printMsg = (data: {
  message: string;
  errors?: { message?: string; messages?: string }[];
}) => {
  if (data.errors) {
    let messages = data.errors.map(
      (error) => error.message || error.messages
    );
    return messages.join(" ");
  }

  if (Array.isArray(data.message)) return data.message.join(", ");

  return data.message;
};
export default axios;