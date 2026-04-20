import type { ProfileRepository, Profile } from "../../domain/models/profile";

export class DeleteAvatarUseCase {
  constructor(private repository: ProfileRepository) {}
  async execute(): Promise<Profile> {
    return await this.repository.deleteAvatar();
  }
}
