import { EventEmitter } from "stream";
import fs, { createReadStream } from "fs";
import { order, rawRegistry, targetRecord } from "@interfaces/records";
import * as readline from "readline";

export class Converter extends EventEmitter {
  private fileStream: fs.ReadStream | null = null;
  private lineReader: readline.Interface | null = null;
  private dataTree: targetRecord[] | [] = [];

  constructor(fileName: string | null = null) {
    super();

    if (fileName != null) {
      this.fileStream = fs.createReadStream(fileName);
      this.lineReader = readline.createInterface({
        input: this.fileStream,
      });

      this.lineReader.on("line", (line) => {
        console.log("Processing line: " + line);
        this.buildTree(this.buildEntry(line));
      });

      this.lineReader.on("close", () => {
        console.log("Finished reading file");
        console.dir(this.dataTree);
        this.emit("data", this.dataTree);
      });
    }
  }

  buildTree(data: rawRegistry): targetRecord[] | [] {
    console.log(data);
    return [];
  }

  public buildEntry(data: string): rawRegistry {
    if (!this.validateData(data)) {
      throw new Error("Invalid data");
    }

    const returnRegistry: rawRegistry = {
      id_usuario: 0,
      nome: "",
      id_pedido: 0,
      id_produto: 0,
      valor_produto: 0,
      data_compra: "",
    };

    returnRegistry.id_usuario = parseInt(data.substring(0, 10));
    returnRegistry.nome = data.substring(10, 55).trim();
    returnRegistry.id_pedido = parseInt(data.substring(55, 65));
    returnRegistry.id_produto = parseInt(data.substring(65, 75));
    returnRegistry.valor_produto = parseFloat(data.substring(75, 87));
    returnRegistry.data_compra =
      data.substring(87, 91) +
      "-" +
      data.substring(91, 93) +
      "-" +
      data.substring(93, 95);

    return returnRegistry;
  }

  public getTree(): targetRecord[] | [] {
    return this.dataTree;
  }

  private validateData(data: string): boolean {
    if (data.length < 95) {
      throw new Error("Invalid data length");
    }

    return true;
  }
}
