const db = require("./connection");

async function main() {
  try {
    const {rows: users}  = await db.query("SELECT * FROM users;");
    console.log("\n Users ");
    console.table(users);


    const { rows: codingArticles } = await db.query(  
      `SELECT article_id, title, author, topic, votes, created_at 
      FROM articles
      WHERE topic = 'coding'
      ORDER BY created_at DESC;
      `
    );
    console.log("\n Articles with topic 'coding'");
    console.table(codingArticles);


    const { rows: negativeComments } = await db.query(
      `
      SELECT comment_id, article_id, author, votes, created_at, body
      FROM comments
      WHERE votes < 0
      ORDER BY votes ASC, created_at DESC;
      `
    );
    console.log("\n Comments with votes < 0 ");
    console.table(negativeComments);


    const { rows: topics } = await db.query(`
      SELECT slug, description, img_url
      FROM topics
      ORDER BY slug;
    `);
    console.log("\n Topics ");
    console.table(topics);

    const { rows: grumpyArticles } = await db.query(
      `
      SELECT article_id, title, author, topic, votes, created_at
      FROM articles
      WHERE author = 'grumpy19'
      ORDER BY created_at DESC;
      `
    );
    console.log("\n Articles by 'grumpy19' ");
    console.table(grumpyArticles);


    const { rows: popularComments } = await db.query(
      `
      SELECT comment_id, article_id, author, votes, created_at, body
      FROM comments
      WHERE votes > 10
      ORDER BY votes DESC, created_at DESC;
      `
    );
    console.log("\n Comments with votes > 10 ");
    console.table(popularComments);

   } catch (err) {
    console.error(err);
  } finally {
    db.end();
  }
}

main();