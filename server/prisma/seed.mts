/**
 * ! Executing this script will delete all data in your database and seed it with 10 versions.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.mts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from "@snaplet/seed";
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

async function main() {
    await createSeedClient()
    .then((seed) => {
        console.log("Seeding started ")

        // Truncate all tables in the database
        seed.$resetDatabase();
        console.log("Database truncated")

        console.log('Static Seeding started')
        const dysfunctionStatus = getDysfunctionStatus();
        const subscriptionStatus = getSubscriptionStatus();
        const eligibilityStatus = getEligibilityStatus();
        const copperClosuresStatus = getCopperClosuresStatus();

        Promise.all([dysfunctionStatus, subscriptionStatus, eligibilityStatus, copperClosuresStatus]);

        // Dynamic seeding
        console.log("Dynamyc Seeding started")

        seed.Dysfunction((x) => x(10));
        console.log("Dysfunctions : " + seed.$store.Dysfunction);
        seed.CopperClosure((x) => x(10));
        console.log("CopperClosures : " + seed.$store.CopperClosure);
        seed.Eligibility((x) => x(10));
        console.log("Eligibilities : " + seed.$store.Eligibility);

        console.log("Dynamyc Seeding completed")
    });
  
}

async function getDysfunctionStatus()
{
    const dysfunctionStatus = [
        { code: "OPEN" },
        { code: "CLOSED" },
        { code: "IN_PROGRESS" },
        { code: "PENDING" },
        { code: "CANCELLED" },
        { code: "RESOLVED" },
        { code: "REJECTED" },
        { code: "UNKNOWN" }
    ]
    
    for (const ds of dysfunctionStatus) {
        await prisma.dysfunctionStatus.create({
        data: ds
        })
    }
}

async function getSubscriptionStatus()
{
    const subscriptionStatus = [
        { code: "ACTIVE" },
        { code: "INACTIVE" },
        { code: "PENDING" },
        { code: "CANCELLED" },
        { code: "SUSPENDED" },
        { code: "UNKNOWN"}
    ]
    
    for (const ss of subscriptionStatus) {
        await prisma.subscriptionStatus.create({
        data: ss
        })
    }
}

async function getEligibilityStatus()
{
    const eligibilityStatus = [
        { code: "ELIGIBLE" },
        { code: "INELIGIBLE" },
        { code: "PENDING" },
        { code: "UNKNOWN" }
    ]
    
    for (const es of eligibilityStatus) {
        await prisma.eligibilityStatus.create({
        data: es
        })
    }
}

async function getCopperClosuresStatus()
{
    const copperClosuresStatus = [
        { code: "CLOSED" },
        { code: "OPEN" },
        { code: "IN_PROGRESS" },
        { code: "PENDING" },
        { code: "CANCELLED" },
        { code: "UNKNOWN" }
    ]
    
    for (const ccs of copperClosuresStatus) {
        await prisma.copperClosureStatus.create({
        data: ccs
        })
    }
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('Static Seeding completed')
  });

process.exit();