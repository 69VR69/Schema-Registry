import { ISP } from "../types.js";
import DataLoader from "dataloader";

export class ISPDataSource {
    private dbConnection: any;
    private ispLoader: DataLoader<any, ISP>;

    constructor(dbConnection: any) {
        this.dbConnection = dbConnection;
        this.ispLoader = new DataLoader(async (ispIds: String[]) => {
            const isps = await this.dbConnection.isp.findMany({
                where: {
                    id: {
                        in: ispIds,
                    },
                },
            });
            return ispIds.map((ispId: String) =>
                isps.find((isp: ISP) => isp.id === ispId)
            );
        });
    }

    async getISPById({ id }: ISP): Promise<ISP> {
        return this.ispLoader.load(id);
    }

    async getISPs(): Promise<ISP[]> {
        return this.dbConnection.isp.findMany();
    }

    async createISP({ name }: ISP): Promise<ISP> {
        return this.dbConnection.isp.create({
            data: {
                name
            },
        });
    }

    async updateISP({ id, name }: ISP): Promise<ISP> {
        return this.dbConnection.isp.update({
            where: {
                id,
            },
            data: {
                name,
            },
        });
    }

    async deleteISP({ id }: ISP): Promise<ISP> {
        return this.dbConnection.isp.delete({
            where: {
                id: id,
            },
        });
    }
}