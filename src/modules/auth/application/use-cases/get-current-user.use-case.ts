import type { AuthRepository } from "@/auth/domain/repositories/auth.repository";
import type { AuthUser } from "@/auth/domain/models/user";

export class GetCurrentUserUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<AuthUser> {
    return await this.authRepository.getCurrentUser();
  }
}
