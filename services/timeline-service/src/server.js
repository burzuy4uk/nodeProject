const { createApp } = require("./app");

(async () => {
  const app = await createApp();
  const { port, ticketsBaseUrl } = app.locals.cfg;

  const server = app.listen(port, () => {
    console.log(`[timeline-service] listening on http://localhost:${port}`);
    console.log(`[timeline-service] ticketsBaseUrl=${ticketsBaseUrl}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`[timeline-service] Port ${port} is already in use. Try: PORT=${port+100} npm run dev --workspace services/timeline-service`);
      process.exit(1);
    }
    console.error("[timeline-service] Server error:", err);
    process.exit(1);
  });
})();
