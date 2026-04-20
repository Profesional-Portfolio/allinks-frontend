import type { LinksRepository } from "../../domain/repositories/links.repository";
import type { Link } from "@/core/domain/models/link";

export class GetLinksUseCase {
  constructor(private repository: LinksRepository) {}
  async execute(): Promise<Link[]> {
    return await this.repository.getLinks();
  }
}
