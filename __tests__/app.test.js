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

describe("GET /api/users", () => {
  test("200: responds with { users: [...] } where each has username, name & avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("users");
        const { users } = body;

        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThan(0);

        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
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

describe("GET /api/articles/:article_id", () => {
  test("200: responds with the correct article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 1,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });

  test("400: responds with 'Bad request' for invalid article_id type", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: responds with 'Article not found' for non-existent id", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBeGreaterThan(0);

        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
      });
  });

  test("200: comments are sorted by most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("200: responds with an empty array when article exists but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });

  test("404: responds with 'Article not found' when article_id is valid but does not exist", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("400: responds with 'Bad request' when article_id is invalid", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});


describe("POST /api/articles/:article_id/comments", () => {
  test("201: inserts a new comment and returns the created comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is an insightful article!",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "This is an insightful article!",
          article_id: 1,
          author: "butter_bridge",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });

  test("400: responds with 'Bad request' when article_id is invalid", () => {
    const newComment = { username: "butter_bridge", body: "Nice post!" };
    return request(app)
      .post("/api/articles/not-an-id/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: responds with 'Missing required fields' when username or body is missing", () => {
    const incompleteComment = { body: "No username provided" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(incompleteComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields");
      });
  });

  test("404: responds with 'User or Article not found' when username does not exist", () => {
    const invalidUserComment = {
      username: "unknown_user",
      body: "This user doesn't exist",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(invalidUserComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User or Article not found");
      });
  });

  test("404: responds with 'Article not found' when article_id does not exist", () => {
    const validComment = {
      username: "butter_bridge",
      body: "Great read!",
    };
    return request(app)
      .post("/api/articles/9999/comments")
      .send(validComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: increments votes and returns the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 1,
          votes: expect.any(Number),
          author: expect.any(String),
          title: expect.any(String),
          topic: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          article_img_url: expect.any(String),
        });
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -1 })
          .expect(200)
          .then(({ body: body2 }) => {
            expect(body2.article.votes).toBe(article.votes - 1);
          });
      });
  });

  test("200: decrements votes by a large negative value", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(1);
        expect(typeof body.article.votes).toBe("number");
      });
  });

  test("400: bad request when article_id is not a number", () => {
    return request(app)
      .patch("/api/articles/not-an-id")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: bad request when body is missing inc_votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: bad request when inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "five" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: article not found for valid but non-existent id", () => {
    return request(app)
      .patch("/api/articles/99999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: deletes the comment and responds with no content", () => {

    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });

  test("400: Bad request when comment_id is invalid", () => {
    return request(app)
      .delete("/api/comments/not-an-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: Comment not found when comment_id is valid but does not exist", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
});

describe("GET /api/articles (sorting queries)", () => {
  test("200: sorts by a valid column (votes) ascending when given sort_by=votes&order=asc", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("votes", { ascending: true });
      });
  });

  test("200: sorts by author descending when given sort_by=author (default order=desc)", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("author", { descending: true });
      });
  });

  test("200: responds with articles sorted by title in descending order", () => {
  return request(app)
    .get("/api/articles?sort_by=title&order=desc")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      expect(articles).toBeSortedBy("title", { descending: true });
    });
  });

  test("200: responds with articles sorted by votes in ascending order", () => {
  return request(app)
    .get("/api/articles?sort_by=votes&order=asc")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      expect(articles).toBeSortedBy("votes", { descending: false });
    });
  });

  test("200: responds with articles sorted by comment_count in descending order", () => {
  return request(app)
    .get("/api/articles?sort_by=comment_count&order=desc")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      expect(articles).toBeSortedBy("comment_count", { descending: true });
    });

  });

  test("400: responds with 'Invalid sort_by' when column is not allowed", () => {
    return request(app)
      .get("/api/articles?sort_by=not_a_column")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort_by");
      });
  });

  test("400: responds with 'Invalid order' when order is not 'asc' or 'desc'", () => {
    return request(app)
      .get("/api/articles?order=sideways")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order");
      });
  });



  // topic filtering tests

test("200: filters articles by a valid topic (e.g. 'mitch')", () => {
  return request(app)
    .get("/api/articles?topic=mitch")
    .expect(200)
    .then(({ body }) => {
      expect(body).toHaveProperty("articles");
      const { articles } = body;

      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBeGreaterThan(0);

      for (const article of articles) {
        expect(article.topic).toBe("mitch");
        expect(article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          })
        );
      }
      expect(articles).toBeSortedBy("created_at", { descending: true });
    });
});

test("200: valid topic with no associated articles returns an empty array", () => {
  return request(app)
    .get("/api/articles?topic=paper")
    .expect(200)
    .then(({ body }) => {
      expect(body).toHaveProperty("articles");
      expect(body.articles).toEqual([]);
    });
});

test("404: responds with 'Topic not found' when topic does not exist", () => {
  return request(app)
    .get("/api/articles?topic=this-topic-does-not-exist")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Topic not found");
    });
});

test("200: topic filter works together with sort_by and order", () => {
  return request(app)
    .get("/api/articles?topic=mitch&sort_by=votes&order=asc")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      expect(articles.length).toBeGreaterThan(0);
      for (const article of articles) {
        expect(article.topic).toBe("mitch");
      }
      expect(articles).toBeSortedBy("votes", { descending: false });
    });
});

test("400: invalid sort_by is still rejected even when topic is provided", () => {
  return request(app)
    .get("/api/articles?topic=mitch&sort_by=not-a-column")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid sort_by");
    });
});

test("400: invalid order is still rejected even when topic is provided", () => {
  return request(app)
    .get("/api/articles?topic=mitch&order=sideways")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid order");
    });
  });

});




