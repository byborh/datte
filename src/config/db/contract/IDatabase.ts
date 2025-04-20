// Contract for the database
export interface IDatabase {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
    getDataSource(): any;
}