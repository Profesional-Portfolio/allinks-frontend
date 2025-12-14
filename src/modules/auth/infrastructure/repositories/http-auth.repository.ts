import type { AuthRepository } from "../../domain/repositories/auth.repository";
import type {
  AuthUser,
  LoginCredentials,
  RegisterData,
} from "../../domain/models";
import type { AuthApiService } from "../services/auth-api.service";
import type { TokenStorage } from "../adapters/token-storage.adapter";

export class HttpAuthRepository implements AuthRepository {
  constructor(
    private apiService: AuthApiService,
    private tokenStorage: TokenStorage
  ) {}

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const response = await this.apiService.login(credentials);

    if (!response.data?.user) {
      throw new Error("Invalid response from server");
    }

    const user: AuthUser = {
      id: response.data.user.id,
      email: response.data.user.email,
      username: response.data.user.username,
      firstName: response.data.user.firstName,
      lastName: response.data.user.lastName,
    };

    this.tokenStorage.saveUser(user);
    return user;
  }

  async register(data: RegisterData): Promise<AuthUser> {
    const response = await this.apiService.register(data);

    if (!response.data?.user) {
      throw new Error("Invalid response from server");
    }

    const user: AuthUser = {
      id: response.data.user.id,
      email: response.data.user.email,
      username: response.data.user.username,
      firstName: response.data.user.firstName,
      lastName: response.data.user.lastName,
    };

    this.tokenStorage.saveUser(user);
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

    // Note: The profile endpoint returns minimal data (userId, email)
    // We'll need to fetch full user data or use cached data
    const user: AuthUser = {
      id: response.data.userId,
      email: response.data.email,
      username: "", // Not available from profile endpoint
      firstName: "",
      lastName: "",
    };

    return user;
  }

  async refreshToken(): Promise<void> {
    await this.apiService.refreshToken();
  }
}
