import { targetRecordSchema } from "./schemas/schemas";
import {
  brokerPrototype,
  connectionOptions,
  connectionStatusFlags,
} from "@interfaces/databroker";
import { insertMessage, targetRecord } from "@interfaces/records";
import mongoose, { set } from "mongoose";
import { EventEmitter } from "stream";

const defaultOptions: connectionOptions = {
  host: "localhost",
  port: 27017,
  database: "luizaLabs",
  user: "",
  password: "",
  collection: "orders",
};

export class MongoDBBroker extends EventEmitter implements brokerPrototype {
  options: connectionOptions;
  connection: mongoose.Connection | null = null;

  constructor(options: connectionOptions = defaultOptions) {
    super();
    this.options = options;
  }

  connect() {
    if (!this.getConnectionStatus()) {
      console.log("Establishing connection to MongoDB server...");

      mongoose.connection.on("connected", () => {
        this.connection = mongoose.connection;
        console.log("Connected to MongoDB");
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

  disconnect() {
    mongoose.connection.removeAllListeners();
    mongoose.connection.destroy();
    this.connection?.destroy();
    console.log("Disconnected from MongoDB");
    return this.getConnectionStatus();
  }

  getConnectionStatus(): connectionStatusFlags {
    return this.connection
      ? connectionStatusFlags.CONNECTED
      : connectionStatusFlags.DISCONNECTED;
  }

  async getAllRecords(): Promise<targetRecord[] | []> {
    const mongooseModel = mongoose.model("user", targetRecordSchema);
    return mongooseModel
      .find({}, { _id: 0, __v: 0, "orders._id": 0, "orders.products._id": 0 })
      .sort({ user_id: 1 });
  }

  getRecordsByUserId(id: number): Promise<targetRecord[] | []> {
    const mongooseModel = mongoose.model("user", targetRecordSchema);
    return mongooseModel
      .find(
        { user_id: id },
        { _id: 0, __v: 0, "orders._id": 0, "orders.products._id": 0 }
      )
      .sort({ user_id: 1 });
  }

  getRecordsByOrderId(id: number): Promise<targetRecord[] | []> {
    const mongooseModel = mongoose.model("user", targetRecordSchema);

    return mongooseModel
      .aggregate([
        {
          $unwind: "$orders",
        },
        {
          $match: {
            "orders.order_id": id,
          },
        },
        {
          $group: {
            _id: "$_id",
            user_id: { $first: "$user_id" },
            name: { $first: "$name" },
            orders: { $push: "$orders" },
          },
        },
        {
          $project: {
            _id: 0,
            __v: 0,
            "orders._id": 0,
            "orders.products._id": 0,
          },
        },
      ])
      .sort({ user_id: 1 });
  }

  async getRecordsByDateInterval(
    startDate: string,
    endDate: string
  ): Promise<targetRecord[] | []> {
    const mongooseModel = await mongoose.model("user", targetRecordSchema);

    return mongooseModel
      .aggregate([
        {
          $match: {
            "orders.date": { $gte: startDate, $lte: endDate },
          },
        },
        {
          $unwind: "$orders",
        },
        {
          $match: {
            "orders.date": { $gte: startDate, $lte: endDate },
          },
        },
        {
          $sort: { "orders.date": 1 },
        },
        {
          $group: {
            _id: "$_id",
            user_id: { $first: "$user_id" },
            name: { $first: "$name" },
            orders: { $push: "$orders" },
          },
        },
        {
          $project: {
            _id: 0,
            __v: 0,
            "orders._id": 0,
            "orders.products._id": 0,
          },
        },
      ])
      .sort({ user_id: 1 });
  }

  async appendRecord(record: targetRecord): Promise<insertMessage> {
    let insertMessage: insertMessage = {
      success: true,
      message: "no insertions",
      inserted_users: 0,
      inserted_orders: 0,
      inserted_products: 0,
    };

    const mongooseModel = mongoose.model("user", targetRecordSchema);

    const user = await mongooseModel.findOne({ user_id: record.user_id });
    if (!user) {
      const newRecord = new mongooseModel(record);
      await newRecord.save();
      insertMessage.message = "user inserted";
      insertMessage.inserted_users++;
      insertMessage.inserted_orders += record.orders.length;
      insertMessage.inserted_products += record.orders.reduce(
        (acc, order) => acc + order.products.length,
        0
      );
    } else {
      if (user.name !== record.name) {
        throw new Error("User name mismatch, upsert illegal");
      }
      for (const order of record.orders) {
        const existingOrder = user.orders.find(
          (o) => o.order_id === order.order_id
        );
        if (!existingOrder) {
          user.orders.push(order);
          insertMessage.inserted_orders = record.orders.length + 1;
          insertMessage.inserted_products += order.products.length;
        } else {
          for (const product of order.products) {
            const existingProduct = existingOrder.products.find(
              (p) => p.product_id === product.product_id
            );
            existingOrder.products.push(product);
            insertMessage.inserted_products = order.products.length + 1;
          }
        }
      }

      await user.save();
      insertMessage.message = "data inserted";
    }

    return insertMessage;
  }

  async appendRecords(records: targetRecord[]): Promise<insertMessage> {
    let insertMessage: insertMessage = {
      success: true,
      message: "no insertions",
      inserted_users: 0,
      inserted_orders: 0,
      inserted_products: 0,
    };

    for (const record of records) {
      const insertReport = await this.appendRecord(record);
      insertMessage.message = "batch data inserted";
      insertMessage.inserted_users += insertReport.inserted_users;
      insertMessage.inserted_orders += insertReport.inserted_orders;
      insertMessage.inserted_products += insertReport.inserted_products;
    }

    return insertMessage;
  }
}
