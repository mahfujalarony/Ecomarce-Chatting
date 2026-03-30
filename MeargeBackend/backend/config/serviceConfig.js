const rootConfig = require("../../env");
const serviceEnv = rootConfig.backend || {};
const unifiedConfig = rootConfig.unified || {};
const webConfig = rootConfig.web || {};

const backendConfig = {
  unifiedPort: Number(unifiedConfig.port || 3000),
  unifiedBaseUrl: unifiedConfig.baseUrl || "http://localhost:3000",
  frontendOrigins: Array.isArray(webConfig.frontendOrigins) ? webConfig.frontendOrigins : [],
  allowLocalAndLanOrigins: Boolean(webConfig.allowLocalAndLanOrigins),
  dbName: serviceEnv.database?.name || "shop",
  dbUser: serviceEnv.database?.user || "root",
  dbPassword: serviceEnv.database?.password || "",
  dbHost: serviceEnv.database?.host || "localhost",
  dbDialect: serviceEnv.database?.dialect || "mysql",
  jwtSecret: serviceEnv.jwtSecret || "secretkey",
  jwtExpiresIn: serviceEnv.jwtExpiresIn || "30d",
  adminHistoryRetentionDays: Math.max(1, Number(serviceEnv.adminHistoryRetentionDays || 15)),
  googleClientId: serviceEnv.googleClientId || "",
  homeSectionsCacheTtlSeconds: Math.max(1, Number(serviceEnv.homeSectionsCacheTtlSeconds || 120)),
  homeTrendingStatsLimit: Math.max(100, Number(serviceEnv.homeTrendingStatsLimit || 1500)),
};

module.exports = backendConfig;
