import type { LinksRepository } from "../../domain/repositories/links.repository";
import type { Link } from "@/core/domain/models/link";

export class ChangeVisibilityUseCase {
  constructor(private repository: LinksRepository) {}
  async execute(id: string): Promise<Link> {
    return await this.repository.changeVisibility(id);
  }
}
