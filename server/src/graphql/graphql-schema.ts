export const typeDefs = `#graphql
  type Query {
  dysfunctions: [Dysfunction!]!
  eligibility: [Eligibility!]!
  copperClosures: [CopperClosure!]!
  buildings: [Building!]!
  users: [User!]!
}

type Dysfunction {
  id: ID!
  date: String!
  areaAffected: String!
  subscriptionAffected: [Subscription!]!
  reason: String!
  location: Location!
}

type Eligibility {
  id: ID!
  areaId: ID!
  areaType: String!
  technologyAvailability: String!
  speedClass: String!
  location: Location!
}

type CopperClosure {
  id: ID!
  date: String!
  areaAffected: String!
  reason: String!
  location: Location!
}

type Location {
  id: ID!
  address: String!
  postalCode: String!
  building: Building
}

type Building {
  id: ID!
  address: String!
  postalCode: String!
  broadbandAvailability: Boolean!
  fiberOpticAvailability: Boolean!
  users: [User!]!
  copperClosures: [CopperClosure!]!
}

type User {
  id: ID!
  name: String!
  email: String!
  building: Building!
  devices: [Device!]!
}

type Device {
  id: ID!
  name: String!
  type: String!
  user: User!
}

type Service {
  id: ID!
  name: String!
  provider: String!
}

type Subscription {
  id: ID!
  user: User!
  service: Service!
}

type Mutation {
  # Add mutation operations here if needed
}

schema {
  query: Query
  mutation: Mutation
}
`;