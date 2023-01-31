import { Buffs, CharacterStats, defaultBuffs } from "../../common";
import { Weapon } from "../weapon";

export class Moonpiercer extends Weapon {
  constructor(level: number, isAscended: boolean, refinement: number) {
    super("moonpiercer", level, refinement, isAscended);
    this.className = "Moonpiercer";
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
      atk_: passiveActive
        ? parseFloat(this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0]) /
          100
        : 0,
    };
  };
}
