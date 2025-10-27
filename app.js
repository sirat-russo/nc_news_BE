const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getArticles, getArticleById, patchArticleById } = require("./controllers/articles.controller");
const { getUsers } = require("./controllers/users.controller");
const { getCommentsByArticleId, postCommentByArticleId, deleteCommentById } = require("./controllers/comments.controller");
const { getApi } = require("./controllers/api.controller");




const app = express();

app.use(express.json());



app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api", getApi);



app.use((req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err && err.status && err.msg) {
    return res.status(err.status).send({ msg: err.msg });
  }
  return next(err);
});

app.use((err, req, res, next) => {
  if (err && err.code === "22P02") {
    return res.status(400).send({ msg: "Bad request" });
  }
  return next(err);
});


app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});




module.exports = app;
