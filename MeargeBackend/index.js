const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const rootConfig = require("./env");
const { createBackendApp, syncBackendDatabase } = require("./backend");
const { createSupportChatApp, syncSupportChatDatabase } = require("./chat");
const { handleUploadRequest } = require("./NewUploadServer/app");

const unifiedPort = Number(rootConfig.unified?.port || 3000);
const unifiedBaseUrl =
  rootConfig.unified?.baseUrl || `http://localhost:${unifiedPort}`;
const frontendOrigins = Array.isArray(rootConfig.web?.frontendOrigins)
  ? rootConfig.web.frontendOrigins
  : true;

function formatErrorMessage(error) {
  if (!error) return "Unknown error";
  if (error.name === "SequelizeConnectionRefusedError") {
    return "Database connection refused. Start MySQL and check DB host/port.";
  }
  if (error.name === "SequelizeAccessDeniedError") {
    return "Database access denied. Check DB username/password.";
  }
  if (error.name === "SequelizeHostNotFoundError") {
    return "Database host not found. Check DB host in env.js.";
  }
  if (error.name === "SequelizeConnectionError") {
    return `Database connection failed: ${error.message}`;
  }
  return error.message || String(error);
}

function buildServiceHelp(service) {
  if (service.ok) {
    return ["Startup checks passed."];
  }

  if (service.key === "upload") {
    return ["Check filesystem permissions and upload paths if uploads fail."];
  }

  return [
    "Make sure MySQL is running.",
    "Check database config in env.js.",
    "Verify database name, user, password, host, and port.",
  ];
}

function createInitialServiceStatus() {
  return {
    backend: {
      key: "backend",
      label: "Ecommerce Backend",
      kind: "REST API",
      route: "/api/*",
      dependency: "MySQL: backend.database",
      ok: false,
      message: "Startup check pending.",
      help: [],
    },
    supportChat: {
      key: "supportChat",
      label: "Support Chat",
      kind: "REST API + Socket.IO",
      route: "/api/chat/* and /socket.io/support-chat",
      dependency: "MySQL: supportChat.database",
      ok: false,
      message: "Startup check pending.",
      help: [],
    },
    chatbackend: {
      key: "chatbackend",
      label: "Chatbackend",
      kind: "REST API + Socket.IO",
      route: "/chatbackend/api/* and /socket.io/chatbackend",
      dependency: "MySQL: chatbackend.database",
      ok: false,
      message: "Startup check pending.",
      help: [],
    },
    upload: {
      key: "upload",
      label: "Upload Server",
      kind: "HTTP file handling",
      route: "/public/*, /upload/*, /create-folder",
      dependency: "Filesystem only",
      ok: true,
      message: "Upload routes mounted.",
      help: ["No database dependency."],
    },
  };
}

function renderDashboardHtml(services) {
  const cards = Object.values(services)
    .map((service) => {
      const badgeText = service.ok ? "READY" : "ISSUE";
      const badgeBg = service.ok ? "#dcfce7" : "#fee2e2";
      const badgeColor = service.ok ? "#166534" : "#991b1b";
      const helpItems = service.help.map((item) => `<li>${item}</li>`).join("");

      return `
        <section style="background:#fff;border:1px solid #e4e4e7;border-radius:18px;padding:18px;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
            <h2 style="margin:0;font-size:20px;">${service.label}</h2>
            <span style="padding:6px 10px;border-radius:999px;background:${badgeBg};color:${badgeColor};font-size:12px;font-weight:700;">${badgeText}</span>
          </div>
          <p style="margin:12px 0 4px;"><strong>Type:</strong> ${service.kind}</p>
          <p style="margin:4px 0;"><strong>Route:</strong> <code>${service.route}</code></p>
          <p style="margin:4px 0;"><strong>Dependency:</strong> ${service.dependency}</p>
          <p style="margin:10px 0 0;"><strong>Status:</strong> ${service.message}</p>
          <ul style="margin:12px 0 0 18px;">${helpItems}</ul>
        </section>
      `;
    })
    .join("");

  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Marge Runtime Status</title>
    </head>
    <body style="margin:0;background:#f4f4f5;color:#18181b;font-family:Segoe UI,Arial,sans-serif;">
      <main style="max-width:1100px;margin:0 auto;padding:32px 20px 48px;">
        <section style="background:#18181b;color:#fff;border-radius:22px;padding:24px;">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#a1a1aa;">Unified Server</p>
          <h1 style="margin:0 0 8px;font-size:32px;">Runtime Status</h1>
          <p style="margin:0;color:#d4d4d8;">Base URL: <code>${unifiedBaseUrl}</code></p>
          <p style="margin:12px 0 0;color:#d4d4d8;">This page stays available even if one or more databases are down, so you can immediately see what is missing.</p>
        </section>
        <section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;margin-top:22px;">
          ${cards}
        </section>
      </main>
    </body>
  </html>`;
}

async function startUnifiedServer() {
  const app = express();
  const server = http.createServer(app);
  const serviceStatus = createInitialServiceStatus();

  const supportChatSocketServer = new Server(server, {
    cors: {
      origin: frontendOrigins,
      credentials: true,
    },
    path: "/socket.io/support-chat",
  });
  const chatbackendSocketServer = new Server(server, {
    cors: {
      origin: frontendOrigins,
      credentials: true,
    },
    path: "/socket.io/chatbackend",
  });

  global.__MARGE_SHARED_SERVER = server;
  global.__MARGE_CHATBACKEND_IO = chatbackendSocketServer;

  const { app: chatbackendApp, start: startChatbackend } = require("./chatbackend/app");

  async function initializeService(key, initFn) {
    try {
      await initFn();
      serviceStatus[key].ok = true;
      serviceStatus[key].message = "Startup checks passed.";
    } catch (error) {
      serviceStatus[key].ok = false;
      serviceStatus[key].message = formatErrorMessage(error);
    }
    serviceStatus[key].help = buildServiceHelp(serviceStatus[key]);
  }

  app.locals.serviceStatus = serviceStatus;

  app.use((req, res, next) => handleUploadRequest(req, res, next));

  app.get("/", (req, res) => {
    res.status(200).send(renderDashboardHtml(serviceStatus));
  });

  app.get("/health", (req, res) => {
    const criticalServices = [
      serviceStatus.backend,
      serviceStatus.supportChat,
      serviceStatus.chatbackend,
    ];
    const ok = criticalServices.every((service) => service.ok);

    res.json({
      ok,
      service: "marge-unified",
      baseUrl: unifiedBaseUrl,
      services: Object.values(serviceStatus),
    });
  });

  app.use(createBackendApp());
  app.use(createSupportChatApp({ ioNamespace: supportChatSocketServer }));
  app.use("/chatbackend", chatbackendApp);

  await initializeService("backend", syncBackendDatabase);
  await initializeService("supportChat", syncSupportChatDatabase);
  await initializeService("chatbackend", startChatbackend);

  server.listen(unifiedPort, () => {
    console.log(`Server running on port ${unifiedPort}`);
    console.log(`Unified server running on ${unifiedBaseUrl}`);
    console.log(`Support chat socket path: /socket.io/support-chat`);
    console.log(`Chatbackend routes prefix: /chatbackend`);
    console.log(`Chatbackend socket path: /socket.io/chatbackend`);
    Object.values(serviceStatus).forEach((service) => {
      console.log(`[${service.ok ? "READY" : "ISSUE"}] ${service.label}: ${service.message}`);
    });
  });
}

startUnifiedServer().catch((error) => {
  console.error("Failed to start unified server:", error?.stack || error?.message || error);
  process.exit(1);
});
