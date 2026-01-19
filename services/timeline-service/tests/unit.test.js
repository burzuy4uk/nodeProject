const request = require("supertest");
const { createApp } = require("../src/app");

describe("timeline-service unit", () => {
  test("requires auth", async () => {
    const app = await createApp({ dataFile: ":memory:", ticketsBaseUrl: "http://localhost:9" });
    const res = await request(app).get("/tickets/1/timeline");
    expect(res.status).toBe(401);
  });

  test("USER cannot change status", async () => {
    const app = await createApp({ dataFile: ":memory:", ticketsBaseUrl: "http://localhost:9" });
    const res = await request(app)
      .patch("/tickets/1/status")
      .set({ "x-user-id": "u1", "x-role": "USER" })
      .send({ status: "IN_PROGRESS" });
    expect(res.status).toBe(403);
  });
});
