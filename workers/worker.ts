import { Character } from "../character/character";
import { IPreset } from "../common/presets";
import { ArtifactSetKey } from "../data/Data";
import { genEmptyArtifact, StatKey } from "../generator/artifact";
import {
  generateArtifactCombinations,
  generateShapes,
} from "../generator/combinator";
import { Inventory } from "../generator/inventory";
import { getRollValue } from "../misc/getRollValue";
import { reviver } from "./reviver";

export interface WorkerProps {
  state: "start" | "stop";
  character: string;
  preset: IPreset;
  artifactSets: { sets: ArtifactSetKey[]; cost: number }[];
  resin: number;
}

let workers: Worker[] = [];
let i = 0;
function calcDamage(
  combination: {
    shape: string[];
    keys: {
      [k: string]: any;
    };
  },
  inv: Inventory,
  character: Character,
  preset: IPreset,
  post: any
) {
  const worker = new Worker(new URL("./combinationWorker.ts", import.meta.url));
  let flowers = inv.inventory
    .filter((item) => item.slotKey === "flower")
    .filter((item) => item.setKey === combination.keys[combination.shape[0]])
    .slice(0, 20);
  let plumes = inv.inventory
    .filter((item) => item.slotKey === "plume")
    .filter((item) => item.setKey === combination.keys[combination.shape[1]])
    .slice(0, 20);
  let sands = inv.inventory
    .filter((item) => item.slotKey === "sands")
    .filter((item) => item.setKey === combination.keys[combination.shape[2]])
    .slice(0, 20);
  let goblets = inv.inventory
    .filter((item) => item.slotKey === "goblet")
    .filter((item) => item.setKey === combination.keys[combination.shape[3]])
    .slice(0, 20);
  let circlets = inv.inventory
    .filter((item) => item.slotKey === "circlet")
    .slice(0, 20);

  flowers = flowers.length ? flowers : [genEmptyArtifact("flower")];
  plumes = plumes.length ? plumes : [genEmptyArtifact("plume")];
  sands = sands.length ? sands : [genEmptyArtifact("sands")];
  goblets = goblets.length ? goblets : [genEmptyArtifact("goblet")];
  circlets = circlets.length ? circlets : [genEmptyArtifact("circlet")];

  worker.onmessage = (e) => {
    post([e.data[1], e.data[2], e.data[3], e.data[4], i++]);
  };

  worker.postMessage([
    JSON.stringify(character),
    flowers,
    plumes,
    sands,
    goblets,
    circlets,
    preset,
  ]);

  workers.push(worker);
}

addEventListener("message", (e) => {
  const data = <WorkerProps>e.data;
  if (data.state === "start") {
    const resin: number = data.resin;
    const artifactSets: { sets: ArtifactSetKey[]; cost: number }[] =
      data.artifactSets;
    const char = reviver(data.character);
    const preset = data.preset;
    const optimizationContributions: StatKey[] =
      preset.optimizationContributions;

    const inv = artifactSets
      .map((sets) => new Inventory(resin / artifactSets.length, sets))
      .reduce((inv, a) => {
        return inv.addInventory(a);
      }, new Inventory(0, artifactSets[0]));
    const shapeArray = generateShapes(artifactSets.length);

    const artifactCombinationGenerator = generateArtifactCombinations(
      shapeArray,
      inv.inventory
    );
    inv.inventory.forEach(
      (item) => (item.rollValue = getRollValue(item, optimizationContributions))
    );
    inv.inventory.sort((a, b) => b.rollValue! - a.rollValue!);
    const rollValue1Sigma = inv.inventory[0].rollValue! * (1 - 0.341);
    inv.inventory = inv.inventory.filter((item, index) => {
      switch (true) {
        case optimizationContributions.includes(item.mainStatKey):
          break;
        case item.rollValue! > rollValue1Sigma:
          break;
        default:
          return false;
      }
      return true;
    });
    // if (inv.inventory.length > 75) {
    //   inv.inventory = inv.inventory.slice(0, 75);
    // }

    for (let combination of artifactCombinationGenerator) {
      {
        calcDamage(combination, inv, char, preset, postMessage);
      }
    }
  } else {
    workers.forEach((worker) => worker.terminate());
    close();
  }
});
