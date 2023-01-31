import { Buffs, CharacterStats, defaultBuffs } from "../../common";
import { Weapon } from "../weapon";

export class StaffOfHoma extends Weapon {
  constructor(level: number, isAscended: boolean, refinement: number) {
    super("staff of homa", level, refinement, isAscended);
    this.className = "StaffOfHoma";
  }
  getPreBuffs: (stacks: number, passiveActive: boolean) => Buffs = (
    stacks: number,
    passiveActive: boolean
  ) => {
    const refinement = `r${this.refinement}`;
    return {
      ...defaultBuffs,
      hp_:
        parseFloat(this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0]) /
        100,
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
      atk:
        (characterStats.baseHp * (1 + characterStats.hp_) + characterStats.hp) *
        (parseFloat(this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][1]) /
          100 +
          (passiveActive
            ? parseFloat(
                this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][2]
              ) / 100
            : 0)),
    };
  };
}
