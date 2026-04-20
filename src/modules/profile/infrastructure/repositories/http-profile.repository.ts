import type { ProfileRepository, Profile, UpdateProfileData } from "../../domain/models/profile";
import type { ProfileApiService } from "../services/profile-api.service";

export class HttpProfileRepository implements ProfileRepository {
  constructor(private apiService: ProfileApiService) {}

  async getProfile(): Promise<Profile> {
    const response = await this.apiService.getProfile();
    if (!response.data) throw new Error("Failed to fetch profile");
    return response.data;
  }

  async updateProfile(data: UpdateProfileData): Promise<Profile> {
    const response = await this.apiService.updateProfile(data);
    if (!response.data) throw new Error("Failed to update profile");
    return response.data;
  }

  async updateAvatar(file: File): Promise<Profile> {
    const response = await this.apiService.updateAvatar(file);
    if (!response.data) throw new Error("Failed to update avatar");
    return response.data;
  }

  async deleteAvatar(): Promise<Profile> {
    const response = await this.apiService.deleteAvatar();
    if (!response.data) throw new Error("Failed to delete avatar");
    return response.data;
  }
}
