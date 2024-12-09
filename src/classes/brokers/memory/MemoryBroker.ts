import {
  brokerPrototype,
  connectionOptions,
  connectionStatusFlags,
} from "@interfaces/databroker";
import { insertMessage, targetRecord } from "@interfaces/records";
import { EventEmitter } from "stream";

export class MemoryBroker extends EventEmitter implements brokerPrototype {
  options: connectionOptions = {
    host: "",
    port: 0,
    user: "",
    database: "",
  };

  connection: boolean = true;

  private records: targetRecord[] = [];

  constructor(options: connectionOptions | null = null) {
    super();
  }

  connect() {
    this.connection = true;
    console.log("Connected to Memory buffer");
    return this.getConnectionStatus();
  }

  disconnect() {
    this.connection = false;
    console.log("Disconnected from Memory buffer");
    return this.getConnectionStatus();
  }

  getConnectionStatus(): connectionStatusFlags {
    return this.connection
      ? connectionStatusFlags.CONNECTED
      : connectionStatusFlags.DISCONNECTED;
  }

  async getAllRecords(): Promise<targetRecord[] | []> {
    return this.records;
  }

  async getRecordsByUserId(id: number): Promise<targetRecord[] | []> {
    return this.records.filter((record) => record.user_id === id);
  }

  async getRecordsByOrderId(id: number): Promise<targetRecord[] | []> {
    const filteredRecords = structuredClone(this.records);
    return filteredRecords.filter((record) => {
      record.orders = record.orders.filter((order) => order.order_id === id);
      return record.orders.length > 0;
    });
  }

  async getRecordsByDateInterval(
    startDate: string,
    endDate: string
  ): Promise<targetRecord[] | []> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const filteredRecords = structuredClone(this.records);
    return filteredRecords.filter((record) => {
      record.orders = record.orders.filter((order) => {
        const orderDate = new Date(order.date);
        return (
           orderDate >= start &&
           orderDate <= end
        );
      });
      return record.orders.length > 0;
    });
  }

  async appendRecord(record: targetRecord): Promise<insertMessage> {
    let insertMessage: insertMessage = {
      success: true,
      message: "no insertions",
      inserted_users: 0,
      inserted_orders: 0,
      inserted_products: 0,
    };

    try {
      const userIndex = this.records.findIndex(
        (r) => r.user_id === record.user_id
      );
      if (userIndex === -1) {
        this.records.push(record);
        insertMessage.inserted_users++;
        insertMessage.inserted_orders += record.orders.length;
        insertMessage.inserted_products = record.orders.reduce(
          (acc, order) => acc + order.products.length,
          0
        );
        insertMessage.message = "data inserted";
      } else {
        if (record.name !== this.records[userIndex].name) {
          throw new Error("User name mismatch, upsert illegal");
        }
        record.orders.forEach((order) => {
          const orderIndex = this.records[userIndex].orders.findIndex(
            (o) => o.order_id === order.order_id
          );
          if (orderIndex === -1) {
            this.records[userIndex].orders.push(order);
            insertMessage.inserted_orders++;
            insertMessage.inserted_products += order.products.length;
            insertMessage.message = "data inserted";
          } else {
            order.products.forEach((product) => {
              const productIndex = this.records[userIndex].orders[
                orderIndex
              ].products.findIndex((p) => p.product_id === product.product_id);

              this.records[userIndex].orders[orderIndex].total = (
                parseFloat(this.records[userIndex].orders[orderIndex].total) +
                parseFloat(product.value)
              ).toFixed(2);

              this.records[userIndex].orders[orderIndex].products.push(product);
              insertMessage.inserted_products++;
              insertMessage.message = "data inserted";
            });
          }
        });
      }
    } catch (error) {
      insertMessage.success = false;
      if (error instanceof Error) {
        insertMessage.message = error.message;
      } else {
        insertMessage.message = String(error);
      }
      insertMessage.inserted_users = NaN;
      insertMessage.inserted_orders = NaN;
      insertMessage.inserted_products = NaN;
    }

    return insertMessage;
  }

  async appendRecords(records: targetRecord[]): Promise<insertMessage> {
    let insertMessage: insertMessage = {
      success: true,
      message: "",
      inserted_users: 0,
      inserted_orders: 0,
      inserted_products: 0,
    };

    records.forEach(async (record) => {
      const result = await this.appendRecord(record);
      insertMessage.inserted_users += result.inserted_users;
      insertMessage.inserted_orders += result.inserted_orders;
      insertMessage.inserted_products += result.inserted_products;
      insertMessage.message = "batch data inserted";
      if (!result.success) {
        insertMessage.success = false;
        insertMessage.message = "batch data failure";
        insertMessage.inserted_users = NaN;
        insertMessage.inserted_orders = NaN;
        insertMessage.inserted_products = NaN;
      }
    });

    return insertMessage;
  }
}
