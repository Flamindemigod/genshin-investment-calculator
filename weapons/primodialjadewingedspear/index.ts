import { Buffs, CharacterStats, defaultBuffs } from "../../common";
import { Weapon } from "../weapon";

export class PrimodialJadeWingedSpear extends Weapon {
  constructor(level: number, isAscended: boolean, refinement: number) {
    super("primodial jade winged-spear", level, refinement, isAscended);
    this.className = "PrimodialJadeWingedSpear";
  }
  getPreBuffs: (stacks: number, passiveActive: boolean) => Buffs = (
    stacks: number,
    passiveActive: boolean
  ) => {
    const refinement = `r${this.refinement}`;
    return {
      ...defaultBuffs,
    };
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
      atk_:
        (Math.min(Math.max(stacks, 0), 7) *
          parseFloat(this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0])) /
        100,
      dmgBonusSkill: {
        burst:
          stacks === 7
            ? parseFloat(
                this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0]
              ) / 100
            : 0,
        charged:
          stacks === 7
            ? parseFloat(
                this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0]
              ) / 100
            : 0,
        normal:
          stacks === 7
            ? parseFloat(
                this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0]
              ) / 100
            : 0,
        plunging:
          stacks === 7
            ? parseFloat(
                this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0]
              ) / 100
            : 0,
        skill:
          stacks === 7
            ? parseFloat(
                this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0]
              ) / 100
            : 0,
      },
    };
  };
}
