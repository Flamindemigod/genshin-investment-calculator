import { ArtifactSetKey } from "../data/Data";
import { choose, weightedChoose } from "../misc/choose";
import shuffle from "../misc/shuffle";
import {
  getSubstats,
  StatDistribution,
  Substats,
} from "./artifactProbabilities";
export interface IArtifact {
  setKey: ArtifactSetKey; //e.g. "GladiatorsFinale"
  slotKey: SlotKey; //e.g. "plume"
  level: number; //0-20 inclusive
  rarity: number; //1-5 inclusive
  mainStatKey: StatKey;
  substats: ISubstat[];
  rollValue?: number;
}

interface ISubstat {
  key: StatKey; //e.g. "critDMG_"
  value: number; //e.g. 19.4
  substats: number; //Number of Substats
}

export type SlotKey = "flower" | "plume" | "sands" | "goblet" | "circlet";

export const StatKeyMapping = {
  hp: "HP",
  hp_: "HP%",
  atk: "ATK",
  atk_: "ATK%",
  def: "DEF",
  def_: "DEF%",
  eleMas: "Elemental Mastery",
  enerRech_: "Energy Recharge",
  heal_: "Healing Bonus",
  critRate_: "Crit Rate",
  critDMG_: "Crit DMG",
  physical_dmg_: "Physical DMG Bonus",
  anemo_dmg_: "Anemo DMG Bonus",
  geo_dmg_: "Geo DMG Bonus",
  electro_dmg_: "Electro DMG Bonus",
  hydro_dmg_: "Hydro DMG Bonus",
  pyro_dmg_: "Pyro DMG Bonus",
  cryo_dmg_: "Cryo DMG Bonus",
  dendro_dmg_: "Dendro DMG Bonus",
};

export type StatKey =
  | "hp" //HP
  | "hp_" //HP%
  | "atk" //ATK
  | "atk_" //ATK%
  | "def" //DEF
  | "def_" //DEF%
  | "eleMas" //Elemental Mastery
  | "enerRech_" //Energy Recharge
  | "heal_" //Healing Bonus
  | "critRate_" //Crit Rate
  | "critDMG_" //Crit DMG
  | "physical_dmg_" //Physical DMG Bonus
  | "anemo_dmg_" //Anemo DMG Bonus
  | "geo_dmg_" //Geo DMG Bonus
  | "electro_dmg_" //Electro DMG Bonus
  | "hydro_dmg_" //Hydro DMG Bonus
  | "pyro_dmg_" //Pyro DMG Bonus
  | "cryo_dmg_" //Cryo DMG Bonus
  | "dendro_dmg_" //Dendro DMG Bonus
  | undefined;

export const generateArtifact = (
  setKey1: ArtifactSetKey,
  setKey2: ArtifactSetKey,
  mainStat?: StatKey,
  slot?: SlotKey
) => {
  const artifactSet: ArtifactSetKey = choose([setKey1, setKey2]);
  const artifactSlot: SlotKey =
    slot ?? choose(Object.keys(StatDistribution.mainStats));
  const artifactMainStat: StatKey =
    mainStat ?? choose(Object.keys(StatDistribution.mainStats[artifactSlot]));
  // const subStatDist: number[] = choose(subStatDistributionTable);
  // let allowedSubstats = Object.keys(
  //   StatDistribution.subStats[artifactSlot][artifactMainStat!]
  // );

  // const subStats: ISubstat[] = [
  //   ...shuffle<number>(subStatDist).map((stat) => {
  //     const statType: StatKey = weightedChoose(
  //       allowedSubstats,
  //       allowedSubstats.map(
  //         (substat) =>
  //           StatDistribution.subStats[artifactSlot][artifactMainStat!][substat]
  //       )
  //     );
  //     allowedSubstats = allowedSubstats.filter((stat) => stat !== statType);
  //     return {
  //       key: statType,
  //       substats: stat + 1,
  //       value: new Array(stat + 1)
  //         .fill(1)
  //         .map((subStatIndex) => {
  //           const val = choose(Substats[statType!]);
  //           return val;
  //         })
  //         .reduce((partialSum, a) => partialSum + a, 0),
  //     };
  //   }),
  // ];
  const substatKeys = getSubstats(artifactMainStat as NonNullable<StatKey>);
  let numberOfRolls = weightedChoose([4, 5], [90, 10]);
  let subStats: ISubstat[] = substatKeys.map(
    (substat: StatKey) =>
      ({
        key: substat,
        value: choose(Substats[substat!]),
        substats: 1,
      } as ISubstat)
  );
  [...Array(numberOfRolls).keys()].forEach((index) => {
    const key = choose([...subStats.keys()]);
    subStats[key] = {
      ...subStats[key],
      substats: subStats[key].substats + 1,
      value: subStats[key].value + choose(Substats[subStats[key].key!]),
    };
  });
  const artifact: IArtifact = {
    level: 20,
    mainStatKey: artifactMainStat,
    rarity: 5,
    setKey: artifactSet,
    slotKey: artifactSlot,
    substats: subStats,
  };
  return artifact;
};

export const genEmptyArtifact = (mainSlot: SlotKey) => {
  const EmptyArtifact: IArtifact = {
    level: 0,
    setKey: undefined,
    mainStatKey: undefined,
    rarity: 0,
    slotKey: mainSlot,
    substats: [],
  };
  return EmptyArtifact;
};
