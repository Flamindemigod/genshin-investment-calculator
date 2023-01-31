import { Buffs, CharacterStats, defaultBuffs } from "../../common";
import { Character, defaultIsActive, defaultStacks } from "../character";

interface teamBuffConditionals {
  skill: boolean;
  c4: boolean;
}

export class Raiden extends Character {
  teamBuffs!: (
    characterStats: CharacterStats,
    isActive: teamBuffConditionals
  ) => Buffs;
  constructor(
    level: number,
    talents: { normal: number; skill: number; burst: number },
    con: number,
    isAscended: boolean
  ) {
    super("raiden", level, isAscended, talents, con);
    this.className = "Raiden";
    this.talents.a4.getBuffs = () => {
      const charStats = this.getCharacterStats(defaultStacks, defaultIsActive);
      const buffs: Buffs = {
        ...defaultBuffs,
        dmgBonusElemental: {
          ...defaultBuffs.dmgBonusElemental,
          electro: (Math.floor((charStats.enerRech_ - 1) * 100) * 0.4) / 100,
        },
      };
      return buffs;
    };

    this.talents.skill.getBuffs = () => {
      let buffs: Buffs = {
        ...defaultBuffs,
        dmgBonusSkill: {
          ...defaultBuffs.dmgBonusSkill,
          burst:
            this.talents.burst.attributes!["energy cost0"].scalings[
              this.talents.burst.level - 1
            ] *
            this.talents.skill.attributes!["elemental burst dmg bonus0"]
              .scalings[this.talents.skill.level - 1],
        },
      };
      return buffs;
    };

    this.cons.c2.getBuffs = (stack: number, isActive: boolean) => {
      if (this.cons.c2.enabled) {
        let buffs: Buffs = {
          ...defaultBuffs,
          defIgnore: 0.6,
        };
        return buffs;
      } else return defaultBuffs;
    };
  }
}
