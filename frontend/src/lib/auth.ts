import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

import {
  getAccessToken,
  getRefreshToken,
  logout,
  saveAccessToken,
} from "@/lib/auth";

type FailedRequestQueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

type RetriableRequestConfig = AxiosRequestConfig & {
  _retry?: boolean;
};

const baseURL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

let isRefreshing = false;
let failedQueue: FailedRequestQueueItem[] = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
      return;
    }

    if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
}

function redirectToLogin() {
  logout();

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export const api = axios.create({
  baseURL,
});

const refreshApi = axios.create({
  baseURL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      redirectToLogin();
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      redirectToLogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`,
            };

            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const response = await refreshApi.post<{ access: string }>(
        "/token/refresh/",
        {
          refresh: refreshToken,
        }
      );

      const newAccessToken = response.data.access;

      saveAccessToken(newAccessToken);

      api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);

      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      redirectToLogin();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
