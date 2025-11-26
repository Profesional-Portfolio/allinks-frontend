import { AuthUser, LoginCredentials, RegisterData } from "../models/user";

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthUser>;
  register(data: RegisterData): Promise<AuthUser>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser>;
  refreshToken(): Promise<void>;
}
