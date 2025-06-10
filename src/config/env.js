import { SUPPORT_EMAIL, GITHUB_URL } from "@env";

// Default values are used in development, override these using .env file
export const config = {
  supportEmail: SUPPORT_EMAIL || "support@laporparkir.com",
  githubUrl: GITHUB_URL || "https://github.com/laporparkir",
};
