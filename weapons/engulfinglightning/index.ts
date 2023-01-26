import { Buffs, CharacterStats, defaultBuffs } from "../../common";
import { Weapon } from "../weapon";

export class EngulfingLightning extends Weapon {
  constructor(level: number, isAscended: boolean, refinement: number) {
    super("engulfing", level, refinement, isAscended);
    this.className = "EngulfingLightning";
  }
  getPreBuffs: (stacks: number, passiveActive: boolean) => Buffs = (
    stacks: number,
    passiveActive: boolean
  ) => {
    const refinement = `r${this.refinement}`;
    return {
      ...defaultBuffs,
      enerRech_: passiveActive
        ? parseFloat(this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][2]) /
          100
        : 0,
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
      atk_: Math.min(
        (characterStats.enerRech_ *
          parseFloat(this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0])) /
          100,
        parseFloat(this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][1]) /
          100
      ),
    };
  };
}
