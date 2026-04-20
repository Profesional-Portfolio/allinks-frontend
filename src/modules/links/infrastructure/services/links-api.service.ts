import type { HttpClient } from "@/core/domain/repositories/http-client";
import type { ApiResponse } from "@/core/domain/models/api-response";
import type { Link } from "@/core/domain/models/link";
import { API_CONFIG } from "@/config/api-config";
import type {
  CreateLinkData,
  UpdateLinkData,
} from "../../domain/repositories/links.repository";

export class LinksApiService {
  constructor(private httpClient: HttpClient) {}

  async getLinks(): Promise<ApiResponse<Link[]>> {
    return await this.httpClient.get<ApiResponse<Link[]>>(
      API_CONFIG.ENDPOINTS.LINKS.BASE,
    );
  }

  async createLink(data: CreateLinkData): Promise<ApiResponse<Link>> {
    return await this.httpClient.post<ApiResponse<Link>>(
      API_CONFIG.ENDPOINTS.LINKS.BASE,
      data,
    );
  }

  async updateLink(
    id: string,
    data: UpdateLinkData,
  ): Promise<ApiResponse<Link>> {
    return await this.httpClient.patch<ApiResponse<Link>>(
      API_CONFIG.ENDPOINTS.LINKS.UPDATE(id),
      data,
    );
  }

  async reorderLinks(links: Link[]): Promise<ApiResponse<Link[]>> {
    return await this.httpClient.patch<ApiResponse<Link[]>>(
      API_CONFIG.ENDPOINTS.LINKS.REORDER,
      { links },
    );
  }

  async changeVisibility(id: string): Promise<ApiResponse<Link>> {
    return await this.httpClient.patch<ApiResponse<Link>>(
      API_CONFIG.ENDPOINTS.LINKS.VISIBILITY(id),
    );
  }

  async deleteLink(id: string): Promise<ApiResponse<void>> {
    return await this.httpClient.delete<ApiResponse<void>>(
      API_CONFIG.ENDPOINTS.LINKS.DELETE(id),
    );
  }
}
