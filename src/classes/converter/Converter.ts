import { EventEmitter } from "stream";
import fs, { createReadStream } from "fs";
import { order, rawRegistry, targetRecord } from "@interfaces/records";
import * as readline from "readline";

export class Converter extends EventEmitter {
  private fileStream: fs.ReadStream | null = null;
  private lineReader: readline.Interface | null = null;
  private dataTree: targetRecord[] = [];

  constructor(fileName: string | null = null) {
    super();

    try {
      if (fileName != null) {
        this.fileStream = fs.createReadStream(fileName);
        this.lineReader = readline.createInterface({
          input: this.fileStream,
        });

        this.lineReader.on("line", (line) => {
          if (line.replace(/\s+/g, "").length > 0) {
            this.buildTree(this.buildEntry(line));
          }
        });

        this.lineReader.on("close", () => {
          this.emit("data", this.dataTree);
        });
      }
    } catch (error) {
      this.emit("error", error);
    }
  }

  buildTree(data: rawRegistry): boolean {
    if (!this.dataTree.find((element) => element.user_id === data.id_usuario)) {
      const newUser: targetRecord = {
        user_id: data.id_usuario,
        name: data.nome,
        orders: [],
      };

      const newOrder: order = {
        order_id: data.id_pedido,
        total: data.valor_produto.toFixed(2),
        date: data.data_compra,
        products: [],
      };

      const newProduct = {
        product_id: data.id_produto,
        value: data.valor_produto.toFixed(2),
      };

      newOrder.products.push(newProduct);
      newUser.orders.push(newOrder);
      this.dataTree.push(newUser);
    } else {
      const userIndex = this.dataTree.findIndex(
        (element) => element.user_id === data.id_usuario
      );

      if (
        !this.dataTree[userIndex].orders.find(
          (element) => element.order_id === data.id_pedido
        )
      ) {
        const newOrder: order = {
          order_id: data.id_pedido,
          total: data.valor_produto.toFixed(2),
          date: data.data_compra,
          products: [],
        };

        const newProduct = {
          product_id: data.id_produto,
          value: data.valor_produto.toFixed(2),
        };

        newOrder.products.push(newProduct);
        this.dataTree[userIndex].orders.push(newOrder);
      } else {
        const orderIndex = this.dataTree[userIndex].orders.findIndex(
          (element) => element.order_id === data.id_pedido
        );

        const newProduct = {
          product_id: data.id_produto,
          value: data.valor_produto.toFixed(2),
        };

        this.dataTree[userIndex].orders[orderIndex].total = (
          parseFloat(this.dataTree[userIndex].orders[orderIndex].total) +
          parseFloat(newProduct.value)
        ).toFixed(2);
        this.dataTree[userIndex].orders[orderIndex].products.push(newProduct);
      }
    }

    return true;
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
    returnRegistry.valor_produto = parseFloat(
      Number(data.substring(75, 87)).toFixed(2)
    );
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
    if (data.length != 95) {
      throw new Error("Invalid data length");
    }

    return true;
  }
}
