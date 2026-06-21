import axios from "axios";
import snackbarStore from "@/store/snackbarStore";
import * as SecureStore from "expo-secure-store";
import { ApiError } from "@/utils/apiError";

const REQUEST_TIMEOUT = 30000;

const httpClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: REQUEST_TIMEOUT,
});

httpClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("sessionToken");
  const lang = await SecureStore.getItemAsync("lang");

  config.headers["Accept-Language"] = lang || "es";
  config.headers["Platform"] = "mobile";
  config.headers["X-Requested-With"] = "XMLHttpRequest";
  if (token) config.headers["Authorization"] = "Bearer " + token;

  return config;
});

const flattenMessage = (data?: {
  message?: string | string[];
  errors?: { message?: string; messages?: string }[];
}): string => {
  if (!data) return "Error inesperado";
  if (data.errors) {
    return data.errors
      .map((e) => e.message || e.messages)
      .filter(Boolean)
      .join(" ");
  }
  if (Array.isArray(data.message)) return data.message.join(", ");
  return data.message || "Error inesperado";
};

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { showSnackbar } = snackbarStore.getState();

    // Sin respuesta del servidor: red o timeout
    if (error.code === "ERR_NETWORK" || !error.response) {
      const message =
        error.code === "ECONNABORTED"
          ? "La petición ha tardado demasiado. Por favor, inténtalo de nuevo."
          : "Error de red: No se pudo conectar al servidor. Verifica tu conexión a internet.";
      showSnackbar({ message, type: "error" });
      return Promise.reject(new ApiError(0, message, "NETWORK_ERROR", error));
    }

    const { status, data } = error.response;
    const message = flattenMessage(data);

    if (status === 503) {
      showSnackbar({ message: "Servidor no disponible", type: "error" });
    } else if ([400, 401, 421, 422].includes(status)) {
      showSnackbar({ message, type: "info" });
    } else if ([404, 413].includes(status)) {
      showSnackbar({ message, type: "error" });
    } else if (status >= 500) {
      showSnackbar({ message, type: "error" });
    }

    return Promise.reject(new ApiError(status, message, data?.error, error));
  }
);

export default httpClient;
