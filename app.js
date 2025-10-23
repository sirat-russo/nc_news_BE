const express = require("express");
const { getTopics } = require("./controllers/topics.controller");

const app = express();

app.get("/api/topics", getTopics);

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
