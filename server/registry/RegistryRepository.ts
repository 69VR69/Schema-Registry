import { Prisma } from "@prisma/client";
import { NewService, NewVersion, Schema, Service, Version } from "../types.js";

export class RegistryRepository {
    dbConnection: any;
    constructor(dbConnection: any) {
        this.dbConnection = dbConnection;
    }

    async getSchemaById(id: number) : Promise<Schema>{
        return this.dbConnection.schema.findUnique({
            where: {
                id: id,
            },
        });
    }

    async getSchemasByServiceId(serviceId: number) : Promise<Schema[]>{
        return this.dbConnection.schema.findMany({
            where: {
                serviceId: serviceId,
            },
        });
    }

    async createSchema({ name, serviceId, versionId, isActive }: Prisma.SchemaCreateArgs["data"]): Promise<Schema> {
        return this.dbConnection.schema.create({
            data: {
                name,
                serviceId,
                versionId,
                isActive
            },
        });
    }

    async updateSchema({ id, name, serviceId, versionId, isActive }: Prisma.SchemaUpdateArgs["data"]): Promise<Schema> {
        return this.dbConnection.schema.update({
            where: {
                id,
            },
            data: {
                name,
                serviceId,
                versionId,
                isActive
            },
        });
    }

    async deleteSchema({ id }: Prisma.SchemaDeleteArgs["where"]): Promise<Schema> {
        return this.dbConnection.schema.delete({
            where: {
                id: id,
            },
        });
    }

    async updateSchemaVersion({ id, version }: Version): Promise<Schema> {
        return this.dbConnection.schema.update({
            where: {
                id,
            },
            data: {
                version
            },
        });
    }

    async getVersionById(id: number): Promise<Version> {
        return this.dbConnection.schemaVersion.findUnique({
            where: {
                id: id,
            },
        });
    }

    async addNewVersion({ version, content }: NewVersion["data"]): Promise<Version> {
        return this.dbConnection.schemaVersion.create({
            data: {
                version,
                content
            }
        });
    }

    async updateVersion({ id, version }: Prisma.SchemaVersionUpdateArgs["data"]): Promise<Version> {
        return this.dbConnection.schemaVersion.update({
            where: {
                id,
            },
            data: {
                version
            },
        });
    }

    async deleteVersion({ id }: Prisma.SchemaVersionDeleteArgs["where"]): Promise<Version> {
        return this.dbConnection.schemaVersion.delete({
            where: {
                id: id
            }
        });
    }
    
    async addNewService({ name, isActive }: NewService["data"]): Promise<Service> {
        return this.dbConnection.service.create({
            data: {
                name,
                isActive
            }
        });
    }

    async deleteService({ id }: Prisma.ServiceDeleteArgs["where"]): Promise<Service> {
        return this.dbConnection.service.delete({
            where: {
                id: id
            }
        });
    }

}