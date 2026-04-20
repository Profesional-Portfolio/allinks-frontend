import type { User } from "@/core/domain/models/user";

export type Profile = User;

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  bio?: string;
  username?: string;
}

export interface ProfileRepository {
  getProfile(): Promise<Profile>;
  updateProfile(data: UpdateProfileData): Promise<Profile>;
  updateAvatar(file: File): Promise<string>;
  deleteAvatar(): Promise<Profile>;
}
