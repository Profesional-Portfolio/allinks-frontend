import { AuthRepository } from "../../domain/repositories/auth.repository";

export class RefreshTokenUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<void> {
    await this.authRepository.refreshToken();
  }
}
