import type { User } from "@/modules/core/domain/models/user";

export type AuthUser = User;

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
