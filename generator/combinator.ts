import bigCartesian from "big-cartesian";
import { ArtifactSetKey } from "../data/Data";
import { getRollValue } from "../misc/getRollValue";
import { genEmptyArtifact, IArtifact, StatKey } from "./artifact";

let G = require("generatorics");

function makeShapeKeys(length: number) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    result += characters.charAt(i);
  }
  return result.split("");
}

export function generateShapes(N: number) {
  const shapeKey = makeShapeKeys(N);
  let shapeArray = [];
  const k = [...Array(4).keys()].map((key, index) =>
    shapeKey.slice(0, index + 1)
  );
  for (let shape of G.cartesian(...k)) {
    let shapeCopy = JSON.parse(JSON.stringify(shape));
    shapeCopy.push("*");
    shapeArray.push(shapeCopy);
  }

  return shapeArray;
}

export function* generateArtifactCombinations(
  shapeArray: string[][],
  inventory: IArtifact[]
) {
  const possibleSets: Set<ArtifactSetKey> = new Set(
    inventory.map((artifact) => artifact.setKey)
  );

  for (let shape of shapeArray) {
    const arrayKeys = [...new Set(shape)];
    for (let keyPermutaion of G.permutation(
      [...possibleSets],
      arrayKeys.length - 1
    )) {
      let keyPair = Object.fromEntries(
        arrayKeys.map((_, i) => [arrayKeys[i], keyPermutaion[i]])
      );
      yield {
        shape: shape,
        keys: keyPair,
      };
    }
  }
}
