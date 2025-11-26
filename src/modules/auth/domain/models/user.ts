import type { User } from "@/modules/core/domain/models/user";

export interface AuthUser extends User {
  // Additional auth-specific fields can be added here
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
}
