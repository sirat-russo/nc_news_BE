NC News — Backend Project

This project sets up and seeds a PostgreSQL database for the NC News API.

# Setup Instructions

## Requirements
-Node.js (v18+)
-PostgreSQL (installed and running locally)

## Install dependencies
npm install

## Create the databases
npm run setup-dbs

## Environment Variables
Create two .env files in the project root:

### .env.development
PGDATABASE=nc_news

### .env.test
PGDATABASE=nc_news_test

### Ensure .gitignore contains
.env.*

## Seeding

### Development data
npm run seed-dev

### Test data (and run tests)
npm run test-seed
