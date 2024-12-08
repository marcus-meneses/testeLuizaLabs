import { EventEmitter } from "stream";
import { insertMessage, targetRecord } from "./records";

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

export interface commonParameters extends EventEmitter {

  connect(): connectionStatusFlags;
  disconnect(): connectionStatusFlags;
  getConnectionStatus(): connectionStatusFlags;
  getAllRecords(): Promise<targetRecord[] | []>;
  getRecordsByUserId(id: number):  Promise<targetRecord[] | []>;
  getRecordsByOrderId(id: number):  Promise<targetRecord[] | []>;
  getRecordsByDateInterval(startDate: string, endDate: string):  Promise<targetRecord[] | []>;
  appendRecord(record: targetRecord): insertMessage;
  appendRecords(records: targetRecord[]): insertMessage;
}

export interface brokerPrototype extends commonParameters {
  options: connectionOptions;
  connection: any;


}

export interface dataBrokerPrototype extends commonParameters {
  broker: brokerPrototype;
  connected: connectionStatusFlags;

  assertConnection(): void;
}
