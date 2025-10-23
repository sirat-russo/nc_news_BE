const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getArticles, getArticleById } = require("./controllers/articles.controller");
const { getUsers } = require("./controllers/users.controller");


const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);
app.get("/api/articles/:article_id", getArticleById);



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
