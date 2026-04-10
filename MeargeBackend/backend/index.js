const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const config = require("./config/serviceConfig");
require("./models");
const { getSettings } = require("./controllers/settingController");

function createBackendApp() {
  const app = express();
  const allowList = Array.isArray(config.frontendOrigins) ? config.frontendOrigins : [];

  app.use(express.json());

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const isLocalOrLan =
          config.allowLocalAndLanOrigins &&
          (
            /^http:\/\/localhost(?::\d+)?$/.test(origin) ||
            /^http:\/\/127\.0\.0\.1(?::\d+)?$/.test(origin) ||
            /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(?::\d+)?$/.test(origin)
          );

        if (allowList.includes(origin) || isLocalOrLan) {
          return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    })
  );

  app.get("/", (_, res) => res.send("Server is running and Database connected!"));

  app.use("/api/products", require("./routes/ProductRoute"));
  app.use("/api/auth", require("./routes/AuthenticationRoute"));
  app.use("/api/reviews", require("./routes/reviewRoutes"));
  app.use("/api/orders", require("./routes/OrderRoute"));
  app.use("/api/merchant", require("./routes/MerchantRoute"));
  app.use("/api/track", require("./routes/productTracking"));
  app.use("/api/categories", require("./routes/categoryRoutes"));
  app.use("/api/subcategories", require("./routes/subCategoryRoutes"));
  app.use("/api/stories", require("./routes/storyRoutes"));
  app.use("/api/giftcards", require("./routes/GiftCardRoute"));
  app.use("/api/notifications", require("./routes/NotificationRoute"));
  app.get("/api/settings", getSettings);
  app.use("/api/admin", require("./routes/AdminOrderRoute"));
  app.use("/api/admin", require("./routes/AdminRoute"));
  app.use("/api/admin", require("./routes/AdminUserManageMent"));
  app.use("/api/offers", require("./routes/OfferRoutes"));

  return app;
}

async function syncBackendDatabase() {
  await sequelize.authenticate();

  const mode = String(config.dbSyncMode || "auto").toLowerCase();
  if (mode === "skip" || mode === "none") {
    return;
  }
  if (mode === "force") {
    await sequelize.sync({ force: true });
    return;
  }
  if (mode === "alter") {
    await sequelize.sync({ alter: true });
    return;
  }
  if (mode === "create" || mode === "safe") {
    await sequelize.sync({ force: false });
    return;
  }

  const queryInterface = sequelize.getQueryInterface();
  const tables = await queryInterface.showAllTables();
  const tableCount = Array.isArray(tables) ? tables.length : 0;
  if (tableCount === 0) {
    await sequelize.sync({ force: false });
  }
}

async function startStandaloneServer() {
  try {
    await syncBackendDatabase();
    const app = createBackendApp();
    app.listen(config.port, () => {
      console.log(`Backend server running: http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startStandaloneServer();
}

module.exports = {
  createBackendApp,
  syncBackendDatabase,
  startStandaloneServer,
};
