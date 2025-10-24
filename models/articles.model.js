const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

exports.selectArticles = ({ sort_by = "created_at", order = "desc", topic } = {}) => {
  const allowedSorts = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  const allowedOrders = ["asc", "desc"];

  const normalisedOrder = String(order).toLowerCase();

  if (!allowedSorts.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by" });
  }
  if (!allowedOrders.includes(normalisedOrder)) {
    return Promise.reject({ status: 400, msg: "Invalid order" });
  }

  const sortIdentifier = sort_by === "comment_count" ? "comment_count" : `a.${sort_by}`;

  const params = [];
  let whereClause = "";
  if (topic) {
    params.push(topic);
    whereClause = `WHERE a.topic = $1`;
  }
  
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
    ${whereClause} 
    GROUP BY a.article_id
    ORDER BY ${sortIdentifier} ${normalisedOrder.toUpperCase()};
  `;

  return db.query(queryStr, params).then(({ rows }) => {
    if (topic && rows.length === 0) {
        return checkExists("topics", "slug", topic).then(() => rows);
      }
      return rows;
    });  
};

exports.selectArticleById = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  const queryStr = `
    SELECT
      a.author,
      a.title,
      a.article_id,
      a.topic,
      a.created_at,
      a.votes,
      a.article_img_url,
      a.body,
      COUNT(c.comment_id)::INT AS comment_count
    FROM articles a
    LEFT JOIN comments c
      ON a.article_id = c.article_id
    WHERE a.article_id = $1
    GROUP BY a.article_id;
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


