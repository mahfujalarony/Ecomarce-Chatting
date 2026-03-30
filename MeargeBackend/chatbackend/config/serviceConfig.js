const rootConfig = require("../../env");
const serviceEnv = rootConfig.chatbackend || {};
const unifiedConfig = rootConfig.unified || {};
const webConfig = rootConfig.web || {};

const chatbackendConfig = {
  nodeEnv: rootConfig.app?.nodeEnv || "production",
  unifiedPort: Number(unifiedConfig.port || 3000),
  unifiedBaseUrl: unifiedConfig.baseUrl || "http://localhost:3000",
  dbName: serviceEnv.database?.name || "chat2",
  dbUser: serviceEnv.database?.user || "root",
  dbPassword: serviceEnv.database?.password || "",
  dbHost: serviceEnv.database?.host || "127.0.0.1",
  dbPort: Number(serviceEnv.database?.port || 3306),
  dbSyncMode: String(serviceEnv.database?.syncMode || "safe").toLowerCase(),
  corsOrigin: Array.isArray(webConfig.frontendOrigins)
    ? webConfig.frontendOrigins.join(",")
    : String(webConfig.frontendOrigins || "*"),
  allowLocalAndLanOrigins: Boolean(webConfig.allowLocalAndLanOrigins),
  appPublicUrl: unifiedConfig.baseUrl || "http://localhost:3000",
  refreshCookieName: serviceEnv.refreshCookieName || "chat_refresh_token",
  authCookieSecure: String(serviceEnv.authCookieSecure || ""),
  authCookieSameSite: String(serviceEnv.authCookieSameSite || ""),
  loginRateLimitThreshold: Math.max(1, Number(serviceEnv.loginRateLimitThreshold || 10)),
  loginRateLimitCooldownMs: Math.max(1000, Number(serviceEnv.loginRateLimitCooldownMs || 15 * 60 * 1000)),
  loginRateLimitMaxKeys: Math.max(1000, Number(serviceEnv.loginRateLimitMaxKeys || 50000)),
  vapidPublicKey: serviceEnv.vapidPublicKey || "",
  vapidPrivateKey: serviceEnv.vapidPrivateKey || "",
  vapidSubject: serviceEnv.vapidSubject || "mailto:admin@example.com",
  allowRoleBypassForTest: Boolean(serviceEnv.allowRoleBypassForTest),
  uploadServerUrl: unifiedConfig.baseUrl || "http://localhost:3000",
  accessTokenExpiresIn: serviceEnv.accessTokenExpiresIn || "15m",
  refreshTokenExpiresIn: serviceEnv.refreshTokenExpiresIn || "30d",
  accessTokenSecret: serviceEnv.jwtSecret || "dev_secret_change_me",
  refreshTokenSecret: serviceEnv.jwtRefreshSecret || serviceEnv.jwtSecret || "dev_secret_change_me",
};

module.exports = chatbackendConfig;
