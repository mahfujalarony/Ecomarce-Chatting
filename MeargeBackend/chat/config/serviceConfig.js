const rootConfig = require("../../env");
const serviceEnv = rootConfig.supportChat || {};
const unifiedConfig = rootConfig.unified || {};
const webConfig = rootConfig.web || {};

const chatConfig = {
  unifiedPort: Number(unifiedConfig.port || 3000),
  unifiedBaseUrl: unifiedConfig.baseUrl || "http://localhost:3000",
  dbName: serviceEnv.database?.name || "testchat",
  dbUser: serviceEnv.database?.user || "root",
  dbPassword: serviceEnv.database?.password || "",
  dbHost: serviceEnv.database?.host || "localhost",
  dbDialect: serviceEnv.database?.dialect || "mysql",
  dbSyncMode: String(serviceEnv.database?.syncMode || "auto").toLowerCase(),
  jwtSecret: serviceEnv.jwtSecret || "secretkey",
  frontendOrigins: Array.isArray(webConfig.frontendOrigins)
    ? webConfig.frontendOrigins.join(",")
    : String(webConfig.frontendOrigins || ""),
  mainApiBase: unifiedConfig.baseUrl || "http://localhost:3000",
  supportAutoReplySenderId: Number(serviceEnv.supportAutoReplySenderId || 999999999999),
};

module.exports = chatConfig;
