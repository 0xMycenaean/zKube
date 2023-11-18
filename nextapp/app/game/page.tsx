"use client";
import { useRef, useState } from "react";
import styles from "./page.module.css";
import { useGrid } from "./useGrid";
import { GenerateProof } from "./zk/generateProof";
import { Proof } from "circuits";

export default function Game() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [proof, setProof] = useState<Proof>();

  useGrid(sceneRef);

  return (
    <div className={styles.gameContainer}>
      <div ref={sceneRef} className={styles.sceneContainer} />
      <div className={styles.gameUI}>
        <div className={styles.availableFunctions}></div>
        <div className={styles.chosenFunctions}></div>
        <div className={styles.actions}>
          <button>submit solution</button>
        </div>
      </div>
      <div className={styles.footer}>
        <h4>
          Blocks Left
          <br />
          <span>100</span>
        </h4>
        <h4>
          Score <br />
          <span>5</span>
        </h4>
      </div>

      <GenerateProof
        initialGrid={[
          [1, 1, 2, 0, 0, 0, 0, 0],
          [1, 2, 0, 0, 0, 0, 0, 0],
          [2, 0, 0, 0, 0, 0, 0, 0],
          [2, 0, 0, 0, 0, 0, 0, 0],
          [1, 2, 0, 0, 0, 0, 0, 0],
          [1, 1, 2, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
        ]}
        finalGrid={[
          [2, 2, 2, 1, 0, 0, 0, 0],
          [2, 2, 1, 0, 0, 0, 0, 0],
          [2, 2, 0, 0, 0, 0, 0, 0],
          [2, 1, 0, 0, 0, 0, 0, 0],
          [2, 2, 1, 0, 0, 0, 0, 0],
          [2, 2, 2, 1, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
        ]}
        account={"0x0"}
        selectedFunctions={[
          [
            [0, 1, 2],
            [0, 0, 0],
          ],
          [
            [0, 0, 0],
            [1, 1, 0],
          ],
        ]}
        onResult={(result) => setProof(result)}
      />
    </div>
  );
}
