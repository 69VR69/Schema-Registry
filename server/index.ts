import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import Docker from 'dockerode';
import express from 'express';
import * as ds from './datasource/datasources.dependencies.js';
import { resolvers } from './graphql/graphql-resolvers.js';
import { typeDefs } from './graphql/graphql-schema.js';
import { KafkaController } from './kafka/KafkaController.js';
import { RegistryService } from './registry/RegistryService.js';
import { validateContent } from './registry/SchemaValidation.js';
import { SchemaWithVersion } from './types.js';
import { Request, Response } from 'express'
import { versions } from 'process';

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

const registryService = new RegistryService(prisma);
const kafka = new KafkaController();
await kafka.init();
const docker = new Docker();

// Utilisez le middleware cors pour autoriser les requêtes cross-origin
apiApp.use(cors());

// Ajoutez le middleware express.json() pour analyser les corps de requête en JSON
apiApp.use(express.json());

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
apiApp.post('/data', (req:Request, res:Response) => {
  
    // Parse the schemaId from the request body
    const schemaId = req.body.schemaId;
    // Get the schema from the database
    registryService.repository.getSchemaById(schemaId)
    .then(async (schema: SchemaWithVersion) => {
        try {
            // Get the content of the latest version
            const version = await registryService.repository.getVersionById(schema.versionId);
            console.log("eheeeeeeeeeee", version);
            const schemaContent = version.content;
            // Validate the data
            if (validateContent(schemaContent, req.body.content)) {
                const topic = schema.name;
                // Send the data to Kafka
                const result = await kafka.send(req.body.content, topic);
                if (result) {
                    res.status(201).send('Data sent to Kafka');
                } else {
                    res.status(400).send('Invalid data');
                }
            } else {
                res.status(400).send('Invalid data');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Internal server error');
    })
});

apiApp.listen(2400, () => {
    console.log('API server listening on port 2400!');
});
kafka.send('Hello, Kafka!', 'test');

async function handleServerShutdown() {
    await prisma.$disconnect();
    await kafka.close();

    console.log('Stopping Docker containers');
    const containers = await docker.listContainers({ all: true });
    const kafkaContainer = containers.find((container) =>
        container.Names.includes('/server-schema-registry-broker-1')
    );
    const zookeeperContainer = containers.find((container) =>
        container.Names.includes('/server-zookeeper-1')
    );

    if (kafkaContainer) {
        const container = docker.getContainer(kafkaContainer.Id);
        await container.stop();
        console.log('Kafka container stopped');
    }

    if (zookeeperContainer) {
        const container = docker.getContainer(zookeeperContainer.Id);
        await container.stop();
        console.log('Zookeper container stopped');
    }

    console.log('Server stopped');
    process.exit(0);
}

// On server shutdown
process.on('SIGINT', async () => {
    await handleServerShutdown();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await handleServerShutdown();
    process.exit(0);
});

process.on('uncaughtException', async (error) => {
    console.error('Uncaught exception:', error);
    await handleServerShutdown();
    process.exit(1);
});

process.on('exit', async (code) => {
    console.log('Process exit with code:', code);
    await handleServerShutdown();
    process.exit(code);
});