import { Buffs, CharacterStats, defaultBuffs } from "../../common";
import { Weapon } from "../weapon";

export class TheCatch extends Weapon {
  constructor(level: number, isAscended: boolean, refinement: number) {
    super("catch", level, refinement, isAscended);
    this.className = "TheCatch";
  }
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
      critRate_: {
        ...defaultBuffs.critRate_,
        burst: passiveActive
          ? parseFloat(
              this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][1]
            ) / 100
          : 0,
      },
      dmgBonusSkill: {
        ...defaultBuffs.dmgBonusSkill,
        burst: passiveActive
          ? parseFloat(
              this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0]
            ) / 100
          : 0,
      },
    };
  };
}
