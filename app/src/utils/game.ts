import { Game } from "../types/Game";

export function isGameFinished(currentBlock: bigint, game: Game) {
  return (
    currentBlock >=
    BigInt(Number(game.startingBlock) + game.interval * game.numberOfTurns)
  );
}

export function hasGameStarted(currentBlock: bigint, game: Game) {
  return currentBlock >= BigInt(game.startingBlock);
}