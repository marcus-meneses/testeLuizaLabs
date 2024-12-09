import test from "node:test";
import assert from "node:assert/strict";
import { Converter } from "@classes/converter/Converter";
import fs from "fs";

test.suite("Converter", () => {
  test("Registry output from converter is valid", () => {
    const inputData = fs.readFileSync(
      __dirname + "/data/converter.buildEntry.valid.input.txt",
      "utf-8"
    );
    const outputExpected = JSON.parse(
      fs.readFileSync(
        __dirname + "/data/converter.buildEntry.output.json",
        "utf-8"
      )
    );
    const converter = new Converter();

    assert.equal(
      JSON.stringify(converter.buildEntry(inputData)),
      JSON.stringify(outputExpected)
    );
  });

  test("Converter throws error on invalid input", () => {
    const converter = new Converter();
    const inputData = fs.readFileSync(
       __dirname+"/data/converter.buildEntry.error.input.txt",
      "utf-8"
    );

    assert.throws(() => {
      converter.buildEntry(inputData);
    });
  });

  test("Tree output from converter is valid", (t, done) => {
    const outputExpected = JSON.parse(
      fs.readFileSync(
         __dirname+"/data/converter.buildTree.output.json",
        "utf-8"
      )
    );
    const converter = new Converter(
       __dirname+"/data/converter.buildTree.valid.input.txt"
    );

    converter.on("data", (data) => {
      assert.equal(
        JSON.stringify(converter.getTree()),
        JSON.stringify(outputExpected)
      );
      done();
    });
  });

  test("Conversion time of sample data acceptable (<50ms)", (t, done) => {
    const startTime = Date.now();
    const converter = new Converter(
       __dirname+"/data/converter.buildTree.time.input.txt"
    );

    converter.on("data", (data) => {
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      assert.equal(totalTime < 50, true);
      done();
    });
  });
});
