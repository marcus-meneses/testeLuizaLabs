import { targetRecordSchema } from "./schemas/schemas";
import {
  brokerPrototype,
  connectionOptions,
  connectionStatusFlags,
} from "@interfaces/databroker";
import { insertMessage, targetRecord } from "@interfaces/records";
import mongoose, { set } from "mongoose";
import { EventEmitter } from "stream";

export class MongoDBBroker extends EventEmitter implements brokerPrototype {
  options: connectionOptions;
  connection: mongoose.Connection | null = null;

  constructor(options: connectionOptions) {
    super();
    this.options = options;
  }

  connect() {
    if (!this.getConnectionStatus()) {
      console.log("Establishing connection to MongoDB server...");

      try {
        mongoose.connection.on("connected", () => {
          this.connection = mongoose.connection;
          console.log("Connected to MongoDB");
        });

        mongoose.connect(
          `mongodb://${this.options.host}:${this.options.port}/${this.options.database}`,
          { serverSelectionTimeoutMS: 10000 }
        );
      } catch (error) {}
    } else {
      console.log("Connection to MongoDB already established");
    }

    return this.getConnectionStatus();
  }

  disconnect() {
    mongoose.connection.removeAllListeners();
    mongoose.connection.destroy();
    this.connection?.destroy();
    console.log("Disconnected from MongoDB");
    return this.getConnectionStatus();
  }

  getConnectionStatus(): connectionStatusFlags {
    return this.connection? connectionStatusFlags.CONNECTED : connectionStatusFlags.DISCONNECTED;
  }

  async getAllRecords():  Promise<targetRecord[] | []> {
    const mongooseModel = await mongoose.model("order", targetRecordSchema);
    return mongooseModel.find({});
  }

  async getRecordsById(id: number):  Promise<targetRecord[] | []> {
    const mongooseModel = await mongoose.model("order", targetRecordSchema);
    return mongooseModel.find({ id: id });
  }

  getRecordsByUserId(id: number): Promise<targetRecord[] | []> {
    throw new Error("Method not implemented.");
  }
  getRecordsByOrderId(id: number): Promise<targetRecord[] | []> {
    throw new Error("Method not implemented.");
  }

  async getRecordsByDateInterval(
    startDate: string,
    endDate: string
  ):  Promise<targetRecord[] | []> {
    const mongooseModel = await mongoose.model("order", targetRecordSchema);
    return mongooseModel.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });
  }


  appendRecord(record: targetRecord): insertMessage {
    throw new Error("Method not implemented.");
  }
  appendRecords(records: targetRecord[]): insertMessage {
    throw new Error("Method not implemented.");
  }
}
