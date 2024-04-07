import { Connection, CopperClosure, Dysfunction, Eligibility, ISP, Location, Subscription, Technology, User } from "../types.js";

export const resolvers = {
    Query: {
        // Dysfunctions
        async dysfunctions(context: any) {
            return context.dataSources.dysfunctionDb.getDysfunctions();
        },
        async dysfunction({ id }: Dysfunction, context: any) {
            return context.dataSources.dysfunctionDb.getDysfunctionById(id);
        },
        
        // Eligibilities
        async eligibilities(context: any) {
            return context.dataSources.eligibilityDb.getEligibilities();
        },
        async eligibility({ id }: Eligibility, context: any) {
            return context.dataSources.eligibilityDb.getEligibilityById(id);
        },

        // CopperClosures
        async copperClosures(context: any) {
            return context.dataSources.copperClosureDb.getCopperClosures();
        },
        async copperClosure({ id }: CopperClosure, context: any) {
            return context.dataSources.copperClosureDb.getCopperClosureById(id);
        },

        // Users
        async users(context: any) {
            return context.dataSources.userDb.getUsers();
        },
        async user({ id }: User, context: any) {
            return context.dataSources.userDb.getUserById(id);
        },

        // Subscriptions
        async subscriptions(context: any) {
            return context.dataSources.subscriptionDb.getSubscriptions();
        },
        async subscription({ id }: Subscription, context: any) {
            return context.dataSources.subscriptionDb.getSubscriptionById(id);
        },
    },
    
    Mutation: {
        // Dysfunctions
        async createDysfunction({ connectionId, reason, startDate, endDate, statusId }: Dysfunction, context: any) {
            return context.dataSources.dysfunctionDb.createDysfunction({ connectionId, reason, startDate, endDate, statusId });
        },
        async updateDysfunction({ id, connectionId, reason, startDate, endDate, statusId }: Dysfunction, context: any) {
            return context.dataSources.dysfunctionDb.updateDysfunction({ id, connectionId, reason, startDate, endDate, statusId });
        },
        async deleteDysfunction({ id } : Dysfunction, context: any) {
            return context.dataSources.dysfunctionDb.deleteDysfunction(id);
        },

        // Eligibilities
        async createEligibility({ technologyId, userId, supplierId, statusId }: Eligibility, context: any) {
            return context.dataSources.eligibilityDb.createEligibility({ technologyId, userId, supplierId, statusId });
        },
        async updateEligibility({ id, technologyId, userId, supplierId, statusId }: Eligibility, context: any) {
            return context.dataSources.eligibilityDb.updateEligibility({ id, technologyId, userId, supplierId, statusId });
        },
        async deleteEligibility({ id }: Eligibility, context: any) {
            return context.dataSources.eligibilityDb.deleteEligibility(id);
        },

        // CopperClosures
        async createCopperClosure({ locationId, startDate, endDate, statusId }: CopperClosure, context: any) {
            return context.dataSources.copperClosureDb.createCopperClosure({ locationId, startDate, endDate, statusId });
        },
        async updateCopperClosure({ id, locationId, startDate, endDate, statusId }: CopperClosure, context: any) {
            return context.dataSources.copperClosureDb.updateCopperClosure({ id, locationId, startDate, endDate, statusId });
        },
        async deleteCopperClosure({ id }: CopperClosure, context: any) {
            return context.dataSources.copperClosureDb.deleteCopperClosure(id);
        },

        // Users
        async createUser({ name, email, locationId }: User, context: any) {
            return context.dataSources.userDb.createUser({ name, email, locationId });
        },
        async updateUser({ id, name, email, locationId }: User, context: any) {
            return context.dataSources.userDb.updateUser({ id, name, email, locationId });
        },
        async deleteUser({ id }: User, context: any) {
            return context.dataSources.userDb.deleteUser(id);
        },

        // Subscriptions
        async createSubscription({ ownerId, supplierId, statusId }: Subscription, context: any) {
            return context.dataSources.subscriptionDb.createSubscription({ ownerId, supplierId, statusId });
        },
        async updateSubscription({ id, ownerId, supplierId, statusId }: Subscription, context: any) {
            return context.dataSources.subscriptionDb.updateSubscription({ id, ownerId, supplierId, statusId });
        },
        async deleteSubscription({ id }: Subscription, context: any) {
            return context.dataSources.subscriptionDb.deleteSubscription(id);
        },
    },
};