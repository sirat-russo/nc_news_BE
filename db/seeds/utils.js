const db = require("../../db/connection");
const format = require("pg-format");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};


exports.createArticleRef = (articleRows = []) => {
  return articleRows.reduce((acc, row) => {
    acc[row.title] = row.article_id;
    return acc;
  }, {});
};


exports.makeCommentsWithArticleId = (comments = [], articleRef = {}) => {
  return comments.map((comment) => {
    const { article_title, created_at, ...rest } = comment;

    const article_id = articleRef[article_title];
    
    const converted = exports.convertTimestampToDate({ created_at, ...rest });

    return {
      ...converted,
      article_id,
    };
  });
};

exports.checkExists = async (table, column, value) => {
  const queryStr = format("SELECT 1 FROM %I WHERE %I = $1;", table, column);
  const { rows } = await db.query(queryStr, [value]);

  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Topic not found" });
  }
};



