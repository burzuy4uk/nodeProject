const fs = require("fs");
const path = require("path");

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJsonSafe(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, "utf-8");
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(filePath, data) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

async function createDb(dataFile) {
  if (dataFile === ":memory:") {
    return {
      data: { events: [] },
      read: async () => {},
      write: async () => {}
    };
  }

  const initial = { events: [] };
  const data = readJsonSafe(dataFile, initial);
  writeJson(dataFile, data);

  return {
    data,
    read: async () => {
      const fresh = readJsonSafe(dataFile, initial);
      data.events = fresh.events || [];
    },
    write: async () => {
      writeJson(dataFile, data);
    }
  };
}

module.exports = { createDb };
