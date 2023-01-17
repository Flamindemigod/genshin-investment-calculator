import { Buffs, CharacterStats, defaultBuffs } from "../common";
import { ArtifactSetKey } from "../data/Data";
import { StatKey } from "../generator/artifact";

type Tset2PC = {
  [key in NonNullable<ArtifactSetKey>]?: {
    [key in NonNullable<StatKey>]?: number;
  };
};

type Tset4PC = {
  [key in NonNullable<ArtifactSetKey>]?: (
    stacks: number,
    characterStats: CharacterStats,
    passiveActive: boolean
  ) => Buffs;
};

export const sets2Pc: Tset2PC = {
  EmblemOfSeveredFate: { enerRech_: 0.2 },
  ShimenawasReminiscence: { atk_: 0.18 },
};

export const sets4Pc: Tset4PC = {
  EmblemOfSeveredFate: EoSF4PC,
  ShimenawasReminiscence: Shim4Pc,
};

export function Shim4Pc(
  stacks: number,
  characterStats: CharacterStats,
  passiveActive: boolean
) {
  const buffs: Buffs = {
    ...defaultBuffs,
    dmgBonusSkill: {
      ...defaultBuffs.dmgBonusSkill,
      normal: passiveActive ? 0.5 : 0,
      plunging: passiveActive ? 0.5 : 0,
      charged: passiveActive ? 0.5 : 0,
    },
  };
  return buffs;
}

export function EoSF4PC(
  stacks: number,
  characterStats: CharacterStats,
  passiveActive: boolean
) {
  const buffs: Buffs = {
    ...defaultBuffs,
    dmgBonusSkill: {
      ...defaultBuffs.dmgBonusSkill,
      burst: Math.min(0.25 * characterStats.enerRech_, 0.75),
    },
  };
  return buffs;
}
