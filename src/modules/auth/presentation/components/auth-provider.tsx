import React, { useState, useEffect, type ReactNode } from "react";
import type { AuthUser } from "../../domain/models/user";
import { LoginUseCase } from "../../application/use-cases/login.use-case";
import { RegisterUseCase } from "../../application/use-cases/register.use-case";
import { LogoutUseCase } from "../../application/use-cases/logout.use-case";
import { HttpAuthRepository } from "../../infrastructure/repositories/http-auth.repository";
import { AuthApiService } from "../../infrastructure/services/auth-api.service";
import { TokenStorage } from "../../infrastructure/adapters/token-storage.adapter";
import { AxiosHttpClient } from "@/modules/core/infrastructure/adapters/axios-http-client";
import { StorageAdapter } from "@/modules/core/infrastructure/adapters/storage.adapter";
import { API_CONFIG } from "@/modules/config/api-config";
import type { LoginCredentials, RegisterData } from "../../domain/models/user";
import { AuthContext, type AuthContextType } from "./auth-context";

// Initialize dependencies
const httpClient = new AxiosHttpClient(API_CONFIG.BASE_URL);
const storageAdapter = new StorageAdapter();
const tokenStorage = new TokenStorage(storageAdapter);
const authApiService = new AuthApiService(httpClient);
const authRepository = new HttpAuthRepository(authApiService, tokenStorage);

// Initialize use cases
const loginUseCase = new LoginUseCase(authRepository);
const registerUseCase = new RegisterUseCase(authRepository);
const logoutUseCase = new LogoutUseCase(authRepository);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing user on mount
    const initAuth = async () => {
      try {
        const cachedUser = tokenStorage.getUser();
        if (cachedUser) {
          setUser(cachedUser);
        }
      } catch (err) {
        console.error("Failed to initialize auth:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      const user = await loginUseCase.execute(credentials);
      setUser(user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);
      const user = await registerUseCase.execute(data);
      setUser(user);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await logoutUseCase.execute();
      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
