import { Colors, Puzzles } from "./data/puzzles.types";
import { transform } from "../utils/transform";
import config from "../config";
import { argumentBuilder } from "../utils/circuitFunctions";
import { WasmTester, wasm } from "circom_tester";
import { calculateLabeledWitness } from "./utils/calculateLabeledWitness";
import { assert } from "chai";
import path from "path";
import { CircuitFunctions } from "../utils/enums/circuitFunctions.enum";

const puzzles: Puzzles = require("./data/puzzles.json");

describe.only("transform circuit", () => {
  let circuit: WasmTester;

  const sanityCheck = true;
  const initialGrid = puzzles[0.1].initial;

  before(async () => {
    circuit = await wasm(
      path.join(__dirname, "../circuits/test/transform_test.circom")
    );
  });

  it("produces a witness with valid constraints", async () => {
    const [onOff, inColor, outColor] = argumentBuilder(
      CircuitFunctions.TRANSFORM_YELLOW_RED
    );

    const witness = await circuit.calculateWitness(
      { grid: initialGrid, onOff, inColor, outColor },
      sanityCheck
    );

    await circuit.checkConstraints(witness);
  });

  it("has expected witness values for onOff == 1", async () => {
    const [onOff, inColor, outColor] = argumentBuilder(
      CircuitFunctions.TRANSFORM_YELLOW_RED
    );

    const witness = await calculateLabeledWitness(
      circuit,
      { grid: initialGrid, onOff, inColor, outColor },
      sanityCheck
    );

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        assert.propertyVal(
          witness,
          `main.out[${i}][${j}]`,
          String(puzzles[0.1].target[i][j])
        );
      }
    }
  });

  it("has expected witness values for onOff == 0", async () => {
    const [inColor, outColor] = argumentBuilder(
      CircuitFunctions.TRANSFORM_YELLOW_RED
    );

    const witness = await calculateLabeledWitness(
      circuit,
      { grid: initialGrid, onOff: 0, inColor, outColor },
      sanityCheck
    );

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        assert.propertyVal(
          witness,
          `main.out[${i}][${j}]`,
          String(initialGrid[i][j])
        );
      }
    }
  });

  it("produces expected witness values", async () => {
    const [onOff, inColor, outColor] = argumentBuilder(
      CircuitFunctions.TRANSFORM_YELLOW_BLUE
    );

    const witness = await calculateLabeledWitness(
      circuit,
      { grid: initialGrid, onOff, inColor, outColor },
      sanityCheck
    );

    assert.notPropertyVal(
      witness,
      "main.out[0][0]",
      String(puzzles[0.2].target[0][0])
    );
  });

  ["0.1", "0.2", "0.3", "0.4"].forEach((lvl: string) => {
    it(`transform witness values for level ${lvl} equals transform function return values`, async () => {
      const [onOff, inColor, outColor] = argumentBuilder(
        CircuitFunctions.TRANSFORM_YELLOW_RED
      );

      const witness = await calculateLabeledWitness(
        circuit,
        { grid: initialGrid, onOff, inColor, outColor },
        sanityCheck
      );

      for (let i = 0; i < config.gridWidth; i++) {
        const column = transform(initialGrid[i], Colors.Yellow, Colors.Red);

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
