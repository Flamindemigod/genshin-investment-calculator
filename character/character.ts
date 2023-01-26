import { characters, constellations, talents } from "genshin-db";
import { ArtifactSet } from "../artifacts/artifact";
import { calculate, DamageTypes, Props, Reactions } from "../calculator";
import {
  Buffs,
  CharacterStats,
  defaultBuffs,
  Elements,
  Skills,
  WeaponType,
  _Elements,
} from "../common";
import { IArtifact, StatKey } from "../generator/artifact";
import { addObjects, toObject } from "../misc/addObjects";
import { Weapon } from "../weapons/weapon";

export const inverseSubStatMapping: { [key: string]: StatKey } = {
  "Energy Recharge": "enerRech_",
  ATK: "atk_",
  "Geo DMG Bonus": "geo_dmg_",
  "Cryo DMG Bonus": "cryo_dmg_",
  "CRIT Rate": "critRate_",
  HP: "hp_",
  "Electro DMG Bonus": "electro_dmg_",
  "CRIT DMG": "critDMG_",
  "Healing Bonus": "heal_",
  "Elemental Mastery": "eleMas",
  "Pyro DMG Bonus": "pyro_dmg_",
  DEF: "def_",
  "Physical DMG Bonus": "physical_dmg_",
  "Hydro DMG Bonus": "hydro_dmg_",
  "Anemo DMG Bonus": "anemo_dmg_",
  "Dendro DMG Bonus": "dendro_dmg_",
};

export interface Stacks {
  c1: number;
  c2: number;
  c3: number;
  c4: number;
  c5: number;
  c6: number;
  normal: number;
  skill: number;
  burst: number;
  sp: number;
  a1: number;
  a4: number;
  weapon: number;
  artifact: number;
}

export const defaultStacks: Stacks = {
  c1: 0,
  c2: 0,
  c3: 0,
  c4: 0,
  c5: 0,
  c6: 0,
  normal: 0,
  skill: 0,
  burst: 0,
  sp: 0,
  a1: 0,
  a4: 0,
  weapon: 0,
  artifact: 0,
};
export interface IsActive {
  c1: boolean;
  c2: boolean;
  c3: boolean;
  c4: boolean;
  c5: boolean;
  c6: boolean;
  normal: boolean;
  skill: boolean;
  burst: boolean;
  sp: boolean;
  a1: boolean;
  a4: boolean;
  weapon: boolean;
  artifact: boolean;
}

export const defaultIsActive: IsActive = {
  c1: false,
  c2: false,
  c3: false,
  c4: false,
  c5: false,
  c6: false,
  normal: false,
  skill: false,
  burst: false,
  sp: false,
  a1: false,
  a4: false,
  weapon: false,
  artifact: false,
};

interface Constellation {
  name: string;
  effect: string;
  enabled: boolean;
  getPreBuffs: (stack: number, isActive: boolean) => Buffs;
  getBuffs: (stack: number, isActive: boolean) => Buffs;
}

interface Talents {
  name: string;
  info: string;
  level: number;
  infusion?: DamageTypes;
  attributes?: {
    [key: string]: { scalings: number[]; stat: "ATK" | "DEF" | "HP" | "EM" };
  };
  getPreBuffs: (stack: number, isActive: boolean) => Buffs;
  getBuffs: (stack: number, isActive: boolean) => Buffs;
}

const formatTalents = (
  labels: string[],
  values: { [key: string]: number[] }
) => {
  let map = new Map();
  labels.forEach((label) => {
    const paramsMatch = label.matchAll(/param\d*/g);
    const paramScaling = [
      ...label.matchAll(/{param\d*:.{1,3}}\s(ATK|DEF|HP|Elemental Mastery)/g),
    ];

    const splitlabel = label.toLowerCase().split("|")[0];
    let index = 0;
    for (let param of paramsMatch) {
      const statScaling =
        (paramScaling[index] && paramScaling[index][1]) ?? "ATK";
      map.set(`${splitlabel}${index++}`, {
        scalings: values[param.toString()],
        stat: statScaling !== "Elemental Mastery" ? statScaling : "EM",
      });
    }
  });
  return toObject(map) as {
    [key: string]: { scalings: number[]; stat: "ATK" | "DEF" | "HP" | "EM" };
  };
};

const addDamageBonuses = (elements: Elements, value: number) => {
  Object.keys(elements).forEach((key: any) => {
    elements[key as _Elements] = elements[key as _Elements] + value;
  });
  return elements;
};

export class Character {
  toJSON = () => {
    return JSON.stringify({
      __type__: this.className,
      __args__: [
        this.level,
        {
          normal: this.talents.normal.level,
          skill: this.talents.skill.level,
          burst: this.talents.burst.level,
        },
        Object.keys(this.cons).filter(
          (con) =>
            this.cons[con as "c1" | "c2" | "c3" | "c4" | "c5" | "c6"].enabled
        ).length,
        this.isAscended,
      ],
      __weapon__: this.weapon.toJSON(),
    });
  };
  className: string = "Character";
  name: string;
  element: _Elements;
  weapontype: WeaponType;
  substat: StatKey;
  level: number;
  isAscended: boolean;
  cons: {
    c1: Constellation;
    c2: Constellation;
    c3: Constellation;
    c4: Constellation;
    c5: Constellation;
    c6: Constellation;
  };
  talents: {
    normal: Talents;
    skill: Talents;
    burst: Talents;
    sp?: Talents;
    a1: Talents;
    a4: Talents;
  };
  weapon!: Weapon;
  artifact!: ArtifactSet;
  stats: {
    level: number;
    ascension: number;
    hp: number;
    attack: number;
    defense: number;
    specialized: number;
    subStat: StatKey;
  };

  getPrebuffs(stacks: Stacks, isActive: IsActive) {
    const buffsArray: Buffs[] = [
      ...Object.keys(this.talents).map((skill) => {
        if (
          !!this.talents[
            skill as "normal" | "skill" | "burst" | "sp" | "a1" | "a4"
          ]
        ) {
          return this.talents[
            skill as "normal" | "skill" | "burst" | "sp" | "a1" | "a4"
          ]!.getPreBuffs(
            stacks[skill as "normal" | "skill" | "burst" | "sp" | "a1" | "a4"],
            isActive[skill as "normal" | "skill" | "burst" | "sp" | "a1" | "a4"]
          );
        } else {
          return defaultBuffs;
        }
      }),
      ...Object.keys(this.cons).map((con) =>
        this.cons[con as "c1" | "c2" | "c3" | "c4" | "c5" | "c6"]?.getPreBuffs!(
          stacks[con as "c1" | "c2" | "c3" | "c4" | "c5" | "c6"],
          isActive[con as "c1" | "c2" | "c3" | "c4" | "c5" | "c6"]
        )
      ),
      // this.artifact.buffs(),
      this.weapon.getPreBuffs(stacks.weapon, isActive.weapon),
    ];
    return addObjects<Buffs>(...buffsArray);
  }

  getSpecializedStat(stat: StatKey) {
    return this.stats.subStat === stat ? this.stats.specialized : 0;
  }

  getCharacterStats(stacks: Stacks, isActive: IsActive) {
    const artifactStats = this.artifact.stats();
    const weaponStats = this.weapon.getStats();
    const prebuffsStats = this.getPrebuffs(stacks, isActive);
    const stats: CharacterStats = {
      level: this.stats.level,
      ascension: this.stats.ascension,
      baseAtk: this.stats.attack + this.weapon.stats.attack,
      atk_:
        artifactStats.atk_ +
        weaponStats.atk_ +
        prebuffsStats.atk_ +
        this.getSpecializedStat("atk_"),
      atk: artifactStats.atk + weaponStats.atk + prebuffsStats.atk,
      baseDef: this.stats.defense,
      def_:
        artifactStats.def_ +
        weaponStats.def_ +
        prebuffsStats.def_ +
        this.getSpecializedStat("def_"),
      def: artifactStats.def + weaponStats.def + prebuffsStats.def,
      baseHp: this.stats.hp,
      hp_:
        artifactStats.hp_ +
        weaponStats.hp_ +
        prebuffsStats.hp_ +
        this.getSpecializedStat("hp_"),
      hp: artifactStats.hp + weaponStats.hp + prebuffsStats.hp,
      eleMas:
        artifactStats.eleMas +
        prebuffsStats.eleMas +
        weaponStats.eleMas +
        this.getSpecializedStat("eleMas"),
      enerRech_:
        1 +
        artifactStats.enerRech_ +
        weaponStats.enerRech_ +
        prebuffsStats.enerRech_ +
        this.getSpecializedStat("enerRech_"),
      critRate_: addObjects(
        ...[
          {
            burst: 0.05 + this.getSpecializedStat("critRate_"),
            charged: 0.05 + this.getSpecializedStat("critRate_"),
            normal: 0.05 + this.getSpecializedStat("critRate_"),
            plunging: 0.05 + this.getSpecializedStat("critRate_"),
            skill: 0.05 + this.getSpecializedStat("critRate_"),
          },
          prebuffsStats.critRate_,
          artifactStats.critRate_,
          weaponStats.critRate_,
        ]
      ) as Skills,
      critDMG_Elemental: addObjects(
        ...[
          {
            anemo: 0.5 + this.getSpecializedStat("critDMG_"),
            cryo: 0.5 + this.getSpecializedStat("critDMG_"),
            dendro: 0.5 + this.getSpecializedStat("critDMG_"),
            electro: 0.5 + this.getSpecializedStat("critDMG_"),
            geo: 0.5 + this.getSpecializedStat("critDMG_"),
            hydro: 0.5 + this.getSpecializedStat("critDMG_"),
            physical: 0.5 + this.getSpecializedStat("critDMG_"),
            pyro: 0.5 + this.getSpecializedStat("critDMG_"),
          },
          prebuffsStats.critDMG_Elemental,
          artifactStats.critDMG_Elemental,
          weaponStats.critDMG_Elemental,
        ]
      ) as Elements,
      critDMG_Skill: addObjects(
        ...[
          {
            burst: 0,
            charged: 0,
            normal: 0,
            plunging: 0,
            skill: 0,
          },
          prebuffsStats.critDMG_Skill,
          artifactStats.critDMG_Skill,
          weaponStats.critDMG_Skill,
        ]
      ) as Skills,
      dmgBonusElemental: addObjects(
        ...[
          {
            anemo: 0 + this.getSpecializedStat("anemo_dmg_"),
            cryo: 0 + this.getSpecializedStat("cryo_dmg_"),
            dendro: 0 + this.getSpecializedStat("dendro_dmg_"),
            electro: 0 + this.getSpecializedStat("electro_dmg_"),
            geo: 0 + this.getSpecializedStat("geo_dmg_"),
            hydro: 0,
            physical: 0 + this.getSpecializedStat("physical_dmg_"),
            pyro: 0 + this.getSpecializedStat("pyro_dmg_"),
          },
          prebuffsStats.dmgBonusElemental,
          artifactStats.dmgBonusElemental,
          weaponStats.dmgBonusElemental,
        ]
      ) as Elements,
      dmgBonusSkill: addObjects(
        ...[
          {
            burst: 0,
            charged: 0,
            normal: 0,
            plunging: 0,
            skill: 0,
          },
          prebuffsStats.dmgBonusSkill,
          artifactStats.dmgBonusSkill,
          weaponStats.dmgBonusSkill,
        ]
      ) as Skills,
      burstCost:
        this.talents.burst.attributes!["energy cost0"].scalings[
          this.talents.burst.level - 1
        ],
    };
    return stats;
  }
  getBuffs(stacks: Stacks, isActive: IsActive) {
    const charStats = this.getCharacterStats(stacks, isActive);
    const buffsArray: Buffs[] = [
      ...Object.keys(this.talents).map((skill) => {
        if (
          !!this.talents[
            skill as "normal" | "skill" | "burst" | "sp" | "a1" | "a4"
          ]
        ) {
          return this.talents[
            skill as "normal" | "skill" | "burst" | "sp" | "a1" | "a4"
          ]!.getBuffs(
            stacks[skill as "normal" | "skill" | "burst" | "sp" | "a1" | "a4"],
            isActive[skill as "normal" | "skill" | "burst" | "sp" | "a1" | "a4"]
          );
        } else {
          return defaultBuffs;
        }
      }),
      ...Object.keys(this.cons).map((con) =>
        this.cons[con as "c1" | "c2" | "c3" | "c4" | "c5" | "c6"]?.getBuffs!(
          stacks[con as "c1" | "c2" | "c3" | "c4" | "c5" | "c6"],
          isActive[con as "c1" | "c2" | "c3" | "c4" | "c5" | "c6"]
        )
      ),
      this.artifact.buffs(stacks.artifact, charStats, isActive.artifact),
      this.weapon.getBuffs(stacks.weapon, charStats, isActive.weapon),
    ];
    return addObjects<Buffs>(...buffsArray);
  }

  constructor(
    name: string,
    level: number,
    isAscended: boolean,
    talentsLevels: { normal: number; skill: number; burst: number },
    con: number
  ) {
    const char = characters(name);
    const constellationList = constellations(name);
    const talentsList = talents(name);
    const stats = char?.stats(level, isAscended ? "+" : undefined);

    this.stats = {
      level: stats?.level!,
      ascension: stats?.ascension!,
      hp: stats?.hp!,
      attack: stats?.attack!,
      defense: stats?.defense!,
      specialized: stats?.specialized!,
      subStat: inverseSubStatMapping[char?.substat!] as StatKey,
    };

    this.level = level;
    this.isAscended = isAscended;
    this.name = char?.name!;
    this.element = char?.element as _Elements;
    this.substat = inverseSubStatMapping[char?.substat!] as StatKey;
    this.weapontype = char?.weapontype as WeaponType;
    this.talents = {
      normal: {
        name: talentsList?.combat1.name!,
        info: talentsList?.combat1.info!,
        level: talentsLevels.normal,
        infusion: "physical",
        attributes: formatTalents(
          talentsList?.combat1.attributes.labels!,
          talentsList?.combat1.attributes.parameters!
        ),
        getPreBuffs(stack: number, isActive: boolean) {
          return defaultBuffs;
        },
        getBuffs: (stack: number, isActive: boolean) => {
          return defaultBuffs;
        },
      },
      skill: {
        name: talentsList?.combat2.name!,
        info: talentsList?.combat2.info!,
        level: talentsLevels.skill,
        infusion: char?.element.toLowerCase() as DamageTypes,
        attributes: formatTalents(
          talentsList?.combat2.attributes.labels!,
          talentsList?.combat2.attributes.parameters!
        ),
        getPreBuffs(stack: number, isActive: boolean) {
          return defaultBuffs;
        },
        getBuffs: (stack: number, isActive: boolean) => {
          return defaultBuffs;
        },
      },
      burst: {
        name: talentsList?.combat3.name!,
        info: talentsList?.combat3.info!,
        infusion: char?.element.toLowerCase() as DamageTypes,

        level: talentsLevels.burst,
        attributes: formatTalents(
          talentsList?.combat3.attributes.labels!,
          talentsList?.combat3.attributes.parameters!
        ),
        getPreBuffs(stack: number, isActive: boolean) {
          return defaultBuffs;
        },
        getBuffs: (stack: number, isActive: boolean) => {
          return defaultBuffs;
        },
      },
      sp: talentsList?.combatsp && {
        name: talentsList?.combatsp.name!,
        info: talentsList?.combatsp.info!,
        infusion: char?.element.toLowerCase() as DamageTypes,

        level: 1,
        attributes: formatTalents(
          talentsList?.combatsp.attributes.labels!,
          talentsList?.combatsp.attributes.parameters!
        ),
        getPreBuffs(stack: number, isActive: boolean) {
          return defaultBuffs;
        },
        getBuffs: (stack: number, isActive: boolean) => {
          return defaultBuffs;
        },
      },
      a1: {
        name: talentsList?.passive1.name!,
        info: talentsList?.passive1.info!,
        level: 1,
        getPreBuffs(stack: number, isActive: boolean) {
          return defaultBuffs;
        },
        getBuffs: (stack: number, isActive: boolean) => {
          return defaultBuffs;
        },
      },

      a4: {
        name: talentsList?.passive2.name!,
        info: talentsList?.passive2.info!,
        level: 1,
        getPreBuffs(stack: number, isActive: boolean) {
          return defaultBuffs;
        },
        getBuffs: (stack: number, isActive: boolean) => {
          return defaultBuffs;
        },
      },
    };
    this.cons = {
      c1: {
        name: constellationList?.c1.name!,
        effect: constellationList?.c1.effect!,
        enabled: con > 0,
        getPreBuffs(stack: number, isActive: boolean) {
          return defaultBuffs;
        },
        getBuffs: (stack: number, isActive: boolean) => {
          return defaultBuffs;
        },
      },
      c2: {
        name: constellationList?.c2.name!,
        effect: constellationList?.c2.effect!,
        enabled: con > 1,
        getPreBuffs(stack: number, isActive: boolean) {
          return defaultBuffs;
        },
        getBuffs: (stack: number, isActive: boolean) => {
          return defaultBuffs;
        },
      },
      c3: {
        name: constellationList?.c3.name!,
        effect: constellationList?.c3.effect!,
        enabled: con > 2,
        getPreBuffs(stack: number, isActive: boolean) {
          return defaultBuffs;
        },
        getBuffs: (stack: number, isActive: boolean) => {
          return defaultBuffs;
        },
      },
      c4: {
        name: constellationList?.c4.name!,
        effect: constellationList?.c4.effect!,
        enabled: con > 3,
        getPreBuffs(stack: number, isActive: boolean) {
          return defaultBuffs;
        },
        getBuffs: (stack: number, isActive: boolean) => {
          return defaultBuffs;
        },
      },
      c5: {
        name: constellationList?.c5.name!,
        effect: constellationList?.c5.effect!,
        enabled: con > 4,
        getPreBuffs(stack: number, isActive: boolean) {
          return defaultBuffs;
        },
        getBuffs: (stack: number, isActive: boolean) => {
          return defaultBuffs;
        },
      },
      c6: {
        name: constellationList?.c6.name!,
        effect: constellationList?.c6.effect!,
        enabled: con > 5,
        getPreBuffs(stack: number, isActive: boolean) {
          return defaultBuffs;
        },
        getBuffs: (stack: number, isActive: boolean) => {
          return defaultBuffs;
        },
      },
    };
  }

  equipWeapon(weapon: Weapon) {
    this.weapon = weapon;
  }
  _equipWeapon(
    name: string,
    level: number,
    refinement: number,
    isAscended?: boolean
  ) {
    this.weapon = new Weapon(name, level, refinement, isAscended);
  }

  equipArtifacts(artifactArray: IArtifact[]) {
    this.artifact = new ArtifactSet(artifactArray);
  }

  getMotionValue(
    skillType: "normal" | "skill" | "burst" | "a1" | "a4",
    label: string
  ) {
    const talent = this.talents[skillType];
    return {
      [talent.attributes![label].stat]:
        talent.attributes![label].scalings[talent.level - 1],
    };
  }

  getDamage(
    MVArray: {
      stacks: Stacks;
      isActive: IsActive;
      MV: { ATK: number; DEF: number; HP: number; EM: number };
      buffs: Buffs;
      reaction: Reactions | undefined;
      DamageType: DamageTypes;
      SkillType: "normal" | "skill" | "burst" | "charged" | "plunging";
    }[]
  ) {
    let damage: number[] = [];
    MVArray.forEach((Ele) => {
      const charStats = this.getCharacterStats(Ele.stacks, Ele.isActive);
      const props: Props = {
        EnemyLevel: 90,
        CharacterLevel: this.level,
        DamageType: Ele.DamageType,
        MotionValue: Ele.MV,
        CritRate:
          charStats.critRate_[Ele.SkillType] +
          Ele.buffs.critRate_[Ele.SkillType],
        CritDamage: Math.max(
          charStats.critDMG_Elemental[Ele.DamageType] +
            Ele.buffs.critDMG_Elemental[Ele.DamageType] +
            charStats.critDMG_Skill[Ele.SkillType] +
            Ele.buffs.critDMG_Skill[Ele.SkillType]
        ),
        DamageBonus: addDamageBonuses(
          addObjects(
            charStats.dmgBonusElemental,
            Ele.buffs.dmgBonusElemental
          ) as Elements,
          charStats.dmgBonusSkill[Ele.SkillType] +
            Ele.buffs.dmgBonusSkill[Ele.SkillType]
        ) as { [key in DamageTypes]: number },
        DefReduction: Ele.buffs.defReduction,
        DefIgnore: Ele.buffs.defIgnore,
        Resistance: addObjects(
          {
            anemo: 10,
            geo: 10,
            cryo: 10,
            dendro: 10,
            electro: 10,
            hydro: 10,
            physical: 10,
            pyro: 10,
          } as Elements,
          Ele.buffs.resistance
        ) as { [key in DamageTypes]: number },
        FlatDamage: Ele.buffs.flatDamage,
        StatValue: {
          ATK:
            charStats.baseAtk * (1 + charStats.atk_ + Ele.buffs.atk_) +
            charStats.atk +
            Ele.buffs.atk,
          DEF:
            charStats.baseDef * (1 + charStats.def_ + Ele.buffs.def_) +
            charStats.def +
            Ele.buffs.def,
          HP:
            charStats.baseHp * (1 + charStats.hp_ + Ele.buffs.hp_) +
            charStats.hp +
            Ele.buffs.hp,
          EM: charStats.eleMas + Ele.buffs.eleMas,
        },
      };
      damage.push(calculate(props));
    });
    return damage;
  }
}
