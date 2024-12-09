import {
  brokerPrototype,
  connectionStatusFlags,
  dataBrokerPrototype,
} from "@interfaces/databroker";
import { insertMessage, targetRecord } from "@interfaces/records";
import e from "express";

import { EventEmitter } from "stream";

export class DataBroker extends EventEmitter implements dataBrokerPrototype {
  broker: brokerPrototype;
  connected: connectionStatusFlags = connectionStatusFlags.DISCONNECTED;

  constructor(broker: brokerPrototype) {
    super();
    this.broker = broker;
  }

  connect() {
    if (!this.getConnectionStatus()) {
      try {
        this.broker.connect();
        this.connected = this.broker.getConnectionStatus();

        if (this.getConnectionStatus()) {
          this.emit("connected");
        } else {
          this.emit("disconnected");
        }
      } catch (error) {
        this.connected = connectionStatusFlags.DISCONNECTED;

        this.emit("disconnected", error);
        return this.getConnectionStatus();
      }
    }

    return this.getConnectionStatus();
  }

  disconnect() {
    this.broker.disconnect();
      this.emit("disconnected");
      return this.getConnectionStatus();
  }

  getConnectionStatus() {
    return this.connected;
  }

  async getAllRecords()  {
    this.assertConnection();
    return this.broker.getAllRecords();
  }

  async getRecordsByUserId(id: number)  {
    this.assertConnection();
    return this.broker.getRecordsByUserId(id);
  }

  getRecordsByOrderId(id: number): Promise<targetRecord[] | []> {
    this.assertConnection();
    return this.broker.getRecordsByOrderId(id);
  }

  async getRecordsByDateInterval(
    startDate: string,
    endDate: string
  ) {
    this.assertConnection();
    if (startDate === undefined || endDate === undefined) {
      throw new Error("Invalid date interval");
    } else if (new Date(startDate) >= new Date(endDate)) {
      throw new Error("Invalid date interval");
    }
    return this.broker.getRecordsByDateInterval(startDate, endDate);
  }

  async appendRecord(record: targetRecord): Promise<insertMessage> {
    this.assertConnection();
   return await this.broker.appendRecord(record);
  }
  async appendRecords(records: targetRecord[]): Promise<insertMessage> {
    this.assertConnection();
    return await this.broker.appendRecords(records);
  }


  assertConnection() {
    this.connected = this.broker.getConnectionStatus();
    if (!this.getConnectionStatus()) {
      console.log("Database connection offline");
      this.broker.connect();
    }
  }

}
