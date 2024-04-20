import { RegistryRepository } from "./RegistryRepository.js";
import { Schema, Service, SchemaWithServiceAndVersion, SchemaWithVersion } from "../types.js";

export class RegistryService {
    repository: RegistryRepository;
    constructor(dbConnection: any) {
        this.repository = new RegistryRepository(dbConnection);
    }

    async getSchemas() {
        return this.repository.getAllSchemas();
    }

    async getSchema(id: number) {
        return this.repository.getSchemaById(id);
    }

    async getSchemaWithVersion(id: number) : Promise<SchemaWithVersion>
    {
        const schema = await this.repository.getSchemaById(id);
        const version = await this.repository.getVersionById(schema.versionId);
        return { ...schema, versions: version };
    }

    async addService({ name }: Service) {
        return this.repository.addNewService({ name, isActive: true });
    }

    async addSchema({ name, serviceId, versions: { version, content }, isActive }: SchemaWithServiceAndVersion) {
        // Create a new version
        const newVersion = await this.repository.addNewVersion({ version, content });
        return this.repository.createSchema({ name, serviceId, versionId: newVersion.id, isActive });
    }

    async updateSchema({ id, name, serviceId, versionId, isActive }: Schema) {
        // Create a new version
        if (versionId) {
            const schema = await this.repository.getSchemaById(id);
            const version = await this.repository.getVersionById(schema.versionId);
            await this.repository.updateVersion({ id: version.id, version: version.version + 1 });
        }
        else
            await this.repository.addNewVersion({ version: 1, content: "" });

        return this.repository.updateSchema({ id, name, serviceId, versionId, isActive });
    }

    async revokeSchema({ id }: Schema) {
        // Delete the related versions
        const schema = await this.repository.getSchemaById(id);
        await this.repository.deleteVersion({ id: schema.versionId });

        return this.repository.deleteSchema({ id });
    }
}