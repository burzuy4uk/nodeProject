const crypto = require("crypto");

function requestId(req, res, next) {
  const id = req.header("x-request-id") || crypto.randomUUID();
  req.requestId = id;
  res.setHeader("x-request-id", id);
  next();
}

function auth(req, res, next) {
  const userId = req.header("x-user-id");
  const role = req.header("x-role") || "USER";
  if (!userId) return res.status(401).json({ error: "Missing x-user-id", requestId: req.requestId });
  req.user = { id: userId, role };
  next();
}

function notFound(req, res) {
  res.status(404).json({ error: "Not found", requestId: req.requestId });
}

function errorHandler(err, req, res, next) {
  console.error(`[timeline-service] requestId=${req.requestId}`, err);
  res.status(500).json({ error: "Internal error", requestId: req.requestId });
}

module.exports = { requestId, auth, notFound, errorHandler };
