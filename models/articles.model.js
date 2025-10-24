const db = require("../db/connection");

exports.selectArticles = () => {
  const queryStr = `
    SELECT 
      a.author,
      a.title,
      a.article_id,
      a.topic,
      a.created_at,
      a.votes,
      a.article_img_url,
      COUNT(c.comment_id)::INT AS comment_count
    FROM articles a
    LEFT JOIN comments c ON a.article_id = c.article_id
    GROUP BY a.article_id
    ORDER BY a.created_at DESC;
  `;

  return db.query(queryStr).then(({ rows }) => rows);
};

exports.selectArticleById = (article_id) => {
  const queryStr = `
    SELECT author, title, article_id, body, topic, created_at, votes, article_img_url
    FROM articles
    WHERE article_id = $1;
  `;
  return db.query(queryStr, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    }
    return rows[0];
  });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
    });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  const queryStr = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING author, title, article_id, topic, body, created_at, votes, article_img_url;
  `;

  return db.query(queryStr, [inc_votes, article_id]).then(({ rows }) => {
    const article = rows[0];
    if (!article) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    }
    return article;
  });
};


