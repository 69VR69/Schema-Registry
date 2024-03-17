// A mock data set
const residences = [
  {
    id: '1',
    address: '123 Fake St 1',
    },
    {
    id: '2',
    address : '123 Fake St 2',
    },
    {
    id: '3',
    address: '123 Fake St 3',
    },
    ];

const connections = [
    {
        id: '1',
        technology: 'Fiber',
        status: 'Active',
        residence: residences[0],
    },
    {
        id: '2',
        technology: 'DSL',
        status: 'Inactive',
        residence: residences[1],
    },
    {
        id: '3',
        technology: 'Cable',
        status: 'Active',
        residence: residences[2],
    },
    ];

const notifications = [
    {
        id: '1',
        message: 'A new connection has been activated',
        source: 'System',
        timestamp: '2021-06-01T12:00:00',
    },
    {
        id: '2',
        message: 'A new connection has been activated',
        source: 'System',
        timestamp: '2021-06-01T12:00:00',
    },
    {
        id: '3',
        message: 'A new connection has been activated',
        source: 'System',
        timestamp: '2021-06-01T12:00:00',
    },
    ];

// Resolvers define the technique for fetching the types in the schema.
export const resolvers = {
  Query: {
    residences: () => residences,
    residence: (parent: any, args: { id: string; }) => {
      return residences.find(residence => residence.id === args.id);
    },
    connections: () => connections,
    connection: (parent: any, args: { id: string; }) => {
      return connections.find(connection => connection.id === args.id);
    },
    notifications: () => notifications,
    notification: (parent: any, args: { id: string; }) => {
      return notifications.find(notification => notification.id === args.id);
    },
  },
  Mutation: {
    updateConnectionStatus: (parent, args) => {
      const connection = connections.find(connection => connection.id === args.id);
      if (!connection) {
        throw new Error('No connection found with that id');
      }
      connection.status = args.status;
      //pubsub.publish('CONNECTION_STATUS_UPDATED', { connectionStatusUpdated: connection });
      return connection;
    },
    sendNotification: (parent, args) => {
      const newNotification = {
        id: String(notifications.length + 1),
        message: args.message,
        source: args.source,
        timestamp: args.timestamp,
      };
      notifications.push(newNotification);
      //pubsub.publish('NEW_NOTIFICATION', { newNotification: newNotification });
      return newNotification;
    },
  },
  Subscription: {
    connectionStatusUpdated: {
      //subscribe: () => pubsub.asyncIterator(['CONNECTION_STATUS_UPDATED']),
    },
    newNotification: {
      //subscribe: () => pubsub.asyncIterator(['NEW_NOTIFICATION']),
    },
  },
  Residence: {
    connections: (parent) => {
      return connections.filter(connection => connection.residence.id === parent.id);
    },
  },
  Connection: {
    residence: (parent) => {
      return residences.find(residence => residence.id === parent.residence.id);
    },
  },
};