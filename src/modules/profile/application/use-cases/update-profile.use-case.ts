import type { ProfileRepository, Profile, UpdateProfileData } from "../../domain/models/profile";

export class UpdateProfileUseCase {
  constructor(private repository: ProfileRepository) {}
  async execute(data: UpdateProfileData): Promise<Profile> {
    return await this.repository.updateProfile(data);
  }
}
