import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';
import * as ds from './datasource/datasources.dependencies.js';
import { resolvers } from './graphql/graphql-resolvers.js';
import { typeDefs } from './graphql/graphql-schema.js';
import express from 'express';
import { RegistryService } from './registry/RegistryService.js';
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
import cors from 'cors';
import { validateContent } from './registry/SchemaValidation.js';
import { SchemaWithVersion } from './types.js';
const registryService = new RegistryService(prisma);
const kafka = new KafkaController();
await kafka.init();

// Utilisez le middleware cors pour autoriser les requêtes cross-origin
apiApp.use(cors());

/* Schema */
// GET list of schemas
apiApp.get('/schema', (req, res) => {
    registryService.repository.getAllSchemas()
    .then((schemas) => {
        res.status(200)
            .send(schemas);
    })
    .catch((error) => {
        res.status(500);
        console.error(error);
    })
});

// GET a specific schema
apiApp.get('/schema/:schemaId', (req, res) => {
    registryService.repository.getSchemaById(parseInt(req.params.schemaId))
    .then((schema) => {
        res.status(200)
            .send(schema);
    })
    .catch((error) => {
        res.status(500);
        console.error(error);
    })
});

// POST a new schema
apiApp.post('/schema', (req, res) => {
    registryService.addSchema(req.body)
    .then((schema) => {
        res.status(201)
            .send(schema);
    })
    .catch((error) => {
        res.status(500);
        console.error(error);
    })
});

/* Data */
// POST a new data
apiApp.post('/data', (req, res) => {
    // Parse the schemaId from the request body
    const schemaId = req.body.schemaId;
    // Get the schema from the database
    registryService.repository.getSchemaById(schemaId)
    .then((schema : SchemaWithVersion) => {
        // Get the content of the latest version
        const schemaContent = schema.versions.content;
        // Validate the data
        if (validateContent(schemaContent, req.body.content)) {
            const topic = schema.name;
            // Send the data to Kafka
            kafka.send(req.body.content,topic)
            .then((result) => {
                if (result) {
                    res.status(201)
                        .send('Data sent to Kafka');
                }
                else {
                    res.status(400)
                        .send('Invalid data');
                }
            });
        }
        else {
            res.status(400)
                .send('Invalid data');
        }
    })

});

apiApp.listen(2400, () => {
    console.log('API server listening on port 2400!');
});

// On server shutdown
process.on('exit', async () => {
    await prisma.$disconnect();
    await kafka.close();
});