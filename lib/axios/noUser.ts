import axios from "axios";
import { SERVER_URL } from "../core";
import toast from "react-hot-toast";

export const axiosUser = axios.create({
  baseURL: SERVER_URL,
  validateStatus(status) {
    return status > 0;
  },
});

axiosUser.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosUser.interceptors.response.use(
  (response) => {
    if (response.status >= 400 && response.status < 500)
      toast.error(response.data.detail || "unknown error");
    if (response.status >= 500) toast.error("server error");

    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      // Handle token expiration, e.g., refresh the token
      const refreshToken = localStorage.getItem("refresh");
      if (refreshToken) {
        return axios
          .post("/user/refresh", { refreshToken })
          .then((res) => {
            localStorage.setItem("token", res.data.token);
            error.config.headers.Authorization = `Bearer ${res.data.token}`;
            return axiosUser(error.config);
          })
          .catch((err) => {
            localStorage.removeItem("token");
            localStorage.removeItem("refresh");
            // Redirect to login or handle as needed
            return Promise.reject(err);
          });
      }
    }

    return Promise.reject(error);
  }
);

export default axiosUser;
