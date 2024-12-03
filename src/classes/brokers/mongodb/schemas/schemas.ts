import { Schema } from "mongoose";
import * as records from "@interfaces/records";

export const targetRecordSchema = new Schema<records.targetRecord>(
  {
    user_id: { type: Number },
    name: { type: String },
    orders: [
      {
        order_id: { type: Number },
        total: { type: Number },
        date: { type: String },
        products: [
          {
            product_id: { type: Number },
            value: { type: Number },
          },
        ],
      },
    ],
  } 
);
