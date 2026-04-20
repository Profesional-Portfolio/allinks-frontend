import type { LinksRepository, CreateLinkData } from "../../domain/repositories/links.repository";
import type { Link } from "@/core/domain/models/link";

export class CreateLinkUseCase {
  constructor(private repository: LinksRepository) {}
  async execute(data: CreateLinkData): Promise<Link> {
    return await this.repository.createLink(data);
  }
}
