export const typeDefs = `#graphql
schema {
  query: Query
  mutation: Mutation
}
  
type Query { # GET
  dysfunctions: [Dysfunction!]!
  dysfunction(id: ID!): Dysfunction!

  eligibilities: [Eligibility!]!
  eligibility(id: ID!): Eligibility!

  copperClosures: [CopperClosure!]!
  copperClosure(id: ID!): CopperClosure!

  users: [User!]!
  user(id: ID!): User!

  subscriptions: [Subscription!]!
  subscription(id: ID!): Subscription!
}

type Mutation { # POST / PUT / PATCH / DELETE
  createDysfunction(connectionId: ID!, reason: String!, startDate: String!, endDate: String, status: DysfunctionStatus!): Dysfunction!
  updateDysfunction(id: ID!, connectionId: ID, reason: String, startDate: String, endDate: String, status: DysfunctionStatus): Dysfunction!
  deleteDysfunction(id: ID!): Dysfunction!

  createEligibility(technologyId: ID!, userId: ID!, supplierId: ID!, status: EligibilityStatus!): Eligibility!
  updateEligibility(id: ID!, technologyId: ID, userId: ID, supplierId: ID, status: EligibilityStatus): Eligibility!
  deleteEligibility(id: ID!): Eligibility!

  createCopperClosure(locationId: ID!, startDate: String!, endDate: String, status: CopperClosureStatus!): CopperClosure!
  updateCopperClosure(id: ID!, locationId: ID, startDate: String, endDate: String, status: CopperClosureStatus): CopperClosure!
  deleteCopperClosure(id: ID!): CopperClosure!

  createUser(name: String!, email: String!, locationId: ID!): User!
  updateUser(id: ID!, name: String, email: String, locationId: ID): User!
  deleteUser(id: ID!): User!

  createSubscription(ownerId: ID!, supplierId: ID!, status: SubscriptionStatus!): Subscription!
  updateSubscription(id: ID!, ownerId: ID, supplierId: ID, status: SubscriptionStatus): Subscription!
  deleteSubscription(id: ID!): Subscription!
}

type Dysfunction {
  id: ID!
  connection: Connection!
  reason: String!
  startDate: String!
  endDate: String
  status: DysfunctionStatus!
}

enum DysfunctionStatus {
  OPEN
  CLOSED
  IN_PROGRESS
  PENDING
  CANCELLED
  RESOLVED
  REJECTED
  UNKNOWN
}

type Connection {
  id: ID!
  subscription: Subscription!
  technology: Technology!
}

type Technology {
  id: ID!
  name: String!
  debitMin: Int!
  debitMax: Int!
}

type Subscription {
  id: ID!
  owner: User!
  supplier : ISP!
  status: SubscriptionStatus!
}

enum SubscriptionStatus {
  ACTIVE
  INACTIVE
  PENDING
  CANCELLED
  SUSPENDED
  UNKNOWN
}

type User {
  id: ID!
  name: String!
  email: String!
  Location : Location!
  #subscriptions: [Subscription!]! TODO: check references 1 - n
}

type Location {
  id: ID!
  address: String!
  postalCode: String!
  city: String!
}

# Internet Service Provider (FAI)
type ISP { 
  id: ID!
  name: String!
}

type Eligibility {
  id: ID!
  technology: Technology!
  user : User!
  supplier : ISP!
  status: EligibilityStatus!
}

enum EligibilityStatus {
  ELIGIBLE
  INELIGIBLE
  PENDING
  UNKNOWN
}

type CopperClosure {
  id: ID!
  location : Location!
  startDate: String!
  endDate: String
  status: CopperClosureStatus!
}

enum CopperClosureStatus {
  CLOSED
  OPEN
  IN_PROGRESS
  PENDING
  CANCELLED
  UNKNOWN
}
`;