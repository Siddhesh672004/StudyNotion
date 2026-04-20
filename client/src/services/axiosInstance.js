import axios from 'axios';

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1";

const axiosInstance = axios.create({
  baseURL: REACT_APP_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Handle both plain-string tokens and JSON-serialized tokens.
    const rawToken = localStorage.getItem('token');
    let token = null;

    if (rawToken) {
      try {
        token = JSON.parse(rawToken);
      } catch (_) {
        token = rawToken;
      }

      if (token === 'undefined' || token === 'null' || token === '') {
        token = null;
      }
    }

    if (token) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;
    const isTokenAuthError =
      message === 'Token is missing' ||
      message === 'Token is invalid' ||
      message === 'Something went wrong while validating the token';

    if (status === 401 && isTokenAuthError) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    const errorMessage = message || 'Something went wrong';
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;
