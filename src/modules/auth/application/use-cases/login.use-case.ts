import type { AuthRepository } from "../../domain/repositories/auth.repository";
import type { LoginCredentials, AuthUser } from "../../domain/models/user";
import { Email } from "../../domain/models/email";
import { Password } from "../../domain/models/password";

export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthUser> {
    // Validate credentials using value objects
    const email = new Email(credentials.email);
    const password = new Password(credentials.password);

    // Execute login through repository
    return await this.authRepository.login({
      email: email.getValue(),
      password: password.getValue(),
    });
  }
}
