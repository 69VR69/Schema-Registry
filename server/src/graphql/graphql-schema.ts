export const typeDefs = `#graphql
  type Connection {
  id: ID!
  technology: String!
  status: String!
  residence: Residence!
}

type Residence {
  id: ID!
  address: String!
  connections: [Connection!]!
}

type Notification {
  id: ID!
  message: String!
  source: String!
  timestamp: String!
}

type Query {
  residences: [Residence!]!
  residence(id: ID!): Residence
  connections: [Connection!]!
  connection(id: ID!): Connection
  notifications: [Notification!]!
  notification(id: ID!): Notification
}

type Mutation {
  updateConnectionStatus(id: ID!, status: String!): Connection!
  sendNotification(message: String!, source: String!, timestamp: String!): Notification!
}

type Subscription {
  connectionStatusUpdated: Connection!
  newNotification: Notification!
}
`;