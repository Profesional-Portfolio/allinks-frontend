import type { HttpClient } from "@/core/domain/repositories/http-client";
import type { ApiResponse } from "@/core/domain/models/api-response";
import { API_CONFIG } from "@/config/api-config";
import type {
  AuthUser,
  LoginCredentials,
  RegisterData,
} from "@/auth/domain/models/user";

export class AuthApiService {
  constructor(private httpClient: HttpClient) {}

  async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ user: AuthUser }>> {
    return await this.httpClient.post<ApiResponse<{ user: AuthUser }>>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    );
  }

  async register(data: RegisterData): Promise<ApiResponse<{ user: AuthUser }>> {
    return await this.httpClient.post<ApiResponse<{ user: AuthUser }>>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      {
        email: data.email,
        password: data.password,
        username: data.username,
        first_name: data.firstName,
        last_name: data.lastName,
      }
    );
  }

  async logout(): Promise<ApiResponse> {
    return await this.httpClient.post<ApiResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGOUT
    );
  }

  async getCurrentUser(): Promise<
    ApiResponse<{ userId: string; email: string }>
  > {
    return await this.httpClient.get<
      ApiResponse<{ userId: string; email: string }>
    >(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
  }

  async refreshToken(): Promise<ApiResponse> {
    return await this.httpClient.post<ApiResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REFRESH
    );
  }
}
