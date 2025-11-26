import { StorageAdapter } from "@/modules/core/infrastructure/adapters/storage.adapter";
import type { AuthUser } from "../../domain/models/user";

const AUTH_USER_KEY = "auth_user";

export class TokenStorage {
  constructor(private storage: StorageAdapter) {}

  saveUser(user: AuthUser): void {
    this.storage.set(AUTH_USER_KEY, user);
  }

  getUser(): AuthUser | null {
    return this.storage.get<AuthUser>(AUTH_USER_KEY);
  }

  removeUser(): void {
    this.storage.remove(AUTH_USER_KEY);
  }

  hasUser(): boolean {
    return this.storage.has(AUTH_USER_KEY);
  }

  clear(): void {
    this.storage.clear();
  }
}
