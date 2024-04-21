import { randomInt } from "crypto";

const locationSchema = `
Location {
    address
    city
    id
    postalCode
}
`;

const userSchema = `
user {
    name
    id
    email
    ${locationSchema}
}
`;

const technologySchema = `
technology {
    debitMax
    debitMin
    id
    name
}
`;

const supplierSchema = `
supplier {
    id
    name
}
`;

const subscriptionSchema = `
subscription {
    id
    owner {
        ${userSchema}
    }
    ${supplierSchema}
    status
}
`;

const connectionSchema = `
connection {
    ${technologySchema}
    ${subscriptionSchema}
    id
}
`;

const eligibilitySchema = `
eligibilities {
    ${userSchema}
    ${technologySchema}
    ${supplierSchema}
    id
    status
}
`;

const dysfunctionSchema = `
dysfunctions {
    status
    startDate
    reason
    id
    endDate
    ${connectionSchema}
}
`;

const copperClosureSchema = `
copperClosures {
    endDate
    id
    startDate
    status
    ${locationSchema}
}
`;

export function getRandomQuerySchema(seed: string) {
    return getQuerySchema(getRandomSchemas(seed));
}

function getQuerySchema(injectedSchema: string[]) {
    return `
    query Users {
        ${injectedSchema.join('\n')}
    }
    `;
}

function getRandomSchemas(seed: string) {
    const schemas = [
        locationSchema,
        userSchema,
        technologySchema,
        supplierSchema,
        subscriptionSchema,
        connectionSchema,
        eligibilitySchema,
        dysfunctionSchema,
        copperClosureSchema
    ];

    const randomSchemas = [];
    for (let i = 0; i < Math.max(seed.length, 4); i++) {
        const index = randomInt(seed.length + i);
        randomSchemas.push(schemas[index]);
        // Remove the schema from the list so it doesn't get repeated
        schemas.splice(index, 1);
    }

    return randomSchemas;
}