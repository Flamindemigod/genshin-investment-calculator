import { Buffs, CharacterStats, defaultBuffs } from "../../common";
import { Weapon } from "../weapon";

export class VortexVanquisher extends Weapon {
  constructor(level: number, isAscended: boolean, refinement: number) {
    super("vortex vanquisher", level, refinement, isAscended);
    this.className = "VortexVanquisher";
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
        ((Math.min(Math.max(stacks, 0), 5) *
          parseFloat(this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][1])) /
          100) *
        (passiveActive ? 2 : 1),
    };
  };
}
