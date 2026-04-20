import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import type {
  HttpClient,
  RequestConfig,
} from "../../domain/repositories/http-client";

export class AxiosHttpClient implements HttpClient {
  private axiosInstance: AxiosInstance;
  private csrfToken: string | null = null;
  private csrfPromise: Promise<string> | null = null;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private async fetchCsrfToken(): Promise<string> {
    if (this.csrfToken) return this.csrfToken;
    if (this.csrfPromise) return this.csrfPromise;

    this.csrfPromise = this.axiosInstance
      .get<{ csrfToken: string }>("/api/csrf-token")
      .then((response) => {
        this.csrfToken = response.data.csrfToken;
        this.csrfPromise = null;
        return this.csrfToken;
      })
      .catch((error) => {
        this.csrfPromise = null;
        throw error;
      });

    return this.csrfPromise;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const method = config.method?.toUpperCase();
        const stateChangingMethods = ["POST", "PUT", "PATCH", "DELETE"];

        if (
          stateChangingMethods.includes(method || "") &&
          config.url !== "/api/csrf-token"
        ) {
          try {
            const token = await this.fetchCsrfToken();
            if (config.headers) {
              config.headers["x-csrf-token"] = token;
            }
          } catch (error) {
            console.error("Failed to fetch CSRF token", error);
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        console.log("Error in axios interceptor", error.response, {
          originalRequest,
        });

        // If error is 403 (could be CSRF failure)
        if (error.response?.status === 403 && !originalRequest._csrfRetry) {
          originalRequest._csrfRetry = true;
          this.csrfToken = null; // Reset token
          try {
            const token = await this.fetchCsrfToken();
            if (originalRequest.headers) {
              originalRequest.headers["x-csrf-token"] = token;
            }
            return this.axiosInstance(originalRequest);
          } catch (csrfError) {
            return Promise.reject(csrfError);
          }
        }

        // If error is 401 and we haven't retried yet, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          // If the request was to login or refresh endpoints, don't try to refresh again
          if (
            originalRequest.url?.includes("/api/auth/login") ||
            originalRequest.url?.includes("/api/auth/refresh")
          ) {
            return Promise.reject(error);
          }

          originalRequest._retry = true;

          try {
            // Try to refresh the token
            await this.axiosInstance.post("/api/auth/refresh");

            // Retry the original request
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // Refresh failed, redirect to login only if not already on the login page
            // if (window.location.pathname !== "/login") {
            //   window.location.href = "/login";
            // }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private mapConfig(config?: RequestConfig): AxiosRequestConfig {
    return {
      headers: config?.headers,
      params: config?.params,
      withCredentials: config?.withCredentials ?? true,
    };
  }

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(
      url,
      this.mapConfig(config),
    );
    return response.data;
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(
      url,
      data,
      this.mapConfig(config),
    );
    return response.data;
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(
      url,
      data,
      this.mapConfig(config),
    );
    return response.data;
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(
      url,
      this.mapConfig(config),
    );
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    const response = await this.axiosInstance.patch<T>(
      url,
      data,
      this.mapConfig(config),
    );
    return response.data;
  }
}
