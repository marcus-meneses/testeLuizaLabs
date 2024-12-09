import { DataBroker } from "@classes/brokers/DataBroker";
import { MemoryBroker } from "@classes/brokers/memory/MemoryBroker";
import { Converter } from "@classes/converter/Converter";
import { Request, Response, NextFunction, Router } from "express";

export class RESTHandler {
  broker: DataBroker;

  constructor() {
    this.broker = new DataBroker(new MemoryBroker());
    this.broker.connect();
  }

  public appendRecords = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const converter = new Converter(req.file?.path);
    converter.on("data", async (data) => {
      const inputReport = this.broker.appendRecords(data);
      res.send(inputReport);
      next();
    });
  };

  public getAllRecords = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await this.broker.getAllRecords();
    res.send(data);
    next();
  };

  public getRecordsByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await this.broker.getRecordsByUserId(Number(req.params.id));
    res.send(data);
    next();
  };

  public getRecordsByOrderId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await this.broker.getRecordsByOrderId(Number(req.params.id));
    res.send(data);
    next();
  };

  public getRecordsByDateInterval = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await this.broker.getRecordsByDateInterval(
      req.params.startDate,
      req.params.endDate
    );
    res.send(data);
    next();
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
