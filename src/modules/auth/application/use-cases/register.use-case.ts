import type { AuthRepository } from "../../domain/repositories/auth.repository";
import type { RegisterData, AuthUser } from "../../domain/models/user";
import { Email } from "../../domain/models/email";
import { Password } from "../../domain/models/password";

export class RegisterUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(data: RegisterData): Promise<AuthUser> {
    // Validate data using value objects
    const email = new Email(data.email);
    const password = new Password(data.password);

    // Validate username
    if (!data.username || data.username.trim().length < 3) {
      throw new Error("Username must be at least 3 characters long");
    }

    // Validate names
    if (!data.firstName || data.firstName.trim().length === 0) {
      throw new Error("First name is required");
    }

    if (!data.lastName || data.lastName.trim().length === 0) {
      throw new Error("Last name is required");
    }

    // Execute registration through repository
    return await this.authRepository.register({
      email: email.getValue(),
      password: password.getValue(),
      username: data.username.trim(),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
    });
  }
}
