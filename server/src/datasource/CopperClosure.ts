import { CopperClosure } from "../types";
import DataLoader from "dataloader";

export class CopperClosureDataSource {
    private dbConnection: any;
    private copperClosureLoader: DataLoader<any, CopperClosure>;

    constructor(dbConnection: any) {
        this.dbConnection = dbConnection;
        this.copperClosureLoader = new DataLoader(async (copperClosureIds: String[]) => {
            const copperClosures = await this.dbConnection.copperClosure.findMany({
                where: {
                    id: {
                        in: copperClosureIds,
                    },
                },
            });
            return copperClosureIds.map((copperClosureId: String) =>
                copperClosures.find((copperClosure: CopperClosure) => copperClosure.id === copperClosureId)
            );
        });
    }

    async getCopperClosureById({ id }: CopperClosure): Promise<CopperClosure> {
        return this.copperClosureLoader.load(id);
    }

    async getCopperClosures(): Promise<CopperClosure[]> {
        return this.dbConnection.copperClosure.findMany();
    }

    async createCopperClosure({ locationId, startDate, endDate, statusId }: CopperClosure): Promise<CopperClosure> {
        return this.dbConnection.copperClosure.create({
            data: {
                locationId,
                startDate,
                endDate,
                statusId
            },
        });
    }

    async updateCopperClosure({ id, locationId, startDate, endDate, statusId }: CopperClosure): Promise<CopperClosure> {
        return this.dbConnection.copperClosure.update({
            where: {
                id,
            },
            data: {
                locationId,
                startDate,
                endDate,
                statusId
            },
        });
    }

    async deleteCopperClosure({ id }: CopperClosure): Promise<CopperClosure> {
        return this.dbConnection.copperClosure.delete({
            where: {
                id: id,
            },
        });
    }
}