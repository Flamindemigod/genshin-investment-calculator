import { randomInt } from "crypto";
import { ArtifactSetKey } from "../data/Data";
import { choose, weightedChoose } from "../misc/choose";

export interface IArtifact {
  setKey: ArtifactSetKey; //e.g. "GladiatorsFinale"
  slotKey: SlotKey; //e.g. "plume"
  level: number; //0-20 inclusive
  rarity: number; //1-5 inclusive
  mainStatKey: StatKey;
  substats: ISubstat[];
}

interface ISubstat {
  key: StatKey; //e.g. "critDMG_"
  value: number; //e.g. 19.4
}

type SlotKey = "flower" | "plume" | "sands" | "goblet" | "circlet";

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
  | "dendro_dmg_"; //Dendro DMG Bonus

export const MainStats = {
  hp: 4780,
  hp_: 46.6,
  atk: 311,
  atk_: 46.6,
  def_: 58.3,
  critRate_: 31.1,
  critDMG_: 62.2,
  enerRech_: 51.8,
  heal_: 35.9,
  eleMas: 186.5,
  pyro_dmg_: 46.6,
  cryo_dmg_: 46.6,
  hydro_dmg_: 46.6,
  electro_dmg_: 46.6,
  dendro_dmg_: 46.6,
  anemo_dmg_: 46.6,
  geo_dmg_: 46.6,
  physical_dmg_: 58.3,
};

export const Substats: any = {
  hp: [209.13, 239.0, 268.88, 298.75],
  hp_: [4.08, 4.66, 5.25, 5.83],
  atk: [13.62, 15.56, 17.51, 19.45],
  atk_: [4.08, 4.66, 5.25, 5.83],
  def: [16.2, 18.52, 20.83, 23.15],
  def_: [5.1, 5.83, 6.56, 7.29],
  critRate_: [2.72, 3.11, 3.5, 3.89],
  critDMG_: [5.44, 6.22, 6.99, 7.77],
  enerRech_: [4.53, 5.18, 5.83, 6.48],
  eleMas: [16.32, 18.65, 20.98, 23.31],
};

interface IStatDistribution {
  mainStats: {
    flower: { hp: 1 };
    plume: { atk: 1 };
    sands: {
      hp_: 0.2668;
      atk_: 0.2668;
      def_: 0.2668;
      enerRech_: 0.1;
      eleMas: 0.1;
    };
    goblet: {
      hp_: 0.1925;
      atk_: 0.1925;
      def_: 0.1925;
      eleMas: 0.025;
      pyro_dmg_: 0.05;
      cryo_dmg_: 0.05;
      hydro_dmg_: 0.05;
      electro_dmg_: 0.05;
      dendro_dmg_: 0.05;
      anemo_dmg_: 0.05;
      geo_dmg_: 0.05;
      physical_dmg_: 0.05;
    };
    circlet: {
      hp_: 0.22;
      atk_: 0.22;
      def_: 0.22;
      eleMas: 0.04;
      critRate_: 0.1;
      critDMG_: 0.1;
      heal_: 0.1;
    };
  };
  subStats: {
    flower: {
      hp: {
        atk: 0.1579;
        def: 0.1579;
        hp_: 0.1053;
        atk_: 0.1053;
        def_: 0.1053;
        enerRech_: 0.1053;
        eleMas: 0.1053;
        critRate_: 0.0789;
        critDMG_: 0.0789;
      };
    };
    plume: {
      atk: {
        hp: 0.1579;
        def: 0.1579;
        hp_: 0.1053;
        atk_: 0.1053;
        def_: 0.1053;
        enerRech_: 0.1053;
        eleMas: 0.1053;
        critRate_: 0.0789;
        critDMG_: 0.0789;
      };
    };
    sands: {
      hp_: {
        hp: 0.15;
        atk: 0.15;
        def: 0.15;
        atk_: 0.1;
        def_: 0.1;
        enerRech_: 0.1;
        eleMas: 0.1;
        critRate_: 0.075;
        critDMG_: 0.075;
      };
      atk_: {
        hp: 0.15;
        atk: 0.15;
        def: 0.15;
        hp_: 0.1;
        def_: 0.1;
        enerRech_: 0.1;
        eleMas: 0.1;
        critRate_: 0.075;
        critDMG_: 0.075;
      };
      def_: {
        hp: 0.15;
        atk: 0.15;
        def: 0.15;
        atk_: 0.1;
        hp_: 0.1;
        enerRech_: 0.1;
        eleMas: 0.1;
        critRate_: 0.075;
        critDMG_: 0.075;
      };
      enerRech_: {
        hp: 0.15;
        atk: 0.15;
        def: 0.15;
        atk_: 0.1;
        def_: 0.1;
        hp_: 0.1;
        eleMas: 0.1;
        critRate_: 0.075;
        critDMG_: 0.075;
      };
      eleMas: {
        hp: 0.15;
        atk: 0.15;
        def: 0.15;
        hp_: 0.1;
        atk_: 0.1;
        def_: 0.1;
        enerRech_: 0.1;
        critRate_: 0.075;
        critDMG_: 0.075;
      };
    };
    goblet: {
      hp_: {
        hp: 0.15;
        atk: 0.15;
        def: 0.15;
        atk_: 0.1;
        def_: 0.1;
        enerRech_: 0.1;
        eleMas: 0.1;
        critRate_: 0.075;
        critDMG_: 0.075;
      };
      atk_: {
        hp: 0.15;
        atk: 0.15;
        def: 0.15;
        hp_: 0.1;
        def_: 0.1;
        enerRech_: 0.1;
        eleMas: 0.1;
        critRate_: 0.075;
        critDMG_: 0.075;
      };
      def_: {
        hp: 0.15;
        atk: 0.15;
        def: 0.15;
        atk_: 0.1;
        hp_: 0.1;
        enerRech_: 0.1;
        eleMas: 0.1;
        critRate_: 0.075;
        critDMG_: 0.075;
      };
      eleMas: {
        hp: 0.15;
        atk: 0.15;
        def: 0.15;
        hp_: 0.1;
        atk_: 0.1;
        def_: 0.1;
        enerRech_: 0.1;
        critRate_: 0.075;
        critDMG_: 0.075;
      };
      pyro_dmg_: {
        hp: 0.1364;
        atk: 0.1364;
        def: 0.1364;
        hp_: 0.0909;
        atk_: 0.0909;
        def_: 0.0909;
        enerRech_: 0.0909;
        eleMas: 0.0909;
        critRate_: 0.0682;
        critDMG_: 0.0682;
      };
      cryo_dmg_: {
        hp: 0.1364;
        atk: 0.1364;
        def: 0.1364;
        hp_: 0.0909;
        atk_: 0.0909;
        def_: 0.0909;
        enerRech_: 0.0909;
        eleMas: 0.0909;
        critRate_: 0.0682;
        critDMG_: 0.0682;
      };
      hydro_dmg_: {
        hp: 0.1364;
        atk: 0.1364;
        def: 0.1364;
        hp_: 0.0909;
        atk_: 0.0909;
        def_: 0.0909;
        enerRech_: 0.0909;
        eleMas: 0.0909;
        critRate_: 0.0682;
        critDMG_: 0.0682;
      };
      electro_dmg_: {
        hp: 0.1364;
        atk: 0.1364;
        def: 0.1364;
        hp_: 0.0909;
        atk_: 0.0909;
        def_: 0.0909;
        enerRech_: 0.0909;
        eleMas: 0.0909;
        critRate_: 0.0682;
        critDMG_: 0.0682;
      };
      dendro_dmg_: {
        hp: 0.1364;
        atk: 0.1364;
        def: 0.1364;
        hp_: 0.0909;
        atk_: 0.0909;
        def_: 0.0909;
        enerRech_: 0.0909;
        eleMas: 0.0909;
        critRate_: 0.0682;
        critDMG_: 0.0682;
      };
      anemo_dmg_: {
        hp: 0.1364;
        atk: 0.1364;
        def: 0.1364;
        hp_: 0.0909;
        atk_: 0.0909;
        def_: 0.0909;
        enerRech_: 0.0909;
        eleMas: 0.0909;
        critRate_: 0.0682;
        critDMG_: 0.0682;
      };
      geo_dmg_: {
        hp: 0.1364;
        atk: 0.1364;
        def: 0.1364;
        hp_: 0.0909;
        atk_: 0.0909;
        def_: 0.0909;
        enerRech_: 0.0909;
        eleMas: 0.0909;
        critRate_: 0.0682;
        critDMG_: 0.0682;
      };
      physical_dmg_: {
        hp: 0.1364;
        atk: 0.1364;
        def: 0.1364;
        hp_: 0.0909;
        atk_: 0.0909;
        def_: 0.0909;
        enerRech_: 0.0909;
        eleMas: 0.0909;
        critRate_: 0.0682;
        critDMG_: 0.0682;
      };
    };
    circlet: {
      hp_: {
        hp: 0.15;
        atk: 0.15;
        def: 0.15;
        atk_: 0.1;
        def_: 0.1;
        enerRech_: 0.1;
        eleMas: 0.1;
        critRate_: 0.075;
        critDMG_: 0.075;
      };
      atk_: {
        hp: 0.15;
        atk: 0.15;
        def: 0.15;
        hp_: 0.1;
        def_: 0.1;
        enerRech_: 0.1;
        eleMas: 0.1;
        critRate_: 0.075;
        critDMG_: 0.075;
      };
      def_: {
        hp: 0.15;
        atk: 0.15;
        def: 0.15;
        atk_: 0.1;
        hp_: 0.1;
        enerRech_: 0.1;
        eleMas: 0.1;
        critRate_: 0.075;
        critDMG_: 0.075;
      };
      eleMas: {
        hp: 0.15;
        atk: 0.15;
        def: 0.15;
        hp_: 0.1;
        atk_: 0.1;
        def_: 0.1;
        enerRech_: 0.1;
        critRate_: 0.075;
        critDMG_: 0.075;
      };
      critRate_: {
        hp: 0.1463;
        atk: 0.1463;
        def: 0.1463;
        atk_: 0.0976;
        hp_: 0.0976;
        enerRech_: 0.0976;
        eleMas: 0.0976;
        critDMG_: 0.0732;
      };
      critDMG_: {
        hp: 0.1463;
        atk: 0.1463;
        def: 0.1463;
        atk_: 0.0976;
        hp_: 0.0976;
        enerRech_: 0.0976;
        eleMas: 0.0976;
        critRate_: 0.0732;
      };
      heal_: {
        hp: 0.1364;
        atk: 0.1364;
        def: 0.1364;
        atk_: 0.0909;
        hp_: 0.0909;
        enerRech_: 0.0909;
        eleMas: 0.0909;
        critRate_: 0.0682;
        critDMG_: 0.0682;
      };
    };
  };
}

const StatDistribution: any = {
  mainStats: {
    flower: { hp: 1 },
    plume: { atk: 1 },
    sands: {
      hp_: 0.2668,
      atk_: 0.2668,
      def_: 0.2668,
      enerRech_: 0.1,
      eleMas: 0.1,
    },
    goblet: {
      hp_: 0.1925,
      atk_: 0.1925,
      def_: 0.1925,
      eleMas: 0.025,
      pyro_dmg_: 0.05,
      cryo_dmg_: 0.05,
      hydro_dmg_: 0.05,
      electro_dmg_: 0.05,
      dendro_dmg_: 0.05,
      anemo_dmg_: 0.05,
      geo_dmg_: 0.05,
      physical_dmg_: 0.05,
    },
    circlet: {
      hp_: 0.22,
      atk_: 0.22,
      def_: 0.22,
      eleMas: 0.04,
      critRate_: 0.1,
      critDMG_: 0.1,
      heal_: 0.1,
    },
  },
  subStats: {
    flower: {
      hp: {
        atk: 0.1579,
        def: 0.1579,
        hp_: 0.1053,
        atk_: 0.1053,
        def_: 0.1053,
        enerRech_: 0.1053,
        eleMas: 0.1053,
        critRate_: 0.0789,
        critDMG_: 0.0789,
      },
    },
    plume: {
      atk: {
        hp: 0.1579,
        def: 0.1579,
        hp_: 0.1053,
        atk_: 0.1053,
        def_: 0.1053,
        enerRech_: 0.1053,
        eleMas: 0.1053,
        critRate_: 0.0789,
        critDMG_: 0.0789,
      },
    },
    sands: {
      hp_: {
        hp: 0.15,
        atk: 0.15,
        def: 0.15,
        atk_: 0.1,
        def_: 0.1,
        enerRech_: 0.1,
        eleMas: 0.1,
        critRate_: 0.075,
        critDMG_: 0.075,
      },
      atk_: {
        hp: 0.15,
        atk: 0.15,
        def: 0.15,
        hp_: 0.1,
        def_: 0.1,
        enerRech_: 0.1,
        eleMas: 0.1,
        critRate_: 0.075,
        critDMG_: 0.075,
      },
      def_: {
        hp: 0.15,
        atk: 0.15,
        def: 0.15,
        atk_: 0.1,
        hp_: 0.1,
        enerRech_: 0.1,
        eleMas: 0.1,
        critRate_: 0.075,
        critDMG_: 0.075,
      },
      enerRech_: {
        hp: 0.15,
        atk: 0.15,
        def: 0.15,
        atk_: 0.1,
        def_: 0.1,
        hp_: 0.1,
        eleMas: 0.1,
        critRate_: 0.075,
        critDMG_: 0.075,
      },
      eleMas: {
        hp: 0.15,
        atk: 0.15,
        def: 0.15,
        hp_: 0.1,
        atk_: 0.1,
        def_: 0.1,
        enerRech_: 0.1,
        critRate_: 0.075,
        critDMG_: 0.075,
      },
    },
    goblet: {
      hp_: {
        hp: 0.15,
        atk: 0.15,
        def: 0.15,
        atk_: 0.1,
        def_: 0.1,
        enerRech_: 0.1,
        eleMas: 0.1,
        critRate_: 0.075,
        critDMG_: 0.075,
      },
      atk_: {
        hp: 0.15,
        atk: 0.15,
        def: 0.15,
        hp_: 0.1,
        def_: 0.1,
        enerRech_: 0.1,
        eleMas: 0.1,
        critRate_: 0.075,
        critDMG_: 0.075,
      },
      def_: {
        hp: 0.15,
        atk: 0.15,
        def: 0.15,
        atk_: 0.1,
        hp_: 0.1,
        enerRech_: 0.1,
        eleMas: 0.1,
        critRate_: 0.075,
        critDMG_: 0.075,
      },
      eleMas: {
        hp: 0.15,
        atk: 0.15,
        def: 0.15,
        hp_: 0.1,
        atk_: 0.1,
        def_: 0.1,
        enerRech_: 0.1,
        critRate_: 0.075,
        critDMG_: 0.075,
      },
      pyro_dmg_: {
        hp: 0.1364,
        atk: 0.1364,
        def: 0.1364,
        hp_: 0.0909,
        atk_: 0.0909,
        def_: 0.0909,
        enerRech_: 0.0909,
        eleMas: 0.0909,
        critRate_: 0.0682,
        critDMG_: 0.0682,
      },
      cryo_dmg_: {
        hp: 0.1364,
        atk: 0.1364,
        def: 0.1364,
        hp_: 0.0909,
        atk_: 0.0909,
        def_: 0.0909,
        enerRech_: 0.0909,
        eleMas: 0.0909,
        critRate_: 0.0682,
        critDMG_: 0.0682,
      },
      hydro_dmg_: {
        hp: 0.1364,
        atk: 0.1364,
        def: 0.1364,
        hp_: 0.0909,
        atk_: 0.0909,
        def_: 0.0909,
        enerRech_: 0.0909,
        eleMas: 0.0909,
        critRate_: 0.0682,
        critDMG_: 0.0682,
      },
      electro_dmg_: {
        hp: 0.1364,
        atk: 0.1364,
        def: 0.1364,
        hp_: 0.0909,
        atk_: 0.0909,
        def_: 0.0909,
        enerRech_: 0.0909,
        eleMas: 0.0909,
        critRate_: 0.0682,
        critDMG_: 0.0682,
      },
      dendro_dmg_: {
        hp: 0.1364,
        atk: 0.1364,
        def: 0.1364,
        hp_: 0.0909,
        atk_: 0.0909,
        def_: 0.0909,
        enerRech_: 0.0909,
        eleMas: 0.0909,
        critRate_: 0.0682,
        critDMG_: 0.0682,
      },
      anemo_dmg_: {
        hp: 0.1364,
        atk: 0.1364,
        def: 0.1364,
        hp_: 0.0909,
        atk_: 0.0909,
        def_: 0.0909,
        enerRech_: 0.0909,
        eleMas: 0.0909,
        critRate_: 0.0682,
        critDMG_: 0.0682,
      },
      geo_dmg_: {
        hp: 0.1364,
        atk: 0.1364,
        def: 0.1364,
        hp_: 0.0909,
        atk_: 0.0909,
        def_: 0.0909,
        enerRech_: 0.0909,
        eleMas: 0.0909,
        critRate_: 0.0682,
        critDMG_: 0.0682,
      },
      physical_dmg_: {
        hp: 0.1364,
        atk: 0.1364,
        def: 0.1364,
        hp_: 0.0909,
        atk_: 0.0909,
        def_: 0.0909,
        enerRech_: 0.0909,
        eleMas: 0.0909,
        critRate_: 0.0682,
        critDMG_: 0.0682,
      },
    },
    circlet: {
      hp_: {
        hp: 0.15,
        atk: 0.15,
        def: 0.15,
        atk_: 0.1,
        def_: 0.1,
        enerRech_: 0.1,
        eleMas: 0.1,
        critRate_: 0.075,
        critDMG_: 0.075,
      },
      atk_: {
        hp: 0.15,
        atk: 0.15,
        def: 0.15,
        hp_: 0.1,
        def_: 0.1,
        enerRech_: 0.1,
        eleMas: 0.1,
        critRate_: 0.075,
        critDMG_: 0.075,
      },
      def_: {
        hp: 0.15,
        atk: 0.15,
        def: 0.15,
        atk_: 0.1,
        hp_: 0.1,
        enerRech_: 0.1,
        eleMas: 0.1,
        critRate_: 0.075,
        critDMG_: 0.075,
      },
      eleMas: {
        hp: 0.15,
        atk: 0.15,
        def: 0.15,
        hp_: 0.1,
        atk_: 0.1,
        def_: 0.1,
        enerRech_: 0.1,
        critRate_: 0.075,
        critDMG_: 0.075,
      },
      critRate_: {
        hp: 0.1463,
        atk: 0.1463,
        def: 0.1463,
        atk_: 0.0976,
        hp_: 0.0976,
        enerRech_: 0.0976,
        eleMas: 0.0976,
        critDMG_: 0.0732,
      },
      critDMG_: {
        hp: 0.1463,
        atk: 0.1463,
        def: 0.1463,
        atk_: 0.0976,
        hp_: 0.0976,
        enerRech_: 0.0976,
        eleMas: 0.0976,
        critRate_: 0.0732,
      },
      heal_: {
        hp: 0.1364,
        atk: 0.1364,
        def: 0.1364,
        atk_: 0.0909,
        hp_: 0.0909,
        enerRech_: 0.0909,
        eleMas: 0.0909,
        critRate_: 0.0682,
        critDMG_: 0.0682,
      },
    },
  },
};

const subStatDistributionTable = [
  [5, 0, 0, 0],
  [4, 1, 0, 0],
  [3, 2, 0, 0],
  [3, 1, 1, 0],
  [2, 2, 1, 0],
  [2, 1, 1, 1],
  [4, 0, 0, 0],
  [3, 1, 0, 0],
  [2, 2, 0, 0],
  [2, 1, 1, 0],
  [1, 1, 1, 1],
  [4, 0, 0, 0],
  [3, 1, 0, 0],
  [2, 2, 0, 0],
  [2, 1, 1, 0],
  [1, 1, 1, 1],
  [4, 0, 0, 0],
  [3, 1, 0, 0],
  [2, 2, 0, 0],
  [2, 1, 1, 0],
  [1, 1, 1, 1],
];

export const generateArtifact = (
  setKey1: ArtifactSetKey,
  setKey2: ArtifactSetKey
) => {
  const artifactSet: ArtifactSetKey = choose([setKey1, setKey2]);
  const artifactSlot: SlotKey = choose(Object.keys(StatDistribution.mainStats));
  const artifactMainStat: StatKey = choose(
    Object.keys(StatDistribution.mainStats[artifactSlot])
  );
  const subStatDist: number[] = choose(subStatDistributionTable);
  let allowedSubstats = Object.keys(
    StatDistribution.subStats[artifactSlot][artifactMainStat]
  );

  const subStats: ISubstat[] = [
    ...subStatDist.map((stat) => {
      const statType: StatKey = weightedChoose(
        allowedSubstats,
        allowedSubstats.map(
          (substat) =>
            StatDistribution.subStats[artifactSlot][artifactMainStat][substat]
        )
      );
      allowedSubstats = allowedSubstats.filter((stat) => stat !== statType);
      return {
        key: statType,
        value: new Array(stat + 1)
          .fill(1)
          .map((subStatIndex) => {
            const val = choose(Substats[statType]);
            return val;
          })
          .reduce((partialSum, a) => partialSum + a, 0),
      };
    }),
  ];
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
