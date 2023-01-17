import { Jsonizer, Reviver } from "@badcafe/jsonizer";
import { Buffs, CharacterStats, defaultBuffs } from "../../common";
import { Character } from "../character";

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
    this.teamBuffs = (
      characterStats: CharacterStats,
      isActive: teamBuffConditionals
    ): Buffs => {
      let buffs: Buffs = {
        ...defaultBuffs,
        atk_: this.cons.c4.enabled && isActive.c4 ? 0.3 : 0,
        dmgBonusSkill: {
          ...defaultBuffs.dmgBonusSkill,
          burst: isActive.skill
            ? characterStats.burstCost *
              this.talents.skill.attributes!["elemental burst dmg bonus0"][
                this.talents.skill.level - 1
              ]
            : 0,
        },
      };
      return buffs;
    };

    this.talents.a4.getBuffs = () => {
      const charStats = this.getCharacterStats();
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
            this.talents.burst.attributes!["energy cost0"][
              this.talents.burst.level - 1
            ] *
            this.talents.skill.attributes!["elemental burst dmg bonus0"][
              this.talents.skill.level - 1
            ],
        },
      };
      return buffs;
    };
  }
}
