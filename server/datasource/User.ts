import { User } from "../types.js";
import DataLoader from "dataloader";

export class UserDataSource {
    private dbConnection: any;
    private userLoader: DataLoader<any, User>;

    constructor(dbConnection: any) {
        this.dbConnection = dbConnection;
        this.userLoader = new DataLoader(async (userIds: number[]) => {
            const users = await this.dbConnection.user.findMany({
                where: {
                    id: {
                        in: userIds,
                    },
                },
            });
            return userIds.map((userId: number) =>
                users.find((user: User) => user.id === userId)
            );
        });
    }

    async getUserById({ id }: User): Promise<User> {
        return this.userLoader.load(id);
    }

    async getUsers(): Promise<User[]> {
        return this.dbConnection.user.findMany();
    }

    async createUser({ name, email, locationId }: User): Promise<User> {
        return this.dbConnection.user.create({
            data: {
                name,
                email,
                locationId
            },
        });
    }

    async updateUser({ id, name, email, locationId }: User): Promise<User> {
        return this.dbConnection.user.update({
            where: {
                id,
            },
            data: {
                name,
                email,
                locationId
            },
        });
    }

    async deleteUser({ id }: User): Promise<User> {
        return this.dbConnection.user.delete({
            where: {
                id: id,
            },
        });
    }
}