import { assert } from "console";
import { EventEmitter } from "stream";

export interface connectionOptions {
  host: string;
  port: number;
  user: string;
  password?: string;
  database: string;
  collection?: string;
}

export enum connectionStatusFlags {
  CONNECTED = 1,
  DISCONNECTED = 0,
}

export interface brokerPrototype extends EventEmitter {
  options: connectionOptions;
  connection: any;
  connectionPool?: any;
  connected: connectionStatusFlags;

  connect(): connectionStatusFlags;
  disconnect(): any;
  getConnectionStatus(): connectionStatusFlags;
  getAllRecords(): object;
  getRecordsById(id: string): object;
  getRecordsByDateInterval(startDate: string, endDate: string): object;
}

export interface dataBrokerPrototype {
  broker: brokerPrototype;

  connect(): connectionStatusFlags;
  disconnect(): connectionStatusFlags;
  getConnectionStatus(): connectionStatusFlags;
  assertConnection(): void;
  getAllRecords(): object;
  getRecordsById(id: string): object;
  getRecordsByDateInterval(startDate: string, endDate: string): object;
}
