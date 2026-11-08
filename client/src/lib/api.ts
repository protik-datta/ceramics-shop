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

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ message?: string; errors?: Record<string, string> }>) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new ApiRequestError('সার্ভার সাড়া দিচ্ছে না, আবার চেষ্টা করুন'));
    }
    if (!error.response) {
      return Promise.reject(new ApiRequestError('ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন'));
    }
    const { status, data } = error.response;
    const message =
      status >= 500 ? 'সার্ভারে সমস্যা হয়েছে, কিছুক্ষণ পরে আবার চেষ্টা করুন' : data?.message || 'কিছু ভুল হয়েছে';
    return Promise.reject(new ApiRequestError(message, status, data?.errors));
  }
);
