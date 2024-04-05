import { Eligibility } from "../types";
import DataLoader from "dataloader";

export class EligibilityDataSource {
    private dbConnection: any;
    private eligibilityLoader: DataLoader<any, Eligibility>;

    constructor(dbConnection: any) {
        this.dbConnection = dbConnection;
        this.eligibilityLoader = new DataLoader(async (eligibilityIds: String[]) => {
            const eligibilities = await this.dbConnection.eligibility.findMany({
                where: {
                    id: {
                        in: eligibilityIds,
                    },
                },
            });
            return eligibilityIds.map((eligibilityId: String) =>
                eligibilities.find((eligibility: Eligibility) => eligibility.id === eligibilityId)
            );
        });
    }

    async getEligibilityById({ id }: Eligibility): Promise<Eligibility> {
        return this.eligibilityLoader.load(id);
    }

    async getEligibilities(): Promise<Eligibility[]> {
        return this.dbConnection.eligibility.findMany();
    }

    async createEligibility({ technologyId, userId, supplierId, statusId }: Eligibility): Promise<Eligibility> {
        return this.dbConnection.eligibility.create({
            data: {
                technologyId,
                userId,
                supplierId,
                statusId
            },
        });
    }

    async updateEligibility({ id, technologyId, userId, supplierId, statusId }: Eligibility): Promise<Eligibility> {
        return this.dbConnection.eligibility.update({
            where: {
                id,
            },
            data: {
                technologyId,
                userId,
                supplierId,
                statusId
            },
        });
    }

    async deleteEligibility({ id }: Eligibility): Promise<Eligibility> {
        return this.dbConnection.eligibility.delete({
            where: {
                id: id,
            },
        });
    }
}