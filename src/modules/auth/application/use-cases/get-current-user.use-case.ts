import { AuthRepository } from "../../domain/repositories/auth.repository";
import { AuthUser } from "../../domain/models/user";

export class GetCurrentUserUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<AuthUser> {
    return await this.authRepository.getCurrentUser();
  }
}
