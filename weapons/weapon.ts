import { weapons } from "genshin-db";
import { inverseSubStatMapping } from "../character/character";
import { Buffs, CharacterStats, defaultBuffs, WeaponType } from "../common";
import { StatKey } from "../generator/artifact";

export type WeaponRarity = "5" | "4" | "3";

export class Weapon {
  toJSON = () => {
    return JSON.stringify({
      __type__: this.className,
      __args__: [this.level, this.isAscended, this.refinement],
    });
  };
  className: string = "Weapon";
  level: number;
  isAscended: boolean;
  name: string;
  description: string;
  weapontype: WeaponType;
  rarity: WeaponRarity;
  story: string;
  baseatk: number;
  substat: StatKey;
  subvalue: number;
  effectname: string;
  refinement: number;
  effect: string;
  r1: string[];
  r2: string[];
  r3: string[];
  r4: string[];
  r5: string[];
  images: {
    nameicon: string;
    namegacha: string;
    icon: string;
    nameawakenicon: string;
    awakenicon: string;
  };
  stats: {
    level: number;
    ascension: number;
    attack: number;
    specialized: number;
    subStat: StatKey;
  };

  getStats = () => {
    return {
      ...defaultBuffs,
      [this.stats.subStat as string]: this.stats.specialized,
    } as Buffs;
  };
  getPreBuffs!: (stacks: number, passiveActive: boolean) => Buffs;
  getBuffs!: (
    stacks: number,
    characterStats: CharacterStats,
    passiveActive: boolean
  ) => Buffs;
  constructor(
    name: string,
    level: number,
    refinement: number,
    isAccended: boolean = false
  ) {
    const weapon = weapons(name, { verboseCategories: true });
    this.level = level;
    this.isAscended = isAccended;
    this.name = weapon?.name!;
    this.description = weapon?.description!;
    this.weapontype = weapon?.weapontype as WeaponType;
    this.rarity = weapon?.rarity as WeaponRarity;
    this.story = weapon?.story!;
    this.baseatk = weapon?.baseatk!;
    this.substat = weapon?.substat as StatKey;
    this.subvalue = parseFloat(weapon?.subvalue!);
    this.effectname = weapon?.effectname!;
    this.refinement = refinement;
    this.effect = weapon?.effect!;
    this.r1 = weapon?.r1!;
    this.r2 = weapon?.r2!;
    this.r3 = weapon?.r3!;
    this.r4 = weapon?.r4!;
    this.r5 = weapon?.r5!;
    this.images = {
      nameicon: weapon?.images.nameicon!,
      namegacha: weapon?.images.namegacha!,
      icon: weapon?.images.icon!,
      nameawakenicon: weapon?.images.nameawakenicon!,
      awakenicon: weapon?.images.awakenicon!,
    };
    const weaponStats = weapon?.stats(level, isAccended ? "+" : undefined);
    this.stats = {
      level: weaponStats?.level!,
      ascension: weaponStats?.ascension!,
      attack: weaponStats?.attack!,
      specialized: weaponStats?.specialized!,
      subStat: inverseSubStatMapping[weapon?.substat!] as StatKey,
    };
  }
}
