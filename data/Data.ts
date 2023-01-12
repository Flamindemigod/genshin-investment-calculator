import {
  Artifact,
  artifacts,
  Character,
  characters,
  Weapon,
  weapons,
} from "genshin-db";

export const artifactSetsNames = artifacts("5", { matchCategories: true });
export const characterNames = characters("name", { matchCategories: true });
export const weaponNames = weapons("name", { matchCategories: true });

export const artifactGroups = [
  { sets: ["ArchaicPetra", "RetracingBolide"], cost: 20 },
  { sets: ["BlizzardStrayer", "HeartOfDepth"], cost: 20 },
  { sets: ["BloodstainedChivalry", "NoblesseOblige"], cost: 20 },
  { sets: ["CrimsonWitchOfFlames", "Lavawalker"], cost: 20 },
  { sets: ["DeepwoodMemories", "GildedDreams"], cost: 20 },
  { sets: ["DesertPavilionChronicle", "FlowerOfParadiseLost"], cost: 20 },
  { sets: ["EchoesOfAnOffering", "VermillionHereafter"], cost: 20 },
  { sets: ["EmblemOfSeveredFate", "ShimenawasReminiscence"], cost: 20 },
  { sets: ["GladiatorsFinale", "WanderersTroupe"], cost: 40 },
  { sets: ["HuskOfOpulentDreams", "OceanHuedClam"], cost: 20 },
  { sets: ["MaidenBeloved", "ViridescentVenerer"], cost: 20 },
  { sets: ["PaleFlame", "TenacityOfTheMillelith"], cost: 20 },
  { sets: ["ThunderingFury", "Thundersoother"], cost: 20 },
];

export const setKeyMapping = {
  ArchaicPetra: "Archaic Petra",
  BlizzardStrayer: "Blizzard Strayer",
  BloodstainedChivalry: "Bloodstained Chivalry",
  CrimsonWitchOfFlames: "Crimson Witch of Flames",
  DeepwoodMemories: "Deepwood Memories",
  DesertPavilionChronicle: "Desert Pavilion Chronicle",
  EchoesOfAnOffering: "Echoes of an Offering",
  EmblemOfSeveredFate: "Emblem of Severed Fate",
  FlowerOfParadiseLost: "Flower of Paradise Lost",
  GildedDreams: "Gilded Dreams",
  GladiatorsFinale: "Gladiator's Finale",
  HeartOfDepth: "Heart of Depth",
  HuskOfOpulentDreams: "Husk of Opulent Dreams",
  Lavawalker: "Lavawalker",
  MaidenBeloved: "Maiden Beloved",
  NoblesseOblige: "Noblesse Oblige",
  OceanHuedClam: "Ocean-Hued Clam",
  PaleFlame: "Pale Flame",
  RetracingBolide: "Retracing Bolide",
  ShimenawasReminiscence: "Shimenawa's Reminiscence",
  TenacityOfTheMillelith: "Tenacity of the Millelith",
  ThunderingFury: "Thundering Fury",
  Thundersoother: "Thundersoother",
  VermillionHereafter: "Vermillion Hereafter",
  ViridescentVenerer: "Viridescent Venerer",
  WanderersTroupe: "Wanderer's Troup",
};

export type ArtifactSetKey =
  | "ArchaicPetra" //Archaic Petra
  | "BlizzardStrayer" //Blizzard Strayer
  | "BloodstainedChivalry" //Bloodstained Chivalry
  | "CrimsonWitchOfFlames" //Crimson Witch of Flames
  | "DeepwoodMemories" //Deepwood Memories
  | "DesertPavilionChronicle" //Desert Pavilion Chronicle
  | "EchoesOfAnOffering" //Echoes of an Offering
  | "EmblemOfSeveredFate" //Emblem of Severed Fate
  | "FlowerOfParadiseLost" //Flower of Paradise Lost
  | "GildedDreams" //Gilded Dreams
  | "GladiatorsFinale" //Gladiator's Finale
  | "HeartOfDepth" //Heart of Depth
  | "HuskOfOpulentDreams" //Husk of Opulent Dreams
  | "Lavawalker" //Lavawalker
  | "MaidenBeloved" //Maiden Beloved
  | "NoblesseOblige" //Noblesse Oblige
  | "OceanHuedClam" //Ocean-Hued Clam
  | "PaleFlame" //Pale Flame
  | "RetracingBolide" //Retracing Bolide
  | "ShimenawasReminiscence" //Shimenawa's Reminiscence
  | "TenacityOfTheMillelith" //Tenacity of the Millelith
  | "ThunderingFury" //Thundering Fury
  | "Thundersoother" //Thundersoother
  | "VermillionHereafter" //Vermillion Hereafter
  | "ViridescentVenerer" //Viridescent Venerer
  | "WanderersTroupe"; //Wanderer's Troup

let artifactSets: {
  [key: string]: Artifact | undefined;
} = {};
Array.isArray(artifactSetsNames)
  ? artifactSetsNames.forEach((name) => {
      artifactSets[name] = artifacts(name);
    })
  : {};

let charactersSet: {
  [key: string]: Character | undefined;
} = {};
Array.isArray(characterNames)
  ? characterNames.forEach((name) => {
      charactersSet[name] = characters(name);
    })
  : {};

let weaponsSet: {
  [key: string]: Weapon | undefined;
} = {};
Array.isArray(weaponNames)
  ? weaponNames.forEach((name) => {
      weaponsSet[name] = weapons(name, { verboseCategories: true });
    })
  : {};

export { artifactSets, charactersSet, weaponsSet };
