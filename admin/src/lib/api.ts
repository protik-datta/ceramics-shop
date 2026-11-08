import axios, { AxiosError } from 'axios';

export class ApiRequestError extends Error {
  status?: number;
  fieldErrors?: Record<string, string>;
  constructor(message: string, status?: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL: `${API_URL}/admin`, timeout: 20000 });

api.interceptors.response.use(
  (r) => r,
  (e: AxiosError<{ message?: string; errors?: Record<string, string> }>) => {
    if (e.code === 'ECONNABORTED') return Promise.reject(new ApiRequestError('Request timed out'));
    if (!e.response) return Promise.reject(new ApiRequestError('Cannot reach the server'));
    const { status, data } = e.response;
    return Promise.reject(new ApiRequestError(data?.message || 'Something went wrong', status, data?.errors));
  }
);
