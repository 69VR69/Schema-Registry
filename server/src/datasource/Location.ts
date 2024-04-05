import { Location } from "../types";
import DataLoader from "dataloader";

export class LocationDataSource {
    private dbConnection: any;
    private locationLoader: DataLoader<any, Location>;

    constructor(dbConnection: any) {
        this.dbConnection = dbConnection;
        this.locationLoader = new DataLoader(async (locationIds: String[]) => {
            const locations = await this.dbConnection.location.findMany({
                where: {
                    id: {
                        in: locationIds,
                    },
                },
            });
            return locationIds.map((locationId: String) =>
                locations.find((location: Location) => location.id === locationId)
            );
        });
    }

    async getLocationById({ id }: Location): Promise<Location> {
        return this.locationLoader.load(id);
    }

    async getLocations(): Promise<Location[]> {
        return this.dbConnection.location.findMany();
    }

    async createLocation({ address, postalCode, city }: Location): Promise<Location> {
        return this.dbConnection.location.create({
            data: {
                address,
                postalCode,
                city
            },
        });
    }

    async updateLocation({ id, address, postalCode, city }: Location): Promise<Location> {
        return this.dbConnection.location.update({
            where: {
                id,
            },
            data: {
                address,
                postalCode,
                city
            },
        });
    }

    async deleteLocation({ id }: Location): Promise<Location> {
        return this.dbConnection.location.delete({
            where: {
                id: id,
            },
        });
    }
}