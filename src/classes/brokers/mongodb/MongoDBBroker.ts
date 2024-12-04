import { targetRecordSchema } from "./schemas/schemas";
import {
  brokerPrototype,
  connectionOptions,
  connectionStatusFlags,
} from "@interfaces/databroker";
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

  async disconnect() {
    await mongoose.connection.removeAllListeners();
    mongoose.connection.destroy();
    this.connection?.destroy();
    console.log("Disconnected from MongoDB");
    return this.getConnectionStatus();
  }

  getConnectionStatus(): connectionStatusFlags {
    return this.connection? connectionStatusFlags.CONNECTED : connectionStatusFlags.DISCONNECTED;
  }

  async getAllRecords(): Promise<object> {
    const targetRecord = await mongoose.model("order", targetRecordSchema);
    return targetRecord.find({});
  }

  async getRecordsById(id: string): Promise<object> {
    const targetRecord = await mongoose.model("order", targetRecordSchema);
    return targetRecord.find({ _id: id });
  }

  async getRecordsByDateInterval(
    startDate: string,
    endDate: string
  ): Promise<object> {
    const targetRecord = await mongoose.model("order", targetRecordSchema);
    return targetRecord.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });
  }
}
