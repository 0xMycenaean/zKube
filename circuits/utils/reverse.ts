import { writeFileSync } from "fs";
import path from "path";
import { Colors, Puzzles } from "../types/circuitFunctions.types";
const puzzles: Puzzles = require("../test/data/puzzles.json");

function reverse(column: Array<Colors>): Array<Colors> {
  const splitIndex = column.indexOf(0);
  let reversedColumn: Array<Colors>;
  if (splitIndex === -1) {
    // doesn't make sense to do it recursively
    reversedColumn = [...column].reverse();
  } else {
    const firstPart = column.slice(0, splitIndex);
    const secondPart = column.slice(splitIndex);

    reversedColumn = [...firstPart.reverse(), ...secondPart];
  }

  return reversedColumn;
}
