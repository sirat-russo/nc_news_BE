const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
require("jest-sorted");


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
describe("GET /api/articles", () => {
  test("200: responds with { articles: [...] } where each article has correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("articles");
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBeGreaterThan(0);

        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  test("200: responds with articles sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("200: articles do not include a body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(article.body).toBeUndefined();
        });
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
});
