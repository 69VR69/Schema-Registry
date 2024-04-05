import { Subscription } from "../types";
import DataLoader from "dataloader";

export class SubscriptionDataSource {
    private dbConnection: any;
    private subscriptionLoader: DataLoader<any, Subscription>;

    constructor(dbConnection: any) {
        this.dbConnection = dbConnection;
        this.subscriptionLoader = new DataLoader(async (subscriptionIds: String[]) => {
            const subscriptions = await this.dbConnection.subscription.findMany({
                where: {
                    id: {
                        in: subscriptionIds,
                    },
                },
            });
            return subscriptionIds.map((subscriptionId: String) =>
                subscriptions.find((subscription: Subscription) => subscription.id === subscriptionId)
            );
        });
    }

    async getSubscriptionById({ id }: Subscription): Promise<Subscription> {
        return this.subscriptionLoader.load(id);
    }

    async getSubscriptions(): Promise<Subscription[]> {
        return this.dbConnection.subscription.findMany();
    }

    async createSubscription({ ownerId, supplierId, statusId }: Subscription): Promise<Subscription> {
        return this.dbConnection.subscription.create({
            data: {
                ownerId,
                supplierId,
                statusId
            },
        });
    }

    async updateSubscription({ id, ownerId, supplierId, statusId }: Subscription): Promise<Subscription> {
        return this.dbConnection.subscription.update({
            where: {
                id,
            },
            data: {
                ownerId,
                supplierId,
                statusId
            },
        });
    }

    async deleteSubscription({ id }: Subscription): Promise<Subscription> {
        return this.dbConnection.subscription.delete({
            where: {
                id: id,
            },
        });
    }
}