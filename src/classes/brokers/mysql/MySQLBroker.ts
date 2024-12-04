import {
  brokerPrototype,
  connectionOptions,
  connectionStatusFlags,
} from "@interfaces/databroker";
import mysql from "mysql2";
import { EventEmitter } from "stream";

export class MySQLBroker extends EventEmitter implements brokerPrototype {
  options: connectionOptions;
  connection: mysql.Connection | null = null;

  constructor(options: connectionOptions) {
    super();
    this.options = options;
  }

  connect() {
    if (!this.getConnectionStatus()) {
      console.log("Establishing connection to MySQL server...");

      try {
        this.connection = mysql.createConnection({
          host: this.options.host,
          user: this.options.user,
          password: this.options.password,
          database: this.options.database,
        });

        this.connection.on("connect", () => {
          console.log("Connected to MySQL");
        });
      } catch (error) {
        console.error("Error establishing connection to MySQL server", error);
        this.connection = null;
      }
    } else {
      console.log("Connection to MySQL already established");
    }

    return this.getConnectionStatus();
  }

  disconnect() {
    if (this.connection) {
      console.log("Closing connection to MySQL server...");
      this.connection.end();
    }
    return this.getConnectionStatus();
  }

  getConnectionStatus(): connectionStatusFlags {
    return this.connection
      ? connectionStatusFlags.CONNECTED
      : connectionStatusFlags.DISCONNECTED;
  }

  async getAllRecords(): Promise<object> {
    return this.runQuery("SELECT * FROM orders");
  }

  async getRecordsById(id: string): Promise<object> {
    return this.runQuery(`SELECT * FROM orders WHERE id = '${id}'`);
  }

  async getRecordsByDateInterval(
    startDate: string,
    endDate: string
  ): Promise<object> {
    return this.runQuery(
      `SELECT * FROM orders WHERE date BETWEEN ${startDate} AND ${endDate}`
    );
  }

  private async runQuery(query: string): Promise<object> {
    return new Promise((resolve, reject) => {
      this.connection?.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
}
