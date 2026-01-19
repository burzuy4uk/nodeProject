const express = require("express");
const { routes } = require("./routes");
const { requestId, auth, notFound, errorHandler } = require("./middleware");
const { createDb } = require("./db");
const { loadConfig } = require("./config");

async function createApp(overrides = {}) {
  const cfg = loadConfig(overrides);
  const db = await createDb(cfg.dataFile);

  const app = express();
  app.use(requestId);
  app.use(auth);
  app.use(routes(db, cfg));
  app.use(notFound);
  app.use(errorHandler);

  app.locals.cfg = cfg;
  return app;
}

module.exports = { createApp };
