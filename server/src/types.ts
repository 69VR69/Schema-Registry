import { Prisma } from "@prisma/client";

const dysfunctions = Prisma.validator<Prisma.DysfunctionDefaultArgs>()({});

export type Dysfunction = Prisma.DysfunctionGetPayload<typeof dysfunctions>;