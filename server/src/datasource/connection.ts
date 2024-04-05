import { Connection } from "../types";
import DataLoader from "dataloader";

export class ConnectionDataSource {
    private dbConnection: any;
    private connectionLoader: DataLoader<any, Connection>;

    constructor(dbConnection: any) {
        this.dbConnection = dbConnection;
        this.connectionLoader = new DataLoader(async (connectionIds: String[]) => {
            const connections = await this.dbConnection.connection.findMany({
                where: {
                    id: {
                        in: connectionIds,
                    },
                },
            });
            return connectionIds.map((connectionId: String) =>
                connections.find((connection: Connection) => connection.id === connectionId)
            );
        });
    }

    async getConnectionById({ id }: Connection): Promise<Connection> {
        return this.connectionLoader.load(id);
    }

    async getConnections(): Promise<Connection[]> {
        return this.dbConnection.connection.findMany();
    }

    async createConnection({ subscriptionId, technologyId }: Connection): Promise<Connection> {
        return this.dbConnection.connection.create({
            data: {
                subscriptionId,
                technologyId,
            },
        });
    }

    async updateConnection({ id, subscriptionId, technologyId }: Connection): Promise<Connection> {
        return this.dbConnection.connection.update({
            where: {
                id,
            },
            data: {
                subscriptionId,
                technologyId,
            },
        });
    }

    async deleteConnection({ id }: Connection): Promise<Connection> {
        return this.dbConnection.connection.delete({
            where: {
                id: id,
            },
        });
    }
}