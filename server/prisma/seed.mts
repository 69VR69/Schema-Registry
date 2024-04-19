/**
 * ! Executing this script will delete all data in your database and seed it with 10 versions.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.mts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from "@snaplet/seed";

const seed = await createSeedClient();

console.log("Seeding started ")

// Truncate all tables in the database
seed.$resetDatabase();
console.log("Database truncated")

// Seed DysfunctionStatus
const { DysfunctionStatus } = await seed.DysfunctionStatus(
    [
        { code: "OPEN" },
        { code: "CLOSED" },
        { code: "IN_PROGRESS" },
        { code: "PENDING" },
        { code: "CANCELLED" },
        { code: "RESOLVED" },
        { code: "REJECTED" },
        { code: "UNKNOWN" }
    ]
);

// Seed SubscriptionStatus
const { SubscriptionStatus } = await seed.SubscriptionStatus(
    [
        { code: "ACTIVE" },
        { code: "INACTIVE" },
        { code: "PENDING" },
        { code: "CANCELLED" },
        { code: "SUSPENDED" },
        { code: "UNKNOWN" }
    ]
);

// Seed EligibilityStatus
const { EligibilityStatus } = await seed.EligibilityStatus(
    [
        { code: "ELIGIBLE" },
        { code: "INELIGIBLE" },
        { code: "PENDING" },
        { code: "UNKNOWN" }
    ]
);

// Seed CopperClosureStatus
const { CopperClosureStatus } = await seed.CopperClosureStatus(
    [
        { code: "CLOSED" },
        { code: "OPEN" },
        { code: "IN_PROGRESS" },
        { code: "PENDING" },
        { code: "CANCELLED" },
        { code: "UNKNOWN" }
    ]
);

// Seed ISP
const { ISP } = await seed.ISP((x) => x(2));

// Seed Location
const { Location } = await seed.Location((x) => x(5));

// Seed User
const { User } = await seed.User((x) => x(5, {
  // each user has between 1 and 2 subscriptions
  Subscription: (x) => x({ min: 1, max: 2 }),
  // each user has between 1 and 2 eligibilities
  Eligibility: (x) => x({ min: 1, max: 2 }),
}));

// Seed Technology
const { Technology } = await seed.Technology((x) => x(2));

// Seed Connection
const { Connection } = await seed.Connection((x) => x(5, {
  // each connection has between 1 and 2 dysfunctions
  Dysfunction: (x) => x({ min: 1, max: 2 }),
}));

// Seed Dysfunction
const {Dysfunction} = await seed.Dysfunction((x) => 
    x(10, 
    ({index}) => ({
            connectionId: Connection[index].id,
            statusId: DysfunctionStatus[Math.floor(Math.random() * DysfunctionStatus.length)].code
    })
));

// Seed Eligibility
const { Eligibility } = await seed.Eligibility((x) => x(10, 
    ({index}) => ({
        userId: User[index].id,
        statusId: EligibilityStatus[Math.floor(Math.random() * EligibilityStatus.length)].code
    })
));

// Seed CopperClosure
const { CopperClosure } = await seed.CopperClosure((x) => x(10,
    ({index}) => ({
        connectionId: Connection[index].id,
        statusId: CopperClosureStatus[Math.floor(Math.random() * CopperClosureStatus.length)].code
    })
));

console.log("Seeding completed")


process.exit();