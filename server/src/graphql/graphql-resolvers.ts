import { Dysfunction } from "../types";

export const resolvers = {
    Query: {
        async dysfunctions(context: any) {
            return context.dataSources.dysfunctionAPI.getDysfunctions();
        },
        async dysfunction({ id }: Dysfunction, context: any) {
            return context.dataSources.dysfunctionAPI.getDysfunctionById(id);
        },
    },
    
    Mutation: {
        async createDysfunction({ connectionId, reason, startDate, endDate, statusId }: Dysfunction, context: any) {
            return context.dataSources.dysfunctionAPI.createDysfunction({ connectionId, reason, startDate, endDate, statusId });
        },
        async updateDysfunction({ id, connectionId, reason, startDate, endDate, statusId }: Dysfunction, context: any) {
            return context.dataSources.dysfunctionAPI.updateDysfunction({ id, connectionId, reason, startDate, endDate, statusId });
        },
        async deleteDysfunction({ id } : Dysfunction, context: any) {
            return context.dataSources.dysfunctionAPI.deleteDysfunction(id);
        },
    },
};