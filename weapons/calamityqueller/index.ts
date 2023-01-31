import { Buffs, CharacterStats, defaultBuffs } from "../../common";
import { Weapon } from "../weapon";

export class CalamityQueller extends Weapon {
  constructor(level: number, isAscended: boolean, refinement: number) {
    super("calamity queller", level, refinement, isAscended);
    this.className = "CalamityQueller";
  }
  getPreBuffs: (stacks: number, passiveActive: boolean) => Buffs = (
    stacks: number,
    passiveActive: boolean
  ) => {
    const refinement = `r${this.refinement}`;
    return {
      ...defaultBuffs,
      dmgBonusElemental: {
        anemo:
          parseFloat(this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0]) /
          100,
        cryo:
          parseFloat(this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0]) /
          100,
        dendro:
          parseFloat(this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0]) /
          100,
        electro:
          parseFloat(this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0]) /
          100,
        geo:
          parseFloat(this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0]) /
          100,
        hydro:
          parseFloat(this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0]) /
          100,
        physical:
          parseFloat(this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][0]) /
          100,
        pyro:
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

    return {
      ...defaultBuffs,
      atk_:
        ((Math.min(Math.max(stacks, 0), 6) *
          parseFloat(this[refinement as "r1" | "r2" | "r3" | "r4" | "r5"][1])) /
          100) *
        (passiveActive ? 2 : 1),
    };
  };
}
