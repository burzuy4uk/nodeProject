const express = require("express");
const { getTicket, setTicketStatusInternal } = require("./ticketsClient");

const ALLOWED_STATUS = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

function routes(db, cfg) {
  const router = express.Router();
  router.use(express.json());

  router.get("/health", (req, res) => res.json({ ok: true, service: "timeline" }));

  router.post("/tickets/:id/comments", async (req, res) => {
    const { text } = req.body || {};
    if (!text) return res.status(400).json({ error: "text is required", requestId: req.requestId });

    const ticketId = String(req.params.id);

    const ticket = await getTicket(cfg.ticketsBaseUrl, ticketId, {
      userId: req.user.id,
      role: req.user.role,
      requestId: req.requestId
    });
    if (!ticket) return res.status(404).json({ error: "Ticket not found", requestId: req.requestId });

    const ev = {
      id: `${ticketId}:${Date.now()}`,
      ticketId,
      type: "COMMENT",
      text,
      actorId: req.user.id,
      at: new Date().toISOString()
    };

    db.data.events.push(ev);
    await db.write();

    res.status(201).json(ev);
  });

  router.patch("/tickets/:id/status", async (req, res) => {
    const { status } = req.body || {};
    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({ error: `status must be one of ${ALLOWED_STATUS.join(", ")}`, requestId: req.requestId });
    }
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Only ADMIN can change status", requestId: req.requestId });
    }

    const ticketId = String(req.params.id);

    const ticket = await getTicket(cfg.ticketsBaseUrl, ticketId, {
      userId: req.user.id,
      role: req.user.role,
      requestId: req.requestId
    });
    if (!ticket) return res.status(404).json({ error: "Ticket not found", requestId: req.requestId });

    const ev = {
      id: `${ticketId}:${Date.now()}`,
      ticketId,
      type: "STATUS_CHANGED",
      status,
      actorId: req.user.id,
      at: new Date().toISOString()
    };

    db.data.events.push(ev);
    await db.write();

    const upd = await setTicketStatusInternal(cfg.ticketsBaseUrl, ticketId, status, {
      userId: req.user.id,
      requestId: req.requestId
    });
    if (!upd) return res.status(404).json({ error: "Ticket not found", requestId: req.requestId });

    res.status(200).json({ ok: true, event: ev, ticketStatus: upd.status });
  });

  router.get("/tickets/:id/timeline", (req, res) => {
    const ticketId = String(req.params.id);
    const list = db.data.events.filter(e => e.ticketId === ticketId).sort((a, b) => a.at.localeCompare(b.at));
    res.json(list);
  });

  return router;
}

module.exports = { routes };
