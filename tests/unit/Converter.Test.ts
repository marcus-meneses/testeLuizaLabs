import test from "node:test";
import assert from "node:assert/strict";
import { Converter } from "@classes/converter/Converter";
import fs from "fs";

test("Registry output from converter is valid", (t) => {
  const inputData = fs.readFileSync(
    "./tests/unit/data/converter.buildEntry.input.txt",
    "utf-8"
  );
  const outputExpected = JSON.parse(fs.readFileSync(
    "./tests/unit/data/converter.buildEntry.output.json",
    "utf-8"
  ));
  const converter = new Converter();

  assert.equal(JSON.stringify(converter.buildEntry(inputData)), JSON.stringify(outputExpected));
});


test("Converter throws error on invalid input", (t) => {
  
  const inputData = fs.readFileSync(
    "./tests/unit/data/converter.buildEntry.error.input.txt",
    "utf-8"
  );

  const converter = new Converter();

  assert.throws(() => {
    converter.buildEntry(inputData);
  });

});


test("Validity of tree output from converter", (t) => {
  const inputData = JSON.parse(fs.readFileSync(
    "./tests/unit/data/converter.buildTree.input.json",
    "utf-8"
  ));
  const outputExpected = JSON.parse(fs.readFileSync(
    "./tests/unit/data/converter.buildTree.output.json",
    "utf-8"
  ));
  const converter = new Converter();

  assert.equal(JSON.stringify(converter.buildTree(inputData)), JSON.stringify(outputExpected));
});
