import bigCartesian from "big-cartesian";
import { calculate } from "../calculator";
import { Character } from "../character/character";
import { Raiden } from "../character/RaidenShogun";
import { defaultBuffs } from "../common";
import { ArtifactSetKey } from "../data/Data";
import { genEmptyArtifact, IArtifact, StatKey } from "../generator/artifact";
import {
  generateArtifactCombinations,
  generateShapes,
} from "../generator/combinator";
import { Inventory } from "../generator/inventory";
import { getRollValue } from "../misc/getRollValue";
import { TheCatch } from "../weapons/thecatch";
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
  post: any
) {
  const worker = new Worker(new URL("./combinationWorker.ts", import.meta.url));
  let flowers = inv.inventory
    .filter((item) => item.slotKey === "flower")
    .filter((item) => item.setKey === combination.keys[combination.shape[0]]);
  let plumes = inv.inventory
    .filter((item) => item.slotKey === "plume")
    .filter((item) => item.setKey === combination.keys[combination.shape[1]]);
  let sands = inv.inventory
    .filter((item) => item.slotKey === "sands")
    .filter((item) => item.setKey === combination.keys[combination.shape[2]]);
  let goblets = inv.inventory
    .filter((item) => item.slotKey === "goblet")
    .filter((item) => item.setKey === combination.keys[combination.shape[3]]);
  let circlets = inv.inventory.filter((item) => item.slotKey === "circlet");

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
  ]);

  workers.push(worker);
  //   let i = 0;
  //   for (let build of G.cartesian(
  //     ...[flowers, plumes, sands, goblets, circlets]
  //   )) {
  //     character.equipArtifacts(build);
  //     console.log(i++);
  //     console.log(build);
  //     const dmg = character.getDamage([
  //       {
  //         MV: { ATK: 681, DEF: 0, EM: 0, HP: 0 },
  //         buffs: {
  //           ...character.getBuffs({
  //             artifactPassive: true,
  //             weaponPassive: true,
  //           }),
  //           atk_: 0.2,
  //           atk: 2000,
  //           resistance: { ...defaultBuffs.resistance, electro: -40 },
  //           critDMG_Elemental: {
  //             ...defaultBuffs.critDMG_Elemental,
  //             electro: 1.2,
  //           },
  //         },
  //         DamageType: "electro",
  //         reaction: undefined,
  //         SkillType: "burst",
  //       },
  //     ]);
  //     post([dmg, build, character.getCharacterStats(), "running"]);
  //   }
  //   post([0, [], "finished"]);
}

addEventListener("message", (e) => {
  if (e.data[0] == "start") {
    let runningState = "running";
    const resin: number = e.data[1];
    const artifactSets: { sets: ArtifactSetKey[]; cost: number } = e.data[2];
    // const artifactSets1: { sets: ArtifactSetKey[]; cost: number } = e.data[3];
    const raiden = new Raiden(90, { normal: 2, skill: 9, burst: 10 }, 2, true);
    raiden.equipWeapon(new TheCatch(90, true, 5));
    let builds: string[][] = [];
    const optimizationContributions: StatKey[] = [
      "atk_",
      "critRate_",
      "critDMG_",
      "electro_dmg_",
      "enerRech_",
    ];
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
    console.log(inv.inventory.length);
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
    if (inv.inventory.length > 75) {
      inv.inventory = inv.inventory.slice(0, 75);
    }
    console.log(inv.inventory.length);

    for (let combination of artifactCombinationGenerator) {
      {
        calcDamage(combination, inv, raiden, postMessage);
      }
    }
  } else {
    workers.forEach((worker) => worker.terminate());
    close();
  }
});
