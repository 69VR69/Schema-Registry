import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';
import { ConnectionDataSource } from './datasource/connection.js';
import { DysfunctionDataSource } from './datasource/dysfunction.js';
import { resolvers } from './graphql/graphql-resolvers.js';
import { typeDefs } from './graphql/graphql-schema.js';

const server = new ApolloServer({
    typeDefs,
    resolvers: resolvers,
});

// Create a new PrismaClient instance to connect to the database
const prisma = new PrismaClient();

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async () => {
        return {
            dataSources: {
                connectionsDb : new ConnectionDataSource(prisma),
                dysfunctionDb : new DysfunctionDataSource(prisma),
            },
        };
    },
})
.then(({ url }) => { console.log(`🚀  Server ready at: ${url}`); })