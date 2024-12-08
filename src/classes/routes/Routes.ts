import { DataBroker } from '@classes/brokers/DataBroker';
import { MemoryBroker } from '@classes/brokers/memory/MemoryBroker';
import { Converter } from '@classes/converter/Converter';
import { Request, Response, NextFunction, Router } from 'express';


export class Routes {

private broker: DataBroker;
private converter: Converter | undefined;
  
 constructor() {
    this.broker = new DataBroker(new MemoryBroker());
    this.broker.connect();
 }

    public async appendRecords (req: Request, res: Response, next: NextFunction) {
        console.log(req.files);
        res.send(req.body);
    }

    public async getAllRecords (req: Request, res: Response, next: NextFunction) {
        console.log(req.body);
        res.send("getAllRecords");
    }

    public async getRecordsByUserId (req: Request, res: Response, next: NextFunction) {
        console.log(req.body);
        res.send("getRecordsByUserId");
    }

    public async getRecordsByOrderId (req: Request, res: Response, next: NextFunction) {
        console.log(req.body);
        res.send("getRecordsByOrderId");
    }

    public async getRecordsByDateInterval (req: Request, res: Response, next: NextFunction) {
        console.log(req.body);
        res.send("getRecordsByDateInterval");
    }

    public async info (req: Request, res: Response, next: NextFunction) {
        console.log(req.body);
        const infoText = `
        Available routes:<br/>\n
        GET /records - get all records<br/>\n
        GET /records/user/:id - get records by user id<br/>\n
        GET /records/order/:id - get records by order id<br/>\n
        GET /records/date/:startDate/:endDate - get records by date interval<br/>\n
        PUT /records - append records<br/>\n
        `;
        res.send(infoText);
    }
}