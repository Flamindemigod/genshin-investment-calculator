import {
  artifactStatMapping,
  Buffs,
  CharacterStats,
  defaultBuffs,
} from "../common";
import { ArtifactSetKey } from "../data/Data";
import { IArtifact, StatKey } from "../generator/artifact";
import { sets2Pc, sets4Pc, Shim4Pc, EoSF4PC } from "./sets";

export class ArtifactSet {
  flower!: IArtifact;
  plume!: IArtifact;
  sands!: IArtifact;
  goblet!: IArtifact;
  circlet!: IArtifact;

  setBonus1: ArtifactSetKey;
  setBonus2: ArtifactSetKey;
  is4PC: boolean;

  __get_artifact_set_stat(stat: StatKey) {
    return [this.flower, this.plume, this.sands, this.goblet, this.circlet]
      .map(
        (artifact) =>
          artifact?.substats.filter((subStat) => subStat.key === stat)[0]
            ?.value ?? 0
      )
      .reduce((partialSum, a) => partialSum + a, 0);
  }

  __get_artifact_set_main_stat(stat: StatKey) {
    return [this.flower, this.plume, this.sands, this.goblet, this.circlet]
      .map((artifact) =>
        artifact?.mainStatKey === stat ? artifactStatMapping[stat!] : 0
      )
      .reduce((partialSum, a) => partialSum + a, 0);
  }

  __get_artifact_set_bonus_2_pc(stat: StatKey) {
    return [...new Set([this.setBonus1, this.setBonus2])]
      .map((set) => sets2Pc[set!]?.[stat!] ?? 0)
      .reduce((partialSum, a) => partialSum + a, 0);
  }
  stats = () => {
    const critRate =
      this.__get_artifact_set_stat("critRate_") +
      this.__get_artifact_set_main_stat("critRate_") +
      this.__get_artifact_set_bonus_2_pc("critRate_");
    const critDmg =
      this.__get_artifact_set_stat("critDMG_") +
      this.__get_artifact_set_main_stat("critDMG_") +
      this.__get_artifact_set_bonus_2_pc("critDMG_");

    const buffs: Buffs = {
      ...defaultBuffs,
      atk:
        this.__get_artifact_set_stat("atk") +
        this.__get_artifact_set_main_stat("atk") +
        this.__get_artifact_set_bonus_2_pc("atk"),
      atk_:
        this.__get_artifact_set_stat("atk_") +
        this.__get_artifact_set_main_stat("atk_") +
        this.__get_artifact_set_bonus_2_pc("atk_"),
      hp:
        this.__get_artifact_set_stat("hp") +
        this.__get_artifact_set_main_stat("hp") +
        this.__get_artifact_set_bonus_2_pc("hp"),
      hp_:
        this.__get_artifact_set_stat("hp_") +
        this.__get_artifact_set_main_stat("hp_") +
        this.__get_artifact_set_bonus_2_pc("hp_"),
      def:
        this.__get_artifact_set_stat("def") +
        this.__get_artifact_set_main_stat("def") +
        this.__get_artifact_set_bonus_2_pc("def"),
      def_:
        this.__get_artifact_set_stat("def_") +
        this.__get_artifact_set_main_stat("def_") +
        this.__get_artifact_set_bonus_2_pc("def_"),
      critRate_: {
        burst: critRate,
        skill: critRate,
        normal: critRate,
        plunging: critRate,
        charged: critRate,
      },
      critDMG_Elemental: {
        physical: critDmg,
        pyro: critDmg,
        hydro: critDmg,
        cryo: critDmg,
        anemo: critDmg,
        dendro: critDmg,
        geo: critDmg,
        electro: critDmg,
      },
      eleMas:
        this.__get_artifact_set_stat("eleMas") +
        this.__get_artifact_set_main_stat("eleMas") +
        this.__get_artifact_set_bonus_2_pc("eleMas"),
      enerRech_:
        this.__get_artifact_set_stat("enerRech_") +
        this.__get_artifact_set_main_stat("enerRech_") +
        this.__get_artifact_set_bonus_2_pc("enerRech_"),
    };
    return buffs;
  };
  buffs: (
    stacks: number,
    characterStats: CharacterStats,
    passiveActive: boolean
  ) => Buffs = (
    stacks: number,
    characterStats: CharacterStats,
    passiveActive: boolean
  ) => {
    if (this.is4PC && this.setBonus1) {
      const bonus4pc = sets4Pc[this.setBonus1];
      return bonus4pc!(stacks, characterStats, passiveActive) ?? defaultBuffs;
    }
    return defaultBuffs;
  };
  teamBuffs!: () => Buffs;

  constructor(artifactarray: IArtifact[]) {
    this.flower = artifactarray.filter(
      (artifact) => artifact.setKey && artifact.slotKey === "flower"
    )[0];
    this.plume = artifactarray.filter(
      (artifact) => artifact.setKey && artifact.slotKey === "plume"
    )[0];
    this.sands = artifactarray.filter(
      (artifact) => artifact.setKey && artifact.slotKey === "sands"
    )[0];
    this.goblet = artifactarray.filter(
      (artifact) => artifact.setKey && artifact.slotKey === "goblet"
    )[0];
    this.circlet = artifactarray.filter(
      (artifact) => artifact.setKey && artifact.slotKey === "circlet"
    )[0];
    let artifactsets = new Set(
      artifactarray.map((artifact) => artifact.setKey)
    );
    let artifactSetCounts: any = {};
    [...artifactsets].forEach((set) => {
      artifactSetCounts[set!] = artifactarray.filter(
        (artifact) => artifact.setKey === set
      );
    });
    Object.keys(artifactSetCounts).forEach((key) => {
      if (artifactSetCounts[key].length >= 4) {
        this.setBonus1 = key as ArtifactSetKey;
        this.setBonus2 = key as ArtifactSetKey;
      }
      if (artifactSetCounts[key].length >= 2) {
        if (!this.setBonus1) {
          this.setBonus1 = key as ArtifactSetKey;
        } else if (!this.setBonus2) {
          this.setBonus2 = key as ArtifactSetKey;
        }
      }
    });
    this.is4PC = this.setBonus1 === this.setBonus2;
  }
}
