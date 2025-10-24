const { selectArticles, selectArticleById, updateArticleVotes } = require("../models/articles.model");

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (isNaN(article_id)) return res.status(400).send({ msg: "Bad request" });
  if (inc_votes === undefined || typeof inc_votes !== "number") {
    return res.status(400).send({ msg: "Bad request" });
  }

  updateArticleVotes(article_id, inc_votes)
    .then((article) => res.status(200).send({ article }))
    .catch(next);
};

