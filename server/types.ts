
import { Prisma } from "@prisma/client";

const dysfunctions = Prisma.validator<Prisma.DysfunctionDefaultArgs>()({});
export type Dysfunction = Prisma.DysfunctionGetPayload<typeof dysfunctions>;

const connections = Prisma.validator<Prisma.ConnectionDefaultArgs>()({});
export type Connection = Prisma.ConnectionGetPayload<typeof connections>;

const eligibilities = Prisma.validator<Prisma.EligibilityDefaultArgs>()({});
export type Eligibility = Prisma.EligibilityGetPayload<typeof eligibilities>;

const technologies = Prisma.validator<Prisma.TechnologyDefaultArgs>()({});
export type Technology = Prisma.TechnologyGetPayload<typeof technologies>;

const locations = Prisma.validator<Prisma.LocationDefaultArgs>()({});
export type Location = Prisma.LocationGetPayload<typeof locations>;

const users = Prisma.validator<Prisma.UserDefaultArgs>()({});
export type User = Prisma.UserGetPayload<typeof users>;

const isps = Prisma.validator<Prisma.ISPDefaultArgs>()({});
export type ISP = Prisma.ISPGetPayload<typeof isps>;

const subscriptions = Prisma.validator<Prisma.SubscriptionDefaultArgs>()({});
export type Subscription = Prisma.SubscriptionGetPayload<typeof subscriptions>;

const copperClosures = Prisma.validator<Prisma.CopperClosureDefaultArgs>()({});
export type CopperClosure = Prisma.CopperClosureGetPayload<typeof copperClosures>;

// Schema Registry
const schemas = Prisma.validator<Prisma.SchemaDefaultArgs>()({});
export type Schema = Prisma.SchemaGetPayload<typeof schemas>;
export type NewSchema = Prisma.SchemaCreateArgs;

const services = Prisma.validator<Prisma.ServiceDefaultArgs>()({});
export type Service = Prisma.ServiceGetPayload<typeof services>;
export type NewService = Prisma.ServiceCreateArgs;

const versions = Prisma.validator<Prisma.SchemaVersionDefaultArgs>()({});
export type Version = Prisma.SchemaVersionGetPayload<typeof versions>;
export type NewVersion = Prisma.SchemaVersionCreateArgs;

const schemaWithServiceAndVersion = Prisma.validator<Prisma.SchemaDefaultArgs>()({
    include: {
        service: true,
        versions: true
    }
});
export type SchemaWithServiceAndVersion = Prisma.SchemaGetPayload<typeof schemaWithServiceAndVersion>;

const schemaWithVersion = Prisma.validator<Prisma.SchemaDefaultArgs>()({
    include: {
        versions: true
    }
});
export type SchemaWithVersion = Prisma.SchemaGetPayload<typeof schemaWithVersion>;