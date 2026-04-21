import React, { useState, useCallback, type ReactNode } from "react";
import type { Link } from "@/core/domain/models/link";
import { GetLinksUseCase } from "../../application/use-cases/get-links.use-case";
import { CreateLinkUseCase } from "../../application/use-cases/create-link.use-case";
import { UpdateLinkUseCase } from "../../application/use-cases/update-link.use-case";
import { ReorderLinksUseCase } from "../../application/use-cases/reorder-links.use-case";
import { ChangeVisibilityUseCase } from "../../application/use-cases/change-visibility.use-case";
import { HttpLinksRepository } from "../../infrastructure/repositories/http-links.repository";
import { LinksApiService } from "../../infrastructure/services/links-api.service";
import { AxiosHttpClient } from "@/core/infrastructure/adapters/axios-http-client";
import { API_CONFIG } from "@/config/api-config";
import type {
  CreateLinkData,
  UpdateLinkData,
} from "../../domain/repositories/links.repository";
import { LinksContext, type LinksContextType } from "./links-context";
import { DeleteLinkUseCase } from "../../application/use-cases/delete-link.use-case";

// Initialize dependencies
const httpClient = new AxiosHttpClient(API_CONFIG.BASE_URL);
const linksApiService = new LinksApiService(httpClient);
const linksRepository = new HttpLinksRepository(linksApiService);

// Initialize use cases
const getLinksUseCase = new GetLinksUseCase(linksRepository);
const createLinkUseCase = new CreateLinkUseCase(linksRepository);
const updateLinkUseCase = new UpdateLinkUseCase(linksRepository);
const reorderLinksUseCase = new ReorderLinksUseCase(linksRepository);
const changeVisibilityUseCase = new ChangeVisibilityUseCase(linksRepository);
const deleteLinkUseCase = new DeleteLinkUseCase(linksRepository);

export const LinksProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLinks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedLinks = await getLinksUseCase.execute();
      setLinks(fetchedLinks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch links");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createLink = async (data: CreateLinkData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newLink = await createLinkUseCase.execute(data);
      setLinks((prev) => [...prev, newLink]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create link");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateLink = async (id: string, data: UpdateLinkData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedLink = await updateLinkUseCase.execute(id, data);
      setLinks((prev) =>
        prev.map((link) => (link.id === id ? updatedLink : link)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update link");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLink = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteLinkUseCase.execute(id);
      setLinks((prev) => prev.filter((link) => link.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete link");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reorderLinks = async (newLinks: Link[]) => {
    const originalLinks = [...links];
    setLinks(newLinks); // Optimistic update
    try {
      await reorderLinksUseCase.execute(newLinks);
    } catch (err) {
      setLinks(originalLinks); // Rollback
      setError(err instanceof Error ? err.message : "Failed to reorder links");
      throw err;
    }
  };

  const changeVisibility = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await changeVisibilityUseCase.execute(id);
      setLinks((prev) =>
        prev.map((link) =>
          link.id === id ? { ...link, is_active: !link.is_active } : link,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to change visibility",
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: LinksContextType = {
    links,
    isLoading,
    error,
    getLinks,
    createLink,
    updateLink,
    deleteLink,
    reorderLinks,
    changeVisibility,
  };

  return (
    <LinksContext.Provider value={value}>{children}</LinksContext.Provider>
  );
};
