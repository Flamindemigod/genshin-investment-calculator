import { characters, constellations, talents } from "genshin-db";
import { ArtifactSet } from "../artifacts/artifact";
import { calculate, DamageTypes, Props, Reactions } from "../calculator";
import {
  Buffs,
  CharacterStats,
  defaultBuffs,
  defaultCharacterStats,
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

interface Constellation {
  name: string;
  effect: string;
  enabled: boolean;
  getBuffs: () => Buffs;
}

interface Talents {
  name: string;
  info: string;
  level: number;
  infusion?: DamageTypes;
  attributes?: {
    [key: string]: number[];
  };
  getBuffs: () => Buffs;
}

const formatTalents = (
  labels: string[],
  values: { [key: string]: number[] }
) => {
  let map = new Map();
  labels.forEach((label) => {
    const paramsMatch = label.matchAll(/param\d*/g);
    const splitlabel = label.toLowerCase().split("|")[0];
    let index = 0;
    for (let param of paramsMatch) {
      map.set(`${splitlabel}${index}`, values[param.toString()]);
      index = index + 1;
    }
  });
  return toObject(map) as {
    [key: string]: number[];
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
  talentLabelMap!: { [key: string]: string };
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

  getSpecializedStat(stat: StatKey) {
    return this.stats.subStat === stat ? this.stats.specialized : 0;
  }

  getCharacterStats() {
    const artifactStats = this.artifact.stats();
    const weaponStats = this.weapon.getStats();

    const stats: CharacterStats = {
      level: this.stats.level,
      ascension: this.stats.ascension,
      baseAtk: this.stats.attack + this.weapon.stats.attack,
      atk_:
        artifactStats.atk_ + weaponStats.atk_ + this.getSpecializedStat("atk_"),
      atk: artifactStats.atk + weaponStats.atk,
      baseDef: this.stats.defense,
      def_:
        artifactStats.def_ + weaponStats.def_ + this.getSpecializedStat("def_"),
      def: artifactStats.def + weaponStats.def,
      baseHp: this.stats.hp,
      hp_: artifactStats.hp_ + weaponStats.hp_ + this.getSpecializedStat("hp_"),
      hp: artifactStats.hp + weaponStats.hp,
      eleMas:
        artifactStats.eleMas +
        weaponStats.eleMas +
        this.getSpecializedStat("eleMas"),
      enerRech_:
        1 +
        artifactStats.enerRech_ +
        weaponStats.enerRech_ +
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
          artifactStats.dmgBonusSkill,
          weaponStats.dmgBonusSkill,
        ]
      ) as Skills,
      burstCost:
        this.talents.burst.attributes!["energy cost0"][
          this.talents.burst.level - 1
        ],
    };
    return stats;
  }
  getBuffs(
    stacks: { weapon: number; artifact: number },
    isActive: { weaponPassive: boolean; artifactPassive: boolean }
  ) {
    const charStats = this.getCharacterStats();
    const buffsArray: Buffs[] = [
      ...Object.keys(this.talents).map((skill) => {
        if (
          !!this.talents[
            skill as "normal" | "skill" | "burst" | "sp" | "a1" | "a4"
          ]
        ) {
          return this.talents[
            skill as "normal" | "skill" | "burst" | "sp" | "a1" | "a4"
          ]!.getBuffs();
        } else {
          return defaultBuffs;
        }
      }),
      ...Object.keys(this.cons).map((con) =>
        this.cons[con as "c1" | "c2" | "c3" | "c4" | "c5" | "c6"]?.getBuffs!()
      ),
      this.artifact.buffs(stacks.artifact, charStats, isActive.artifactPassive),
      this.weapon.getBuffs(stacks.weapon, charStats, isActive.weaponPassive),
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
        getBuffs: () => {
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
        getBuffs: () => {
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
        getBuffs: () => {
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
        getBuffs: () => {
          return defaultBuffs;
        },
      },
      a1: {
        name: talentsList?.passive1.name!,
        info: talentsList?.passive1.info!,
        level: 1,
        getBuffs: () => {
          return defaultBuffs;
        },
      },

      a4: {
        name: talentsList?.passive2.name!,
        info: talentsList?.passive2.info!,
        level: 1,
        getBuffs: () => {
          return defaultBuffs;
        },
      },
    };
    this.cons = {
      c1: {
        name: constellationList?.c1.name!,
        effect: constellationList?.c1.effect!,
        enabled: con > 0,
        getBuffs: () => {
          return defaultBuffs;
        },
      },
      c2: {
        name: constellationList?.c2.name!,
        effect: constellationList?.c2.effect!,
        enabled: con > 1,
        getBuffs: () => {
          return defaultBuffs;
        },
      },
      c3: {
        name: constellationList?.c3.name!,
        effect: constellationList?.c3.effect!,
        enabled: con > 2,
        getBuffs: () => {
          return defaultBuffs;
        },
      },
      c4: {
        name: constellationList?.c4.name!,
        effect: constellationList?.c4.effect!,
        enabled: con > 3,
        getBuffs: () => {
          return defaultBuffs;
        },
      },
      c5: {
        name: constellationList?.c5.name!,
        effect: constellationList?.c5.effect!,
        enabled: con > 4,
        getBuffs: () => {
          return defaultBuffs;
        },
      },
      c6: {
        name: constellationList?.c6.name!,
        effect: constellationList?.c6.effect!,
        enabled: con > 5,
        getBuffs: () => {
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

  getMotionValueAndBuffs(
    skillType: "normal" | "skill" | "burst" | "a1" | "a4",
    label: string
  ) {
    const talent = this.talents[skillType];
    const buffs = talent.getBuffs!();
    return {
      MV: talent.attributes![this.talentLabelMap![label]],
      buffs: buffs,
    };
  }

  getDamage(
    MVArray: {
      MV: { ATK: number; DEF: number; HP: number; EM: number };
      buffs: Buffs;
      reaction: Reactions | undefined;
      DamageType: DamageTypes;
      SkillType: "normal" | "skill" | "burst" | "charged" | "plunging";
    }[]
  ) {
    let damage: any = [];

    const charStats = this.getCharacterStats();
    MVArray.forEach((Ele) => {
      const props: Props = {
        EnemyLevel: 90,
        CharacterLevel: this.level,
        DamageType: Ele.DamageType,
        MotionValue: Ele.MV,
        CritRate:
          charStats.critRate_[Ele.SkillType] +
          Ele.buffs.critRate_[Ele.SkillType],
        // CritRate: 1,
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
      damage.push([calculate(props), props]);
    });
    return damage;
  }
}
