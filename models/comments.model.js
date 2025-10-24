const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
  const queryStr = `
    SELECT 
      comment_id, 
      votes, 
      created_at, 
      author, 
      body, 
      article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
  `;

  return db.query(queryStr, [article_id]).then(({ rows }) => {
    return rows;
  });
};

exports.insertCommentByArticleId = (article_id, username, body) => {
  const queryStr = `
    INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3)
    RETURNING comment_id, body, article_id, author, votes, created_at;
  `;

  return db.query(queryStr, [username, body, article_id])
    .then(({ rows }) => rows[0]);
};

exports.removeCommentById = (comment_id) => {
  const queryStr = `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING comment_id;
  `;

  return db.query(queryStr, [comment_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Comment not found" });
    }
    return;
  });
};
