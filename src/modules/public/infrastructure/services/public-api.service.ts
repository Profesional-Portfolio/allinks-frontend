import type { HttpClient } from "@/core/domain/repositories/http-client";
import type { ApiResponse } from "@/core/domain/models/api-response";
import type { PublicProfile, UsernameAvailabilityResponse } from "../../domain/models/public-profile";
import { API_CONFIG } from "@/config/api-config";

export class PublicApiService {
  constructor(private httpClient: HttpClient) {}

  async getPublicProfile(username: string): Promise<ApiResponse<PublicProfile>> {
    return await this.httpClient.get<ApiResponse<PublicProfile>>(
      API_CONFIG.ENDPOINTS.PUBLIC.PROFILE(username)
    );
  }

  async checkUsernameAvailability(username: string): Promise<ApiResponse<UsernameAvailabilityResponse>> {
    return await this.httpClient.get<ApiResponse<UsernameAvailabilityResponse>>(
      API_CONFIG.ENDPOINTS.PUBLIC.CHECK_AVAILABILITY(username)
    );
  }
}
