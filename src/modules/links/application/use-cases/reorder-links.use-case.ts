import type { LinksRepository } from "../../domain/repositories/links.repository";
import type { Link } from "@/core/domain/models/link";

export class ReorderLinksUseCase {
  constructor(private repository: LinksRepository) {}
  async execute(links: Link[]): Promise<Link[]> {
    return await this.repository.reorderLinks(links);
  }
}
