import { Prisma } from "@prisma/client";

const dysfunctions = Prisma.validator<Prisma.DysfunctionDefaultArgs>()({});

export type Dysfunction = Prisma.DysfunctionGetPayload<typeof dysfunctions>;

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