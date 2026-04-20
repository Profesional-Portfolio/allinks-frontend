import type { Link } from "@/core/domain/models/link";
import { Platforms } from "@/core/domain/enums/platforms.enum";

export interface CreateLinkData {
  title: string;
  url: string;
  platform: Platforms;
  description?: string;
  visibility?: "public" | "private";
}

export interface UpdateLinkData {
  title?: string;
  url?: string;
  platform?: Platforms;
  is_active?: boolean;
}

export interface LinksRepository {
  getLinks(): Promise<Link[]>;
  createLink(data: CreateLinkData): Promise<Link>;
  updateLink(id: string, data: UpdateLinkData): Promise<Link>;
  deleteLink(id: string): Promise<void>;
  reorderLinks(links: Link[]): Promise<Link[]>;
  changeVisibility(id: string): Promise<Link>;
}
