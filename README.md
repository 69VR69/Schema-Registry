# Project Name

## Description

This is a GraphQL server built with Apollo Server and Prisma. It can run in a mocked mode for testing purposes.

## Dependencies

This project uses the following dependencies:

- `@apollo/server`: For creating the Apollo Server.
- `@prisma/client`: For database operations using Prisma.
- Your own `graphql-resolvers` and `graphql-schema` modules.
- Your own `ConnectionDataSource` module.

## Setup

1. Clone the repository:

```bash
git clone https://github.com/69VR69/Schema-Registry
```

2. Navigate into the project directory and install the dependencies on Server side:

```bash
cd ./server
npm install
```

3. Navigate into the project directory and install the dependencies on Client side:

```bash
cd ./client
npm install
```

4. Running the Server
   To start the server, run:

```bash
cd ./server
npm run start
```

By default, the server will start in mocked mode. To disable this, set the IS_MOCKED constant in index.ts to false.

The server will start at http://localhost:4000.

5. Running the Client
   To start the client, run:

```bash
cd ./client
npm run dev
```

The client will start at http://localhost:5173.

# Prisma

Tu update the database schema use the command
```bash
npx prisma migrate dev --name <NameOfMigration>
npx prisma generate
```
