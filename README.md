# Northcoders News API

A RESTful API built to serve data for a Reddit-style news application. It allows users to browse topics, view articles with comment counts, post comments, vote on articles, and delete comments. This API is built using **Node.js**, **Express**, and **PostgreSQL**, with database hosting on **Supabase** and deployment on **Render**.

---

## 🌐 Hosted Version

You can access the live API here:  
👉 **https://sirats-nc-news-project.onrender.com/api**

Example endpoint:  
👉 **https://sirats-nc-news-project.onrender.com/api/topics**

---

## 📁 GitHub Repository

https://github.com/sirat-russo/nc_news_BE.git

---

## 📌 Project Summary

This project is a fully tested backend API designed to mimic the functionality of a news website. It includes endpoints to:

- Retrieve topics, articles, comments, users.
- Post new comments to articles.
- Update votes on articles.
- Delete comments.
- Sort and filter articles by **created_at, votes, topic, comment_count**, etc.

The database was built using **PostgreSQL** and queried using **node-postgres (pg)**. Test suites were written using **Jest** and **Supertest**.

---

## ✅ Minimum Requirements

| Technology  | Minimum Version |
|-------------|------------------|
| Node.js     | v18+             |
| PostgreSQL  | v12+             |

---

## ⚙️ Installation & Setup (Local)

Follow these steps to run the project locally:

### 1. **Clone the repository**

```bash
git clone https://github.com/sirat-russo/nc_news_BE.git
cd nc_news_BE
```

### 2. **Install dependencies**

```bash
npm install
```

---

## 🔑 Environment Variables (.env files)

You will need **2 environment files** in the project root:

### **.env.development**
```
PGDATABASE=nc_news
```

### **.env.test**
```
PGDATABASE=nc_news_test
```

✅ Make sure both files are added to `.gitignore`.

---

## 🗄️ Database Setup

### 1. **Create local databases**

```bash
npm run setup-dbs
```

### 2. **Seed the development database**

```bash
npm run seed
```

---

## 🧪 Running Tests

To run all Jest test suites:

```bash
npm test
```

To run only db seed tests:

```bash
npm run test-seed
```

---

## 🌍 Hosting (Production)

This API is hosted using:

- **Database** → Supabase (PostgreSQL)
- **Server** → Render

To seed the production database (hosted online):

```bash
npm run seed-prod
```

---

## 🚀 Start the Server Locally

```bash
npm start
```

Server runs by default on **http://localhost:9090/api**

---

## 📚 Available Endpoints

| Method | Endpoint                                | Description                              |
|--------|------------------------------------------|------------------------------------------|
| GET    | `/api`                                   | List of all available endpoints          |
| GET    | `/api/topics`                            | Get all topics                           |
| GET    | `/api/articles`                          | Get all articles (supports queries)      |
| GET    | `/api/articles/:article_id`              | Get article by ID (with comment_count)   |
| GET    | `/api/articles/:article_id/comments`     | Get comments for an article              |
| POST   | `/api/articles/:article_id/comments`     | Add a comment to an article              |
| PATCH  | `/api/articles/:article_id`              | Update article votes                     |
| DELETE | `/api/comments/:comment_id`              | Delete a comment                         |

---

## 🧑‍💻 Author

Developed by **Mohammad Sirat Al Mustaqim**  
GitHub: https://github.com/sirat-russo

---