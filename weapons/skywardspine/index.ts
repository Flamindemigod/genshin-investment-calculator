import { Buffs, CharacterStats, defaultBuffs } from "../../common";
import { Weapon } from "../weapon";

export class SkywardSpine extends Weapon {
  constructor(level: number, isAscended: boolean, refinement: number) {
    super("skyward spine", level, refinement, isAscended);
    this.className = "SkywardSpine";
  }
  getPreBuffs: (stacks: number, passiveActive: boolean) => Buffs = (
    stacks: number,
    passiveActive: boolean
  ) => {
    const refinement = `r${this.refinement}`;
    return {
      ...defaultBuffs,
      critRate_: {
        burst:
          parseFloat(this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0]) /
          100,
        charged:
          parseFloat(this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0]) /
          100,
        normal:
          parseFloat(this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0]) /
          100,
        plunging:
          parseFloat(this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0]) /
          100,
        skill:
          parseFloat(this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0]) /
          100,
      },
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

    return defaultBuffs;
  };
}
