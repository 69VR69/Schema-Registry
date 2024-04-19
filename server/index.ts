import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';
import * as ds from './datasource/datasources.dependencies.js';
import { resolvers } from './graphql/graphql-resolvers.js';
import { typeDefs } from './graphql/graphql-schema.js';

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Create a new PrismaClient instance to connect to the database
const prisma = new PrismaClient();

const datasources = {
    copperClosureDb: new ds.CopperClosureDataSource(prisma),
    connectionDb: new ds.ConnectionDataSource(prisma),
    dysfunctionDb: new ds.DysfunctionDataSource(prisma),
    eligibilityDb: new ds.EligibilityDataSource(prisma),
    ispDb: new ds.ISPDataSource(prisma),
    locationDb: new ds.LocationDataSource(prisma),
    subscriptionDb: new ds.SubscriptionDataSource(prisma),
    technologyDb: new ds.TechnologyDataSource(prisma),
    userDb: new ds.UserDataSource(prisma),
};

// Test if the prisma database is empty
const isEmpty = async () => {
    const locations = await prisma.dysfunction.findMany();
    return locations.length === 0;
};

console.log('Checking if database is empty...' + (await isEmpty() ? 'Yes' : 'No'));

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async () => {
        return {
            dataSources: datasources,
        };
    },
})
    .then(({ url }) => { console.log(`🚀  Server ready at: ${url}`); })
    .catch((error) => { console.error(error); });
