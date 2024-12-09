import { RESTHandler } from "@classes/resthandler/RESTHandler";
import express from "express";
import multer from "multer";

const restHandler = new RESTHandler();
const upload = multer({ dest: __dirname+'/tmp/' })

const app = express();
app.use(express.json());

app.all("/",restHandler.info);
app.put("/records", upload.single("dataset"),restHandler.appendRecords);
app.get("/records", restHandler.getAllRecords);
app.get("/records/user/:id",restHandler.getRecordsByUserId);
app.get("/records/order/:id",restHandler.getRecordsByOrderId);
app.get("/records/date/:startDate/:endDate",restHandler.getRecordsByDateInterval);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});