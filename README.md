# Project Name

## Description

This is a GraphQL server built with Apollo Server and Prisma. It can run in a mocked mode for testing purposes.

## Dependencies

This project uses the following dependencies:

- `@apollo/server`: For creating the Apollo Server.
- `@prisma/client`: For database operations using Prisma.
- Your own `graphql-resolvers` and `graphql-schema` modules.
- Your own `ConnectionDataSource` module.
- `@snaplet` : For seeding the database

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

The GraphQL server will start at http://localhost:4200 and the Express (APIs) server will start at http://localhost:2400

5. Running the Client
   To start the client, run:

```bash
cd ./client
npm run dev
```

The client will start at http://localhost:4224.

# Prisma

To update the database schema use the command
```bash
npm run update-schema
```

To seed the database use the command
```bash
npx prisma schema seed
```
To visualize the database datas use the command
```bash
npm run visualize-schema
```

# Project's workflow
1) The procuder create some data on his side
2) The producer retrieves the _schema_id_ of its schema via a GET API on our server
3) The producer sends its data via the API POST with the following body:
```xml
{
  schema_id: <schema_id>,
  data: <producer_data>
}
```
4) Our server retrieves the schema from the _schema_id_.
5) Our server validates the schema with your method
6) 
    1) Validation fails => server returns HTTP error to producer and stops there
    2) Validation works => the server returns an HTTP success code and sends the data to the kafka broker
7) the consumer is automatically notified of the new data by the broker
8) consumer retrieves data via request (same content as step 3)
9) the consumer retrieves the schema from the server via a GET `/schema_id_` call
10) the consumer parse the data with the schema