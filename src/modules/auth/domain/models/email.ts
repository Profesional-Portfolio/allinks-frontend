export class Email {
  private readonly value: string;

  constructor(email: string) {
    this.validate(email);
    this.value = email.toLowerCase().trim();
  }

  private validate(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || email.trim().length === 0) {
      throw new Error("Email is required");
    }

    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }
}
