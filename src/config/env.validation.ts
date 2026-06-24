const REQUIRED_ENV_KEYS = [
  "DB_HOST",
  "DB_USERNAME",
  "DB_PASSWORD",
  "DB_DATABASE",
  "DB_AUTO_HOST",
  "DB_AUTO_USERNAME",
  "DB_AUTO_PASSWORD",
  "DB_AUTO_DATABASE",
  "LDAP_HOST",
  "LDAP_BASE_DN",
  "JWT_SECRET",
] as const;

export function validateEnvironment(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const missing = REQUIRED_ENV_KEYS.filter((key) => !config[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }

  return config;
}
