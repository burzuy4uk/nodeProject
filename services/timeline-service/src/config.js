const path = require("path");

function loadConfig(overrides = {}) {
  return {
    port: Number(process.env.PORT || overrides.port || 3002),
    dataFile: process.env.DATA_FILE || overrides.dataFile || path.join(process.cwd(), "data", "timeline.json"),
    ticketsBaseUrl: process.env.TICKETS_BASE_URL || overrides.ticketsBaseUrl || "http://localhost:3001"
  };
}

module.exports = { loadConfig };
