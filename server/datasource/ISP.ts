import { ISP } from "../types.js";
import DataLoader from "dataloader";

export class ISPDataSource {
    private dbConnection: any;
    private ispLoader: DataLoader<any, ISP>;

    constructor(dbConnection: any) {
        this.dbConnection = dbConnection;
        this.ispLoader = new DataLoader(async (ispIds: number[]) => {
            const isps = await this.dbConnection.ISP.findMany({
                where: {
                    id: {
                        in: ispIds,
                    },
                },
            });
            return ispIds.map((ispId: number) =>
                isps.find((isp: ISP) => isp.id === ispId)
            );
        });
    }

    async getISPById({ id }: ISP): Promise<ISP> {
        return this.ispLoader.load(id);
    }

    async getISPs(): Promise<ISP[]> {
        return this.dbConnection.ISP.findMany();
    }

    async createISP({ name }: ISP): Promise<ISP> {
        return this.dbConnection.ISP.create({
            data: {
                name
            },
        });
    }

    async updateISP({ id, name }: ISP): Promise<ISP> {
        return this.dbConnection.ISP.update({
            where: {
                id,
            },
            data: {
                name,
            },
        });
    }

    async deleteISP({ id }: ISP): Promise<ISP> {
        return this.dbConnection.ISP.delete({
            where: {
                id: id,
            },
        });
    }
}