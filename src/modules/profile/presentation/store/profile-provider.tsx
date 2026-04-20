import React, { useState, useCallback, type ReactNode } from "react";
import type { Profile, UpdateProfileData } from "../../domain/models/profile";
import { GetProfileUseCase } from "../../application/use-cases/get-profile.use-case";
import { UpdateProfileUseCase } from "../../application/use-cases/update-profile.use-case";
import { UpdateAvatarUseCase } from "../../application/use-cases/update-avatar.use-case";
import { DeleteAvatarUseCase } from "../../application/use-cases/delete-avatar.use-case";
import { HttpProfileRepository } from "../../infrastructure/repositories/http-profile.repository";
import { ProfileApiService } from "../../infrastructure/services/profile-api.service";
import { AxiosHttpClient } from "@/core/infrastructure/adapters/axios-http-client";
import { API_CONFIG } from "@/config/api-config";
import { ProfileContext, type ProfileContextType } from "./profile-context";

// Initialize dependencies
const httpClient = new AxiosHttpClient(API_CONFIG.BASE_URL);
const profileApiService = new ProfileApiService(httpClient);
const profileRepository = new HttpProfileRepository(profileApiService);

// Initialize use cases
const getProfileUseCase = new GetProfileUseCase(profileRepository);
const updateProfileUseCase = new UpdateProfileUseCase(profileRepository);
const updateAvatarUseCase = new UpdateAvatarUseCase(profileRepository);
const deleteAvatarUseCase = new DeleteAvatarUseCase(profileRepository);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedProfile = await getProfileUseCase.execute();
      setProfile(fetchedProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = async (data: UpdateProfileData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedProfile = await updateProfileUseCase.execute(data);
      setProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAvatar = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedProfile = await updateAvatarUseCase.execute(file);
      setProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update avatar");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAvatar = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedProfile = await deleteAvatarUseCase.execute();
      setProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete avatar");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: ProfileContextType = {
    profile,
    isLoading,
    error,
    getProfile,
    updateProfile,
    updateAvatar,
    deleteAvatar,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
