import DataLoader from "dataloader";

export class ConnectionDataSource {
    private dbConnection: any;
  
    constructor(dbConnection: any) {
      this.dbConnection = dbConnection;
    }
    
    private connectionLoader = new DataLoader(async (residenceIds: any) => {
      const connections = await this.dbConnection.connection.findMany({
        where: {
          residenceId: {
            in: residenceIds,
          },
        },
      });
      return residenceIds.map((residenceId: any) =>
        connections.filter((connection: any) => connection.residenceId === residenceId)
      );
    });

    async getConnectionByResidenceId(residenceId: any) {
      return this.connectionLoader.load(residenceId);
    }
  }