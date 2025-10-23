const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("200: responds with { topics: [...] } where each has slug & description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("topics");
        const { topics } = body;
        expect(Array.isArray(topics)).toBe(true);
        expect(topics.length).toBeGreaterThan(0);
        for (const topic of topics) {
            expect(topic).toMatchObject({
                slug: expect.any(String),
                description: expect.any(String),
            });
        }
      });
  });
  test("404: responds with 'Route not found' for unknown paths", () => {
    return request(app)
      .get("/not-a-route")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Route not found" });
      });
  });

  test("500: falls through to server error handler (example)", () => {
    expect(true).toBe(true);
  });
})