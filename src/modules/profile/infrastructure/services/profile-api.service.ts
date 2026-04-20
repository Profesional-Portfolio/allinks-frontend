import type { HttpClient } from "@/core/domain/repositories/http-client";
import type { ApiResponse } from "@/core/domain/models/api-response";
import type { Profile, UpdateProfileData } from "../../domain/models/profile";
import { API_CONFIG } from "@/config/api-config";

export class ProfileApiService {
  constructor(private httpClient: HttpClient) {}

  async getProfile(): Promise<ApiResponse<Profile>> {
    return await this.httpClient.get<ApiResponse<Profile>>(
      API_CONFIG.ENDPOINTS.PROFILE.ME,
    );
  }

  async updateProfile(data: UpdateProfileData): Promise<ApiResponse<Profile>> {
    return await this.httpClient.patch<ApiResponse<Profile>>(
      API_CONFIG.ENDPOINTS.PROFILE.ME,
      data,
    );
  }

  async updateAvatar(file: File): Promise<ApiResponse<string>> {
    const formData = new FormData();
    formData.append("image", file);

    return await this.httpClient.patch<ApiResponse<string>>(
      API_CONFIG.ENDPOINTS.PROFILE.AVATAR,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  }

  async deleteAvatar(): Promise<ApiResponse<Profile>> {
    return await this.httpClient.delete<ApiResponse<Profile>>(
      API_CONFIG.ENDPOINTS.PROFILE.AVATAR,
    );
  }
}
