export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  ENDPOINTS: {
    AUTH: {
      REGISTER: "/api/auth/register",
      LOGIN: "/api/auth/login",
      LOGOUT: "/api/auth/logout",
      REFRESH: "/api/auth/refresh",
      PROFILE: "/api/auth/profile",
      VERIFY_EMAIL: "/api/auth/verify-email",
      RESEND_VERIFICATION: "/api/auth/resend-verification",
      FORGOT_PASSWORD: "/api/auth/forgot-password",
      RESET_PASSWORD: "/api/auth/reset-password",
      VALIDATE_TOKEN: "/api/auth/validate-token",
      CSRF_TOKEN: "/api/csrf-token",
    },
    LINKS: {
      BASE: "/api/links",
      UPDATE: (id: string) => `/api/links/${id}`,
      VISIBILITY: (id: string) => `/api/links/visibility/${id}`,
      REORDER: "/api/links/update/reorder",
    },
    PROFILE: {
      ME: "/api/profile/me",
      AVATAR: "/api/profile/avatar",
    },
    PUBLIC: {
      PROFILE: (username: string) => `/api/public/${username}`,
      CHECK_AVAILABILITY: (username: string) =>
        `/api/public/check-availability/${username}`,
    },
  },
} as const;
