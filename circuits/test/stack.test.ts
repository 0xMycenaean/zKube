import { assert } from "chai";
import { Colors, Puzzles } from "./data/puzzles.types";
import { stack } from "../utils/stack";
import config from "../config";
import { WasmTester, wasm } from "circom_tester";
import { calculateLabeledWitness } from "./utils/calculateLabeledWitness";
import path from "path";
// import { calculateLabeledWitness } from "./calculateLabeledWitness";
const puzzles: Puzzles = require("./data/puzzles.json");

describe.only("stack circuit", () => {
  let circuit: WasmTester;
  const sanityCheck = true;
  const initialGrid = puzzles[0.2].initial;

  before(async () => {
    circuit = await wasm(
      path.join(__dirname, "../circuits/test/stack_test.circom")
    );
  });

  it("produces a witness with valid constraints", async () => {
    const witness = await circuit.calculateWitness(
      { grid: initialGrid, onOff: 1, color: 1 },
      sanityCheck
    );

    await circuit.checkConstraints(witness);
  });

  it("has expected witness values", async () => {
    const witness = await calculateLabeledWitness(
      circuit,
      { grid: initialGrid, onOff: 1, color: 1 },
      sanityCheck
    );

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        assert.propertyVal(
          witness,
          `main.out[${i}][${j}]`,
          String(puzzles[0.2].stack[i][j])
        );
      }
    }
  });

  it("produces expected witness values", async () => {
    const witness = await calculateLabeledWitness(
      circuit,
      { grid: initialGrid, onOff: 1, color: 1 },
      sanityCheck
    );

    assert.notPropertyVal(
      witness,
      "main.out[0][0]",
      String(puzzles[0.2].target[0][3])
    );
  });

  ["0.1", "0.2", "0.3", "0.4"].forEach((lvl: string) => {
    it(`stack witness values for level ${lvl} equals stack function return values`, async () => {
      const witness = await calculateLabeledWitness(
        circuit,
        { grid: puzzles[lvl].initial, onOff: 1, color: 1 },
        sanityCheck
      );

      for (let i = 0; i < config.gridWidth; i++) {
        const column = stack(puzzles[lvl].initial[i], Colors.Yellow);

        for (let j = 0; j < config.gridHeight; j++) {
          assert.propertyVal(
            witness,
            `main.out[${i}][${j}]`,
            String(column[j])
          );
        }
      }
    });
  });
});
