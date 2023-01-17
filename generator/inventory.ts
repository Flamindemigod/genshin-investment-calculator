import { ArtifactSetKey } from "../data/Data";
import { generateArtifact, IArtifact, StatKey } from "./artifact";
export class Inventory {
  inventory: IArtifact[];
  flowers!: IArtifact[];
  plumes!: IArtifact[];
  sands!: IArtifact[];
  goblets!: IArtifact[];
  circlets!: IArtifact[];
  constructor(
    resin: number,
    artifactGroup: { sets: ArtifactSetKey[]; cost: number }
  ) {
    this.inventory = [...Array(Math.floor(resin / artifactGroup.cost))].map(
      (_) => generateArtifact(artifactGroup.sets[0], artifactGroup.sets[1])
    );
  }

  g(post: any, optimizationContributions: StatKey[]) {
    // const shapeArray = generateShapes(2);
    // generateCombinations(shapeArray, this.inventory);
    // function getCombinations(arr: any[], post: any, total: number) {
    //   if (arr.length === 0) return [[]];
    //   let [current, ...rest] = arr;
    //   let combinations = getCombinations(rest, post, total);
    //   const k = current.vals.reduce(
    //     (a: any, string: any) => [
    //       ...a,
    //       ...combinations.map((c: any) => [string, ...c]),
    //     ],
    //     []
    //   );
    //   post(`${k.length} of ${total}`);
    //   return k;
    // }
    // post(`Original Artifacts: ${this.inventory.length}`);
    // const rollValueArray = this.inventory.map((item) =>
    //   getRollValue(item, optimizationContributions)
    // );
    // this.inventory = this.inventory.filter((item) => {
    //   switch (true) {
    //     case optimizationContributions.includes(item.mainStatKey):
    //       break;
    //     case getRollValue(item, optimizationContributions) >
    //       rollValueArray.reduce((partialSum, a) => partialSum + a, 0) /
    //         rollValueArray.length:
    //       break;
    //     default:
    //       return false;
    //   }
    //   return true;
    // });
    // post(`After Purge Artifacts: ${this.inventory.length}`);
    // this.flowers = this.inventory.filter((item) => item.slotKey === "flower");
    // this.plumes = this.inventory.filter((item) => item.slotKey === "plume");
    // this.sands = this.inventory.filter((item) => item.slotKey === "sands");
    // this.goblets = this.inventory.filter((item) => item.slotKey === "goblet");
    // this.circlets = this.inventory.filter((item) => item.slotKey === "circlet");
    // const genEmptyArtifact = (mainSlot: SlotKey) => {
    //   const EmptyArtifact: IArtifact = {
    //     level: 0,
    //     setKey: undefined,
    //     mainStatKey: undefined,
    //     rarity: 0,
    //     slotKey: mainSlot,
    //     substats: [],
    //   };
    //   return EmptyArtifact;
    // };
    // this.flowers = this.flowers.length
    //   ? this.flowers
    //   : [genEmptyArtifact("flower")];
    // this.plumes = this.plumes.length
    //   ? this.plumes
    //   : [genEmptyArtifact("plume")];
    // this.sands = this.sands.length ? this.sands : [genEmptyArtifact("sands")];
    // this.goblets = this.goblets.length
    //   ? this.goblets
    //   : [genEmptyArtifact("goblet")];
    // this.circlets = this.circlets.length
    //   ? this.circlets
    //   : [genEmptyArtifact("circlet")];
    // const total: number =
    //   this.flowers.length *
    //   this.plumes.length *
    //   this.sands.length *
    //   this.goblets.length *
    //   this.circlets.length;
    // // const array = [
    // //   { vals: this.flowers },
    // //   { vals: this.plumes },
    // //   { vals: this.sands },
    // //   { vals: this.goblets },
    // //   { vals: this.circlets },
    // // ];
    // // return getCombinations(array, post, total);
    // const cartesian = (...a: any[]) =>
    //   a.reduce((a, b) =>
    //     a.flatMap((d: any) => b.map((e: any) => [d, e].flat()))
    //   );
    // return cartesian(
    //   this.flowers,
    //   this.plumes,
    //   this.sands,
    //   this.goblets,
    //   this.circlets
    // ) as IArtifact[][];
  }
}
