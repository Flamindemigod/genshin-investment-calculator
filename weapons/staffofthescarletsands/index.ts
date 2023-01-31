import { Buffs, CharacterStats, defaultBuffs } from "../../common";
import { Weapon } from "../weapon";

export class StaffOfTheScarletSands extends Weapon {
  constructor(level: number, isAscended: boolean, refinement: number) {
    super("staff of the scarlet sands", level, refinement, isAscended);
    this.className = "StaffOfTheScarletSands";
  }
  getPreBuffs: (stacks: number, passiveActive: boolean) => Buffs = (
    stacks: number,
    passiveActive: boolean
  ) => {
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
      atk:
        (parseFloat(this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0]) /
          100) *
          characterStats.eleMas +
          (passiveActive && stacks
            ? (stacks *
                parseFloat(
                  this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][1]
                ) *
                characterStats.eleMas) /
              100
            : 0) ?? 0,
    };
  };
}
