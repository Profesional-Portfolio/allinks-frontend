import type {
  AuthUser,
  LoginCredentials,
  RegisterData,
} from "@/auth/domain/models";

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthUser>;
  register(data: RegisterData): Promise<AuthUser>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser>;
  refreshToken(): Promise<void>;
}
