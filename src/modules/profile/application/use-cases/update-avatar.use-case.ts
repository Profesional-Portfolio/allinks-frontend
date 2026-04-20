import type { ProfileRepository } from "../../domain/models/profile";

export class UpdateAvatarUseCase {
  constructor(private repository: ProfileRepository) {}
  async execute(file: File): Promise<string> {
    return await this.repository.updateAvatar(file);
  }
}
