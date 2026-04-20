import type { ProfileRepository, Profile } from "../../domain/models/profile";

export class UpdateAvatarUseCase {
  constructor(private repository: ProfileRepository) {}
  async execute(file: File): Promise<Profile> {
    return await this.repository.updateAvatar(file);
  }
}
