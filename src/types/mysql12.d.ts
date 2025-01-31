// Déclaration de types personnalisée pour MySQL2
declare module "mysql2/promise" {
  import { ConnectionOptions, Pool, PoolOptions, QueryOptions } from "mysql2";

  export interface Connection {
    execute(sql: string, values?: any): Promise<[any[], any]>;
    query(sql: string, values?: any): Promise<[any[], any]>;
    release(): void;
  }

  export interface Pool {
    getConnection(): Promise<Connection>;
    execute(sql: string, values?: any): Promise<[any[], any]>;
    query(sql: string, values?: any): Promise<[any[], any]>;
    end(): Promise<void>;
  }

  export function createPool(config: PoolOptions): Pool;
  export function createConnection(
    config: ConnectionOptions
  ): Promise<Connection>;
}
