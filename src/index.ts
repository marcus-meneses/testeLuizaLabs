import { Routes } from "@classes/routes/Routes";
import express from "express";

const routes = new Routes();

const app = express();
app.use(express.json());

app.all("/",routes.info);
app.put("/records",routes.appendRecords);
app.get("/records",routes.getAllRecords);
app.get("/records/user/:id",routes.getRecordsByUserId);
app.get("/records/order/:id",routes.getRecordsByOrderId);
app.get("/records/date/:startDate/:endDate",routes.getRecordsByDateInterval);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});