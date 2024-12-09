import test from "node:test";
import assert from "node:assert/strict";
import { Converter } from "@classes/converter/Converter";
import { MemoryBroker } from "@classes/brokers/memory/MemoryBroker";
import { insertMessage } from "@interfaces/records";
import fs from "fs";

test.suite("MongoDBBroker", () => {
  test("MongoDB broker can deal with single record insertion", async () => {
    const converter = new Converter();
    const memoryBroker = new MemoryBroker();
    const inputData = fs.readFileSync(
      __dirname + "/data/converter.buildEntry.valid.input.txt",
      "utf-8"
    );

    const outputExpected = JSON.parse(
      fs.readFileSync(
        __dirname + "/data/memorybroker.appendRecord.output.json",
        "utf-8"
      )
    );

    const record = converter.buildEntry(inputData);
    converter.buildTree(record);
    const treeData = converter.getTree();
    await memoryBroker.appendRecord(treeData[0]);
    const mrecords = memoryBroker.getAllRecords().then((records) => {
      assert.equal(JSON.stringify(records), JSON.stringify([outputExpected]));
    });
  });

  test("MongoDB broker can deal with multiple record insertion", () => {
    const memoryBroker = new MemoryBroker();

    const outputExpected = JSON.parse(
      fs.readFileSync(
        __dirname + "/data/converter.buildTree.output.json",
        "utf-8"
      )
    );

    const inputFile = __dirname + "/data/converter.buildTree.valid.input.txt";
    const converter = new Converter(inputFile);

    converter.on("data", async (data) => {
      await memoryBroker.appendRecords(converter.getTree());
      await memoryBroker.getAllRecords().then((records) => {
        assert.equal(JSON.stringify(records), JSON.stringify(outputExpected));
      });
    });
  });

  test("MongoDB broker can deal with edge-case record insertion (validate report data)", () => {
    const memoryBroker = new MemoryBroker();
    const inputFile = __dirname + "/data/converter.buildTree.time.input.txt";
    const converter = new Converter(inputFile);

    const expectedReport: insertMessage = {
      success: true,
      message: "batch data inserted",
      inserted_users: 200,
      inserted_orders: 1843,
      inserted_products: 3870,
    };

    converter.on("data", async (data) => {
      const inputLog = await memoryBroker.appendRecords(converter.getTree());
      memoryBroker.getAllRecords().then((records) => {
        assert.equal(JSON.stringify(inputLog), JSON.stringify(expectedReport));
      });
    });
  });

  test.todo("MongoDB broker can filter by user id", () => {
    assert.throws(() => {
      throw new Error("Not implemented");
    });
  });

  test.todo("MongoDB broker can filter by order id", () => {
    assert.throws(() => {
      throw new Error("Not implemented");
    });
  });

  test.todo("MongoDB broker can return all data", () => {
    assert.throws(() => {
      throw new Error("Not implemented");
    });
  });

  test.todo("MongoDB broker can filter by date interval", () => {
    assert.throws(() => {
      throw new Error("Not implemented");
    });
  });
});
