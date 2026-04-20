import type {
  LinksRepository,
  CreateLinkData,
  UpdateLinkData,
} from "../../domain/repositories/links.repository";
import type { Link } from "@/core/domain/models/link";
import type { LinksApiService } from "../services/links-api.service";

export class HttpLinksRepository implements LinksRepository {
  constructor(private apiService: LinksApiService) {}

  async getLinks(): Promise<Link[]> {
    const response = await this.apiService.getLinks();
    return response.data ?? [];
  }

  async createLink(data: CreateLinkData): Promise<Link> {
    const response = await this.apiService.createLink(data);
    if (!response.data) throw new Error("Failed to create link");
    return response.data;
  }

  async updateLink(id: string, data: UpdateLinkData): Promise<Link> {
    const response = await this.apiService.updateLink(id, data);
    if (!response.data) throw new Error("Failed to update link");
    return response.data;
  }

  async deleteLink(id: string): Promise<void> {
    const response = await this.apiService.deleteLink(id);
    if (!response.data) throw new Error("Failed to delete link");
    return response.data;
  }

  async reorderLinks(links: Link[]): Promise<Link[]> {
    const response = await this.apiService.reorderLinks(links);
    return response.data ?? links;
  }

  async changeVisibility(id: string): Promise<Link> {
    const response = await this.apiService.changeVisibility(id);
    if (!response.data) throw new Error("Failed to change visibility");
    return response.data;
  }
}
