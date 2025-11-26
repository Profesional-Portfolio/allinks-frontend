export class Password {
  private readonly value: string;

  constructor(password: string) {
    this.validate(password);
    this.value = password;
  }

  private validate(password: string): void {
    if (!password || password.length === 0) {
      throw new Error("Password is required");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    if (!/[A-Z]/.test(password)) {
      throw new Error("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      throw new Error("Password must contain at least one lowercase letter");
    }

    if (!/[0-9]/.test(password)) {
      throw new Error("Password must contain at least one number");
    }
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }
}
