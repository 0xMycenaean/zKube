import { assert } from 'chai';
import config from '../config';
import { argumentBuilder } from '../utils/circuitFunctions';
import { WasmTester, wasm } from 'circom_tester';
import path from 'path';
import { calculateLabeledWitness } from './utils/calculateLabeledWitness';
import { Puzzles } from '../types/circuitFunctions.types';
import { gridMutator } from '../utils/gridMutator';
const puzzles: Puzzles = require('./data/puzzles.json');

describe.only('transformtwo circuit', () => {
  let circuit: WasmTester;

  const sanityCheck = true;
  const initialGrid = puzzles[0.1].initial;

  before(async () => {
    circuit = await wasm(
      path.join(__dirname, '../circuits/test/reject_test.circom')
    );
  });

  it('produces a witness with valid constraints', async () => {
    const [onOff, color] = argumentBuilder('REJECT_YELLOW');

    const witness = await circuit.calculateWitness(
      { grid: initialGrid, onOff, color },
      sanityCheck
    );

    await circuit.checkConstraints(witness);
  });

  it('has expected witness values for onOff == 1', async () => {
    const [onOff, color] = argumentBuilder('REJECT_YELLOW');

    const witness = await calculateLabeledWitness(
      circuit,
      { grid: initialGrid, onOff, color },
      sanityCheck
    );

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        assert.propertyVal(
          witness,
          `main.out[${i}][${j}]`,
          String(puzzles[0.2].reject[i][j])
        );
      }
    }
  });

  it('has expected witness values for onOff == 0', async () => {
    const [onOff, color] = argumentBuilder('REJECT_YELLOW');

    const witness = await calculateLabeledWitness(
      circuit,
      { grid: initialGrid, onOff: 0, color },
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

  it('produces expected witness values', async () => {
    const [onOff, color] = argumentBuilder('REJECT_YELLOW');

    const witness = await calculateLabeledWitness(
      circuit,
      { grid: initialGrid, onOff: 0, color },
      sanityCheck
    );

    assert.notPropertyVal(
      witness,
      'main.out[0][0]',
      String(puzzles[0.2].target[0][0])
    );
  });

  ['0.1', '0.2', '0.3', '0.4'].forEach((lvl: string) => {
    it(`transform witness values for level ${lvl} equals transform function return values`, async () => {
      const argument =
        lvl === '0.1'
          ? 'REJECT_YELLOW'
          : lvl === '0.2'
            ? 'REJECT_RED'
            : lvl === '0.3'
              ? 'REJECT_BLUE'
              : 'REJECT_YELLOW';

      const [onOff, color] = argumentBuilder(argument);

      const witness = await calculateLabeledWitness(
        circuit,
        {
          grid: puzzles[lvl].initial,
          onOff,
          color,
        },
        sanityCheck
      );

      const targetGrid = gridMutator(puzzles[lvl].initial, [argument]);

      for (let i = 0; i < config.gridWidth; i++) {
        for (let j = 0; j < config.gridHeight; j++) {
          assert.propertyVal(
            witness,
            `main.out[${i}][${j}]`,
            String(targetGrid[i][j])
          );
        }
      }
    });
  });
});
