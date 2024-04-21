import { createSeedClient } from "@snaplet/seed";
import { getRandomQuerySchema } from "./jsonGraphqlSchema.js";

const seed = await createSeedClient();

console.log("Seeding started ")

// Truncate all tables in the database
await seed.$resetDatabase();
console.log("Database truncated")

// Seed DysfunctionStatus
await seed.DysfunctionStatus(
    [
        { code: "OPEN" },
        { code: "CLOSED" },
        { code: "IN_PROGRESS" },
        { code: "PENDING" },
        { code: "CANCELLED" },
        { code: "RESOLVED" },
        { code: "REJECTED" },
        { code: "UNKNOWN" }
    ], { connect: true }
);

// Seed SubscriptionStatus
await seed.SubscriptionStatus(
    [
        { code: "ACTIVE" },
        { code: "INACTIVE" },
        { code: "PENDING" },
        { code: "CANCELLED" },
        { code: "SUSPENDED" },
        { code: "UNKNOWN" }
    ], { connect: true }
);

// Seed EligibilityStatus
await seed.EligibilityStatus(
    [
        { code: "ELIGIBLE" },
        { code: "INELIGIBLE" },
        { code: "PENDING" },
        { code: "UNKNOWN" }
    ], { connect: true }
);

// Seed CopperClosureStatus
await seed.CopperClosureStatus(
    [
        { code: "CLOSED" },
        { code: "OPEN" },
        { code: "IN_PROGRESS" },
        { code: "PENDING" },
        { code: "CANCELLED" },
        { code: "UNKNOWN" }
    ], { connect: true }
);

// Seed ISP
await seed.ISP((x) => x(5), { connect: true });
await seed.Location((x) => x(10), { connect: true });
await seed.User((x) => x(30), { connect: true });
await seed.Technology((x) => x(5), { connect: true });
await seed.Connection((x) => x(45), { connect: true });
await seed.Dysfunction((x) => x(25), { connect: true });
await seed.Eligibility((x) => x(50), { connect: true });
await seed.CopperClosure((x) => x(23), { connect: true });

// Seed Service
await seed.Service((x) => x(5), { connect: true });
// Seed schemaVersion but content will be some GraphQL Json, sub-parts of the graphqlSchema using the seed in the getRandomQuerySchema function
await seed.SchemaVersion((x) => x(7,
    ({ seed }) => ({ content: getRandomQuerySchema(seed) })
), { connect: true });
await seed.Schema((x) => x(7), { connect: true });

console.log("Seeding completed")

process.exit();