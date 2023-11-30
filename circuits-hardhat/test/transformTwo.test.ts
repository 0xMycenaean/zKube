import hre from "hardhat";
import { assert } from "chai";
import { CircuitTestUtils } from "hardhat-circom";
import { Colors, Puzzles } from "./data/puzzles.types";
import config from "../config";
import { transformTwo } from "../utils/transformTwo";
const puzzles: Puzzles = require("./data/puzzles.json");

describe.only("transformtwo circuit", () => {
  let circuit: CircuitTestUtils;

  const sanityCheck = true;

  before(async () => {
    circuit = await hre.circuitTest.setup("test/transformtwo_test");
  });

  it("produces a witness with valid constraints", async () => {
    const witness = await circuit.calculateWitness(
      { grid: puzzles[0.1].initial, onOff: 1, inColor: 1, outColor: 2 },
      sanityCheck
    );

    await circuit.checkConstraints(witness);
  });

  it("has valid constraints", async () => {
    const witness = await circuit.calculateWitness(
      { grid: puzzles[0.1].initial, onOff: 1, inColor: 1, outColor: 2 },
      sanityCheck
    );

    await circuit.checkConstraints(witness);
  });

  it("has expected witness values", async () => {
    const witness = await circuit.calculateLabeledWitness(
      { grid: puzzles[0.1].initial, onOff: 1, inColor: 1, outColor: 2 },
      sanityCheck
    );

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        assert.propertyVal(
          witness,
          `main.out[${i}][${j}]`,
          String(puzzles[0.1].transformTwo[i][j])
        );
      }
    }
  });

  it("produces expected witness values", async () => {
    const witness = await circuit.calculateLabeledWitness(
      { grid: puzzles[0.1].initial, onOff: 1, inColor: 1, outColor: 2 },
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
      const witness = await circuit.calculateLabeledWitness(
        { grid: puzzles[0.1].initial, onOff: 1, inColor: 1, outColor: 2 },
        sanityCheck
      );

      for (let i = 0; i < config.gridWidth; i++) {
        const column = transformTwo(
          puzzles[0.1].initial[i],
          Colors.Yellow,
          Colors.Red
        );

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
