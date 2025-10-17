const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, createArticleRef, makeCommentsWithArticleId  } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS comments;`)
  .then(() =>{ return db.query(`DROP TABLE IF EXISTS articles;`)})
  .then(() => { return db.query(`DROP TABLE IF EXISTS users;`)})
  .then(() => { return db.query(`DROP TABLE IF EXISTS topics;`)})
  .then(() => {
      return db.query(`
        CREATE TABLE topics (
          slug VARCHAR PRIMARY KEY,
          description VARCHAR NOT NULL,
          img_url VARCHAR(1000) NOT NULL
        );`)
  })
  .then(() => {
      return db.query(`
        CREATE TABLE users (
          username VARCHAR PRIMARY KEY,
          name VARCHAR NOT NULL,
          avatar_url VARCHAR(1000) NOT NULL
        );
      `)
  })
  .then(() => {
      return db.query(`
        CREATE TABLE articles (
          article_id SERIAL PRIMARY KEY,
          title VARCHAR NOT NULL,
          topic VARCHAR NOT NULL REFERENCES topics(slug) ON DELETE CASCADE,
          author VARCHAR NOT NULL REFERENCES users(username) ON DELETE CASCADE,
          body TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          votes INT DEFAULT 0 NOT NULL,
          article_img_url VARCHAR(1000) NOT NULL
        );
      `)
  })
  .then(() => {
      return db.query(`
        CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
          body TEXT NOT NULL,
          votes INT DEFAULT 0 NOT NULL,
          author VARCHAR NOT NULL REFERENCES users(username) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
      `)
  })
  .then(() => {
      const rows = topicData.map(({ slug, description, img_url }) => [
        slug,
        description,
        img_url,
      ]);
      const insert = format(
        `INSERT INTO topics (slug, description, img_url) VALUES %L;`,
        rows
      );
      return db.query(insert);
    })

  .then(() => {
      const rows = userData.map(({ username, name, avatar_url }) => [
        username,
        name,
        avatar_url,
      ]);
      const insert = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L;`,
        rows
      );
      return db.query(insert);
    })

  .then(() => {
      const formatted = articleData.map(convertTimestampToDate);
      const rows = formatted.map(
        ({ title, topic, author, body, created_at, votes = 0, article_img_url }) => [
          title,
          topic,
          author,
          body,
          created_at,
          votes,
          article_img_url,
        ]
      );

      const insert = format(
        `
        INSERT INTO articles
          (title, topic, author, body, created_at, votes, article_img_url)
        VALUES %L
        RETURNING article_id, title;
        `,
        rows
      );

      return db.query(insert);
    })


  .then(({ rows: insertedArticles } = { rows: [] }) => {
      const articleRef = createArticleRef(insertedArticles);
      const formattedComments = makeCommentsWithArticleId(commentData, articleRef);

      if (!formattedComments.length) return;

      const rows = formattedComments.map(
        ({ article_id, body, votes = 0, author, created_at }) => [
          article_id,
          body,
          votes,
          author,
          created_at,
        ]
      );

      const insert = format(
        `
        INSERT INTO comments
          (article_id, body, votes, author, created_at)
        VALUES %L;
        `,
        rows
      );

      return db.query(insert);
    });
};

module.exports = seed;
