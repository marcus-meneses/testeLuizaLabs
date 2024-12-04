import { DataBroker } from "@classes/brokers/DataBroker";
import { MongoDBBroker } from "@classes/brokers/mongodb/MongoDBBroker";
import { MySQLBroker } from "@classes/brokers/mysql/MySQLBroker";
import { set } from "mongoose";

const connectionOptions = {
  host: "localhost",
  port: 27017,
  user: "admin",
  password: "admin",
  database: "luizaLabs",
  collection: "orders",
};

//const db = new DataBroker(new MongoDBBroker(connectionOptions));
const db = new DataBroker(new MySQLBroker(connectionOptions));

db.connect();

db.getAllRecords().then((records) => {
  console.log(records);
  db.getRecordsById("60b9b3b3b3b3b3b3b3b3b3b3").then((record) => {
    console.log(record);
    db.getRecordsByDateInterval("2021-06-04", "2021-06-05")
      .then((records) => {
        console.log(records);
      })
      .finally(() => {
        while(!db.disconnect());
      });
  });
});
