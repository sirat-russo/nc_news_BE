const endpoints = {
  "GET /api": "List of all available endpoints",
  "GET /api/topics": "Responds with an array of topic objects",
  "GET /api/articles": "Responds with an array of article objects (supports sort_by, order, topic)",
  "GET /api/articles/:article_id": "Responds with an article object including comment_count",
  "GET /api/articles/:article_id/comments": "Responds with an array of comments for the given article_id",
  "POST /api/articles/:article_id/comments": "Posts a new comment to the given article_id",
  "PATCH /api/articles/:article_id": "Updates an article's votes by inc_votes",
  "DELETE /api/comments/:comment_id": "Deletes the given comment by comment_id",
  "GET /api/users": "Responds with an array of users"
};

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints });
};
