import type { LinksRepository } from "../../domain/repositories/links.repository";

export class DeleteLinkUseCase {
  constructor(private repository: LinksRepository) {}
  async execute(id: string): Promise<void> {
    return await this.repository.deleteLink(id);
  }
}
