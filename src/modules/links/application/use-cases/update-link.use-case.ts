import type { LinksRepository, UpdateLinkData } from "../../domain/repositories/links.repository";
import type { Link } from "@/core/domain/models/link";

export class UpdateLinkUseCase {
  constructor(private repository: LinksRepository) {}
  async execute(id: string, data: UpdateLinkData): Promise<Link> {
    return await this.repository.updateLink(id, data);
  }
}
