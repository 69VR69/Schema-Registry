import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import HomePage from './Pages/IndexPage.tsx';
import config from '../client-config.json'
import { Kafka } from "kafkajs";


const client = new ApolloClient({
  uri: config.GRAPHQL_URL,
  cache: new InMemoryCache(),
});


const clientId = 'darkpioupiou';
const brokers = ['localhost:2442'];
const kafka = new Kafka({
  clientId,
  brokers
});
const consumer = kafka.consumer({ groupId: 'test-group' })

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <HomePage consumer={consumer} />
    </ApolloProvider>
  </React.StrictMode>
)
