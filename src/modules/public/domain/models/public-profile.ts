import type { User } from "@/core/domain/models/user";
import type { Link } from "@/core/domain/models/link";

export interface PublicProfile extends User {
  links: Link[];
}

export interface UsernameAvailabilityResponse {
  available: boolean;
  message: string;
}
