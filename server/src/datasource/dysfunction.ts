import { Dysfunction } from "../types";
import DataLoader from "dataloader";

export class DysfunctionDataSource {
    private dbConnection: any;
    private dysfunctionLoader: DataLoader<any, Dysfunction>;

    constructor(dbConnection: any) {
        this.dbConnection = dbConnection;
        this.dysfunctionLoader = new DataLoader(async (dysfunctionIds: String[]) => {
            const dysfunctions = await this.dbConnection.dysfunction.findMany({
                where: {
                    id: {
                        in: dysfunctionIds,
                    },
                },
            });
            return dysfunctionIds.map((dysfunctionId: String) =>
                dysfunctions.find((dysfunction: Dysfunction) => dysfunction.id === dysfunctionId)
            );
        });
    }

    async getDysfunctionById({ id }: Dysfunction): Promise<Dysfunction> {
        return this.dysfunctionLoader.load(id);
    }

    async getDysfunctions(): Promise<Dysfunction[]> {
        return this.dbConnection.dysfunction.findMany();
    }

    async createDysfunction({ connectionId, reason, startDate, endDate, statusId }: Dysfunction): Promise<Dysfunction> {
        return this.dbConnection.dysfunction.create({
            data: {
                connectionId,
                reason,
                startDate,
                endDate,
                statusId,
            },
        });
    }

    async updateDysfunction({ id, connectionId, reason, startDate, endDate, statusId }: Dysfunction): Promise<Dysfunction> {
        return this.dbConnection.dysfunction.update({
            where: {
                id,
            },
            data: {
                connectionId,
                reason,
                startDate,
                endDate,
                statusId,
            },
        });
    }

    async deleteDysfunction({ id }: Dysfunction): Promise<Dysfunction> {
        return this.dbConnection.dysfunction.delete({
            where: {
                id: id,
            },
        });
    }
}