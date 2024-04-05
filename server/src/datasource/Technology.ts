import { Technology } from "../types";
import DataLoader from "dataloader";

export class TechnologyDataSource {
    private dbConnection: any;
    private technologyLoader: DataLoader<any, Technology>;

    constructor(dbConnection: any) {
        this.dbConnection = dbConnection;
        this.technologyLoader = new DataLoader(async (technologyIds: String[]) => {
            const technologies = await this.dbConnection.technology.findMany({
                where: {
                    id: {
                        in: technologyIds,
                    },
                },
            });
            return technologyIds.map((technologyId: String) =>
                technologies.find((technology: Technology) => technology.id === technologyId)
            );
        });
    }

    async getTechnologyById({ id }: Technology): Promise<Technology> {
        return this.technologyLoader.load(id);
    }

    async getTechnologies(): Promise<Technology[]> {
        return this.dbConnection.technology.findMany();
    }

    async createTechnology({ name, debitMin, debitMax }: Technology): Promise<Technology> {
        return this.dbConnection.technology.create({
            data: {
                name,
                debitMin,
                debitMax
            },
        });
    }

    async updateTechnology({ id, name, debitMin, debitMax }: Technology): Promise<Technology> {
        return this.dbConnection.technology.update({
            where: {
                id,
            },
            data: {
                name,
                debitMin,
                debitMax
            },
        });
    }

    async deleteTechnology({ id }: Technology): Promise<Technology> {
        return this.dbConnection.technology.delete({
            where: {
                id: id,
            },
        });
    }
}