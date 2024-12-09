import test from "node:test";
import assert from "node:assert/strict";
import { Converter } from "@classes/converter/Converter";
import { MemoryBroker } from "@classes/brokers/memory/MemoryBroker";
import { DataBroker } from "@classes/brokers/DataBroker";
import { insertMessage } from "@interfaces/records";
import fs from "fs";

test.suite("DataBroker:MemoryBroker", () => {
  
  test("Databroker can push all data transparently through memory broker", () => {
    const memoryBroker = new MemoryBroker();
    const inputFile =  __dirname+"/data/converter.buildTree.time.input.txt";
    const converter = new Converter(inputFile);
    const db = new DataBroker(memoryBroker);

    const expectedReport: insertMessage = {
      success: true,
      message: "batch data inserted",
      inserted_users: 200,
      inserted_orders: 1843,
      inserted_products: 3870,
    };

    converter.on("data", (data) => {
      const inputLog = db.appendRecords(converter.getTree());
      db.getAllRecords().then((records) => {
        assert.equal(JSON.stringify(inputLog), JSON.stringify(expectedReport));
      });
    });
  });

  test.todo("Data broker can filter by user id through memory broker", () => {
    assert.throws(() => {
      throw new Error("Not implemented");
    });
  });

  test.todo("Data broker can filter by order id through memory broker", () => {
    assert.throws(() => {
      throw new Error("Not implemented");
    });
  });

  test.todo("Data broker can return all data through memory broker", () => {
    assert.throws(() => {
      throw new Error("Not implemented");
    });
  });

  test.todo("Memory broker can filter by date interval through memory broker", () => {
    assert.throws(() => {
      throw new Error("Not implemented");
    });
  });
});


test.suite("DataBroker:FileBroker", () => {
  
  test("Databroker can push all data transparently through file broker", () => {
    const memoryBroker = new MemoryBroker();
    const inputFile =  __dirname+"/data/converter.buildTree.time.input.txt";
    const converter = new Converter(inputFile);
    const db = new DataBroker(memoryBroker);

    const expectedReport: insertMessage = {
      success: true,
      message: "batch data inserted",
      inserted_users: 200,
      inserted_orders: 1843,
      inserted_products: 3870,
    };

    converter.on("data", (data) => {
      const inputLog = db.appendRecords(converter.getTree());
      db.getAllRecords().then((records) => {
        assert.equal(JSON.stringify(inputLog), JSON.stringify(expectedReport));
      });
    });
  });

  test.todo("Data broker can filter by user id through file broker", () => {
    assert.throws(() => {
      throw new Error("Not implemented");
    });
  });

  test.todo("Data broker can filter by order id file broker", () => {
    assert.throws(() => {
      throw new Error("Not implemented");
    });
  });

  test.todo("Data broker can return all data file broker", () => {
    assert.throws(() => {
      throw new Error("Not implemented");
    });
  });

  test.todo("Memory broker can filter by date interval file broker", () => {
    assert.throws(() => {
      throw new Error("Not implemented");
    });
  });
});
