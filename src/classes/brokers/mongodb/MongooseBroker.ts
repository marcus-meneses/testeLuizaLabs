import { targetRecordSchema } from "./schemas/schemas";
import {
  brokerPrototype,
  connectionOptions,
  connectionStatusFlags,
} from "@interfaces/databroker";
import mongoose, { set } from "mongoose";
import { EventEmitter } from "stream";

export class MongooseBroker extends EventEmitter implements brokerPrototype {
  options: connectionOptions;
  connection: mongoose.Connection | null = null;
  connected: connectionStatusFlags = connectionStatusFlags.DISCONNECTED;

  constructor(options: connectionOptions) {
    super();
    this.options = options;
  }

  connect() {
    if (!this.getConnectionStatus()) {
      console.log("Establishing connection to MongoDB server...");

      mongoose.connection.on("connected", () => {
        this.connection = mongoose.connection;
        this.connected = connectionStatusFlags.CONNECTED;
        console.log("Connected to MongoDB");
      });

      mongoose.connection.on("disconnected", () => {
        this.connection = null;
        this.connected = connectionStatusFlags.DISCONNECTED;
          console.log("Disconnected from MongoDB");

          setTimeout(() => {
              this.connect();
          }, 5000);

      });

      mongoose.connect(
        `mongodb://${this.options.host}:${this.options.port}/${this.options.database}`,
        { serverSelectionTimeoutMS: 10000 }
      );
    } else {
      console.log("Connection to MongoDB already established");
    }

    return this.getConnectionStatus();
  }

  async disconnect() {
    await mongoose.connection.removeAllListeners();
    mongoose.connection.destroy();
    this.connection?.destroy();
      this.connected = connectionStatusFlags.DISCONNECTED;
      console.log("Disconnected from MongoDB");

  }

  getConnectionStatus(): connectionStatusFlags {
    return this.connected;
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
