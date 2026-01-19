async function getTicket(baseUrl, ticketId, ctx) {
  const res = await fetch(`${baseUrl}/tickets/${ticketId}`, {
    headers: {
      "x-user-id": ctx.userId,
      "x-role": ctx.role,
      "x-request-id": ctx.requestId
    }
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`TicketsService GET /tickets/${ticketId} failed: ${res.status}`);
  return res.json();
}

async function setTicketStatusInternal(baseUrl, ticketId, status, ctx) {
  const res = await fetch(`${baseUrl}/internal/tickets/${ticketId}/status`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "x-user-id": ctx.userId,
      "x-role": "SERVICE",
      "x-request-id": ctx.requestId
    },
    body: JSON.stringify({ status })
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`TicketsService PATCH internal status failed: ${res.status}`);
  return res.json();
}

module.exports = { getTicket, setTicketStatusInternal };
