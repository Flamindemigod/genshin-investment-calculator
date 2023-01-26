import { Character } from "../character/character";
import { Raiden } from "../character/RaidenShogun";
import { presets } from "../character/RaidenShogun/presets";
import { IPreset } from "../common/presets";
import { ArtifactSetKey } from "../data/Data";
import { genEmptyArtifact, StatKey } from "../generator/artifact";
import {
  generateArtifactCombinations,
  generateShapes,
} from "../generator/combinator";
import { Inventory } from "../generator/inventory";
import { getRollValue } from "../misc/getRollValue";
import { EngulfingLightning } from "../weapons/engulfinglightning";
let G = require("generatorics");
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
  console.log(combination);
  let flowers = inv.inventory
    .filter((item) => item.slotKey === "flower")
    .filter((item) => item.setKey === combination.keys[combination.shape[0]])
    .slice(0, 10);
  let plumes = inv.inventory
    .filter((item) => item.slotKey === "plume")
    .filter((item) => item.setKey === combination.keys[combination.shape[1]])
    .slice(0, 10);
  let sands = inv.inventory
    .filter((item) => item.slotKey === "sands")
    .filter((item) => item.setKey === combination.keys[combination.shape[2]])
    .slice(0, 10);
  let goblets = inv.inventory
    .filter((item) => item.slotKey === "goblet")
    .filter((item) => item.setKey === combination.keys[combination.shape[3]])
    .slice(0, 10);
  let circlets = inv.inventory
    .filter((item) => item.slotKey === "circlet")
    .slice(0, 10);

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
  if (e.data[0] == "start") {
    let runningState = "running";
    const resin: number = e.data[1];
    const artifactSets: { sets: ArtifactSetKey[]; cost: number } = e.data[2];
    // const artifactSets1: { sets: ArtifactSetKey[]; cost: number } = e.data[3];
    const raiden = new Raiden(90, { normal: 2, skill: 9, burst: 10 }, 2, true);
    raiden.equipWeapon(new EngulfingLightning(90, true, 5));
    const preset = presets[0];
    let builds: string[][] = [];
    const optimizationContributions: StatKey[] =
      preset.optimizationContributions;
    const inv = new Inventory(resin, artifactSets);
    // const inv1 = new Inventory(resin / 2, artifactSets1);

    const shapeArray = generateShapes(2);

    const artifactCombinationGenerator = generateArtifactCombinations(
      shapeArray,
      inv.inventory
    );
    inv.inventory.forEach(
      (item) => (item.rollValue = getRollValue(item, optimizationContributions))
    );
    inv.inventory.sort((a, b) => b.rollValue! - a.rollValue!);
    // console.log(inv.inventory.length);
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
    console.log(inv.inventory.length);
    // if (inv.inventory.length > 75) {
    //   inv.inventory = inv.inventory.slice(0, 75);
    // }
    // console.log(inv.inventory.length);

    for (let combination of artifactCombinationGenerator) {
      {
        calcDamage(combination, inv, raiden, preset, postMessage);
      }
    }
  } else {
    workers.forEach((worker) => worker.terminate());
    close();
  }
});
