import type { User } from "@/core/domain/models/user";

export type Profile = User;

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  username?: string;
}

export interface ProfileRepository {
  getProfile(): Promise<Profile>;
  updateProfile(data: UpdateProfileData): Promise<Profile>;
  updateAvatar(file: File): Promise<Profile>;
  deleteAvatar(): Promise<Profile>;
}
