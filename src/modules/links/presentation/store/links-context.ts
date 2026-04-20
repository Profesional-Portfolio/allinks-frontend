import { createContext } from "react";
import type { Link } from "@/core/domain/models/link";
import type { CreateLinkData, UpdateLinkData } from "../../domain/repositories/links.repository";

export interface LinksContextType {
  links: Link[];
  isLoading: boolean;
  error: string | null;
  getLinks: () => Promise<void>;
  createLink: (data: CreateLinkData) => Promise<void>;
  updateLink: (id: string, data: UpdateLinkData) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  reorderLinks: (links: Link[]) => Promise<void>;
  changeVisibility: (id: string) => Promise<void>;
}

export const LinksContext = createContext<LinksContextType | undefined>(undefined);
