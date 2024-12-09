import { DataBroker } from "@classes/brokers/DataBroker";
import { MongoDBBroker } from "@classes/brokers/mongodb/MongoDBBroker";
import { Converter } from "@classes/converter/Converter";
import { Request, Response, NextFunction, Router } from "express";
import fs from "fs";

export class RESTHandler {
  broker: DataBroker;

  constructor() {
    this.broker = new DataBroker(new MongoDBBroker());
    this.broker.connect();
  }

  public appendRecords = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const converter = new Converter(req.file?.path);
    converter.on("data", (data) => {
      this.broker
        .appendRecords(data)
        .then((inputReport) => {
          res.send(inputReport);
          next();
        })
        .catch((error) => {
          next(error);
        })
        .finally(() => {
          if (req.file?.path) {
            fs.rmSync(req.file.path);
          }
        });
    });

    converter.on("error", (error) => {
      console.log("Error on conversion");
      next(error);
    });
  };

  public getAllRecords = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    this.broker
      .getAllRecords()
      .then((data) => {
        res.send(data);
        next();
      })
      .catch((error) => {
        next(error);
      });
  };

  public getRecordsByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    this.broker
      .getRecordsByUserId(Number(req.params.id))
      .then((data) => {
        res.send(data);
        next();
      })
      .catch((error) => {
        next(error);
      });
  };

  public getRecordsByOrderId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    this.broker
      .getRecordsByOrderId(Number(req.params.id))
      .then((data) => {
        res.send(data);
        next();
      })
      .catch((error) => {
        next(error);
      });
  };

  public getRecordsByDateInterval = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    this.broker
      .getRecordsByDateInterval(req.params.startDate, req.params.endDate)
      .then((data) => {
        res.send(data);
        next();
      })
      .catch((error) => {
        next(error);
      });
  };

  public info = async (req: Request, res: Response, next: NextFunction) => {
    const infoText = `
        Available routes:<br/>\n
        GET /records - get all records<br/>\n
        GET /records/user/:id - get records by user id<br/>\n
        GET /records/order/:id - get records by order id<br/>\n
        GET /records/date/:startDate/:endDate - get records by date interval<br/>\n
        PUT /records - append records<br/>\n
        `;
    res.send(infoText);
  };
}
