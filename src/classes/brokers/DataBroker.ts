import {
  brokerPrototype,
  connectionStatusFlags,
  dataBrokerPrototype,
} from "@interfaces/databroker";

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

  async getAllRecords(): Promise<object> {
    this.assertConnection();
    return this.broker.getAllRecords();
  }

  async getRecordsById(id: string): Promise<object> {
    this.assertConnection();
    return this.broker.getRecordsById(id);
  }

  async getRecordsByDateInterval(
    startDate: string,
    endDate: string
  ): Promise<object> {
    this.assertConnection();
    return this.broker.getRecordsByDateInterval(startDate, endDate);
  }

  assertConnection() {
    this.connected = this.broker.getConnectionStatus();
    if (!this.getConnectionStatus()) {
      console.log("Database connection offline");
      this.broker.connect();
    }
  }
}
