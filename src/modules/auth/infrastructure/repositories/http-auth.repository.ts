import type { AuthRepository } from "../../domain/repositories/auth.repository";
import type {
  AuthUser,
  LoginCredentials,
  RegisterData,
} from "../../domain/models";
import type { AuthApiService } from "../services/auth-api.service";
import type { TokenStorage } from "../adapters/token-storage.adapter";
import type { User } from "@/modules/core/domain/models/user";

interface ApiUser extends Partial<User> {
  id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
}

export class HttpAuthRepository implements AuthRepository {
  constructor(
    private apiService: AuthApiService,
    private tokenStorage: TokenStorage,
  ) {}

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const response = await this.apiService.login(credentials);

    if (!response.data?.user) {
      throw new Error("Invalid response from server");
    }

    const apiUser = response.data.user as ApiUser;
    const user: AuthUser = {
      id: apiUser.id,
      email: apiUser.email,
      username: apiUser.username,
      firstName: apiUser.first_name || apiUser.firstName || "",
      lastName: apiUser.last_name || apiUser.lastName || "",
    };

    this.tokenStorage.saveUser(user);
    return user;
  }

  async register(data: RegisterData): Promise<AuthUser> {
    const response = await this.apiService.register(data);

    if (!response.data?.user) {
      throw new Error("Invalid response from server");
    }

    const apiUser = response.data.user as ApiUser;
    const user: AuthUser = {
      id: apiUser.id,
      email: apiUser.email,
      username: apiUser.username,
      firstName: apiUser.first_name || apiUser.firstName || "",
      lastName: apiUser.last_name || apiUser.lastName || "",
    };

    // this.tokenStorage.saveUser(user);
    return user;
  }

  async logout(): Promise<void> {
    await this.apiService.logout();
    this.tokenStorage.removeUser();
  }

  async getCurrentUser(): Promise<AuthUser> {
    // First check if we have a cached user
    const cachedUser = this.tokenStorage.getUser();
    if (cachedUser) {
      return cachedUser;
    }

    // If not, fetch from API
    const response = await this.apiService.getCurrentUser();

    if (!response.data) {
      throw new Error("User not authenticated");
    }

    const apiUser = response.data as ApiUser;
    const user: AuthUser = {
      id: apiUser.id,
      email: apiUser.email,
      username: apiUser.username || "",
      firstName: apiUser.first_name || apiUser.firstName || "",
      lastName: apiUser.last_name || apiUser.lastName || "",
    };

    return user;
  }

  async refreshToken(): Promise<void> {
    await this.apiService.refreshToken();
  }
}
