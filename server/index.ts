import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';
import * as ds from './datasource/datasources.dependencies.js';
import { resolvers } from './graphql/graphql-resolvers.js';
import { typeDefs } from './graphql/graphql-schema.js';
import express from 'express';
import { KafkaController } from './kafka/KafkaController.js';

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
console.log("Dysfunction count: " + (await datasources.dysfunctionDb.getDysfunctions()).length);
console.log("CopperClosure count: " + (await datasources.copperClosureDb.getCopperClosures()).length);
console.log("Eligibility count: " + (await datasources.eligibilityDb.getEligibilities()).length);
//console.log("ISP count: " + (await datasources.ispDb.getISPs()).length); TODO: fix this (this.dbConnection.isp is undefined)
console.log("Location count: " + (await datasources.locationDb.getLocations()).length);
console.log("Subscription count: " + (await datasources.subscriptionDb.getSubscriptions()).length);
console.log("Technology count: " + (await datasources.technologyDb.getTechnologies()).length);
console.log("User count: " + (await datasources.userDb.getUsers()).length);
console.log("Connection count: " + (await datasources.connectionDb.getConnections()).length);

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
await startStandaloneServer(server, {
    listen: { port: 4200 },
    context: async () => {
        return {
            dataSources: datasources,
        };
    },
})
    .then(({ url }) => { console.log(`🚀  Server ready at: ${url}`); })
    .catch((error) => { console.error(error); });

// Express server
const apiApp = express();
const kafka = new KafkaController();
await kafka.init();

/* Schema */
// GET list of schemas
apiApp.get('/schema', (req, res) => {
    res.send('Hello World!');
});

// GET a specific schema
apiApp.get('/schema/:schemaId', (req, res) => {
    res.send('Hello World!');
});

// POST a new schema
apiApp.post('/schema', (req, res) => {
    res.send('Hello World!');
});

/* Data */
// POST a new data
apiApp.post('/data', (req, res) => {
    res.send('Hello World!');
});

apiApp.listen(2400, () => {
    console.log('API server listening on port 2400!');
});

// On server shutdown
process.on('exit', async () => {
    await prisma.$disconnect();
    await kafka.close();
});