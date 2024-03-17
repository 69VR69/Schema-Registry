import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './graphql/graphql-schema.js';
import { mocked_resolvers, resolvers } from './graphql/graphql-resolvers.js';

const IS_MOCKED = true;

const server = new ApolloServer({
    typeDefs,
    resolvers: IS_MOCKED ? mocked_resolvers : resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
await startStandaloneServer(server, {
    listen: { port: 4000 },
}).then(({ url }) => { console.log(`🚀  Server ready at: ${url}`); })