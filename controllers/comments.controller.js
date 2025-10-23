const { selectCommentsByArticleId, insertCommentByArticleId } = require("../models/comments.model");
const { checkArticleExists } = require("../models/articles.model");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  if (isNaN(article_id)) {
    return res.status(400).send({ msg: "Bad request" });
  }

  Promise.all([
    selectCommentsByArticleId(article_id),
    checkArticleExists(article_id),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (isNaN(article_id)) {
    return res.status(400).send({ msg: "Bad request" });
  }

  if (!username || !body) {
    return res.status(400).send({ msg: "Missing required fields" });
  }

  checkArticleExists(article_id)
    .then(() => insertCommentByArticleId(article_id, username, body))
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      if (err.code === "23503") {
        return res.status(404).send({ msg: "User or Article not found" });
      }
      next(err);
    });
};


