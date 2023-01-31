import { Buffs, CharacterStats, defaultBuffs } from "../../common";
import { Weapon } from "../weapon";

export class WavebreakersFin extends Weapon {
  constructor(level: number, isAscended: boolean, refinement: number) {
    super("wavebreaker's fin", level, refinement, isAscended);
    this.className = "WavebreakersFin";
  }
  getPreBuffs: (stacks: number, passiveActive: boolean) => Buffs = (
    stacks: number,
    passiveActive: boolean
  ) => {
    const refinement = `r${this.refinement}`;
    return defaultBuffs;
  };
  getBuffs: (
    stacks: number,
    characterStats: CharacterStats,
    passiveActive: boolean
  ) => Buffs = (
    stacks: number,
    characterStats: CharacterStats,
    passiveActive: boolean
  ) => {
    const refinement = `r${this.refinement}`;

    return {
      ...defaultBuffs,
      dmgBonusSkill: {
        ...defaultBuffs.dmgBonusSkill,
        burst: Math.min(
          (stacks *
            parseFloat(
              this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0]
            )) /
            100,
          parseFloat(this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][1])
        ),
      },
    };
  };
}
