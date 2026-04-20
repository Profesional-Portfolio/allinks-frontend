import { createContext } from "react";
import type { Profile, UpdateProfileData } from "../../domain/models/profile";

export interface ProfileContextType {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  getProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
  deleteAvatar: () => Promise<void>;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);
