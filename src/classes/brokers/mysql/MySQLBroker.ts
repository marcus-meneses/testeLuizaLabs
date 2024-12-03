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
  connected: connectionStatusFlags = connectionStatusFlags.DISCONNECTED;

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
          this.connected = connectionStatusFlags.CONNECTED;
          console.log("Connected to MySQL");
        });

        this.connection.on("error", (err) => {
          this.connected = connectionStatusFlags.DISCONNECTED;
          console.log("Error connecting to MySQL");
          setTimeout(() => {
            this.connect();
          }, 5000);
        });

        this.connection.on("end", () => {
          this.connected = connectionStatusFlags.DISCONNECTED;
          console.log("Disconnected from MySQL");
        });
      } catch (error) {
        setTimeout(() => {
          this.connect();
        }, 5000);
      }
    } else {
      console.log("Connection to MySQL already established");
    }

    return this.getConnectionStatus();
  }

  disconnect() {
    if (this.connection) {
      this.connection.end();
    }
    this.connected = connectionStatusFlags.DISCONNECTED;
  }

  getConnectionStatus(): connectionStatusFlags {
    return this.connected;
  }

  getAllRecords(): Promise<object> {
    return this.runQuery("SELECT * FROM orders");
  }

  getRecordsById(id: string): Promise<object> {
    return this.runQuery(`SELECT * FROM orders WHERE id = '${id}'`);
  }

  getRecordsByDateInterval(
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
