export const artifactStatMapping = {
  hp: 4780, //HP
  hp_: 0.466, //HP%
  atk: 311, //ATK
  atk_: 0.466, //ATK%
  def: 0, //DEF
  def_: 0.583, //DEF%
  eleMas: 186.5, //Elemental Mastery
  enerRech_: 0.518, //Energy Recharge
  heal_: 0.359, //Healing Bonus
  critRate_: 0.311, //Crit Rate
  critDMG_: 0.622, //Crit DMG
  physical_dmg_: 0.583, //Physical DMG Bonus
  anemo_dmg_: 0.466, //Anemo DMG Bonus
  geo_dmg_: 0.466, //Geo DMG Bonus
  electro_dmg_: 0.466, //Electro DMG Bonus
  hydro_dmg_: 0.466, //Hydro DMG Bonus
  pyro_dmg_: 0.466, //Pyro DMG Bonus
  cryo_dmg_: 0.466, //Cryo DMG Bonus
  dendro_dmg_: 0.466, //Dendro DMG Bonus
};

export type _Elements =
  | "hydro"
  | "pyro"
  | "cryo"
  | "electro"
  | "anemo"
  | "geo"
  | "dendro";
export type WeaponType = "Bow" | "Sword" | "Claymore" | "Catalyst" | "Polearm";

export interface Elements {
  pyro: number;
  hydro: number;
  cryo: number;
  electro: number;
  anemo: number;
  geo: number;
  dendro: number;
  physical: number;
}

export interface Skills {
  normal: number;
  charged: number;
  plunging: number;
  skill: number;
  burst: number;
}

export type BuffKeys =
  | "atk"
  | "atk_"
  | "hp"
  | "hp_"
  | "def"
  | "def_"
  | "em"
  | "MVmodifier"
  | "enerRech_"
  | "flatDamage"
  | "critRate_"
  | "critDMG_Elemental"
  | "critDMG_Skill"
  | "dmgBonusElemental"
  | "dmgBonusSkill"
  | "resistance"
  | "amplifyingReactionBonus"
  | "transformativeReactionBonus"
  | "additiveReactionBonus"
  | "defIgnore"
  | "defReduction";

export interface Buffs {
  atk: number;
  atk_: number;
  hp: number;
  hp_: number;
  def: number;
  def_: number;
  eleMas: number;
  MV: {
    [key in keyof Skills]: {
      ATK: number;
      DEF: number;
      EM: number;
      HP: number;
    };
  };
  enerRech_: number;
  flatDamage: number;
  critRate_: Skills;
  critDMG_Elemental: Elements;
  critDMG_Skill: Skills;
  dmgBonusElemental: Elements;
  dmgBonusSkill: Skills;
  resistance: Elements;
  amplifyingReactionBonus: number;
  transformativeReactionBonus: number;
  additiveReactionBonus: number;
  defIgnore: number;
  defReduction: number;
}

export interface CharacterStats {
  level: number;
  ascension: number;
  baseAtk: number;
  atk_: number;
  atk: number;
  baseDef: number;
  def_: number;
  def: number;
  baseHp: number;
  hp_: number;
  hp: number;
  eleMas: number;
  enerRech_: number;
  critRate_: Skills;
  critDMG_Elemental: Elements;
  critDMG_Skill: Skills;
  dmgBonusElemental: Elements;
  dmgBonusSkill: Skills;
  burstCost: number;
}

export const defaultBuffs: Buffs = {
  atk: 0,
  atk_: 0,
  hp: 0,
  hp_: 0,
  def: 0,
  def_: 0,
  eleMas: 0,
  MV: {
    normal: { ATK: 0, DEF: 0, HP: 0, EM: 0 },
    burst: { ATK: 0, DEF: 0, HP: 0, EM: 0 },
    charged: { ATK: 0, DEF: 0, HP: 0, EM: 0 },
    plunging: { ATK: 0, DEF: 0, HP: 0, EM: 0 },
    skill: { ATK: 0, DEF: 0, HP: 0, EM: 0 },
  },
  enerRech_: 0,
  flatDamage: 0,
  critRate_: { normal: 0, burst: 0, charged: 0, plunging: 0, skill: 0 },
  critDMG_Elemental: {
    anemo: 0,
    cryo: 0,
    dendro: 0,
    electro: 0,
    geo: 0,
    hydro: 0,
    physical: 0,
    pyro: 0,
  },
  critDMG_Skill: {
    normal: 0,
    burst: 0,
    charged: 0,
    plunging: 0,
    skill: 0,
  },
  dmgBonusElemental: {
    anemo: 0,
    cryo: 0,
    dendro: 0,
    electro: 0,
    geo: 0,
    hydro: 0,
    physical: 0,
    pyro: 0,
  },
  dmgBonusSkill: {
    normal: 0,
    burst: 0,
    charged: 0,
    plunging: 0,
    skill: 0,
  },
  resistance: {
    anemo: 0,
    cryo: 0,
    dendro: 0,
    electro: 0,
    geo: 0,
    hydro: 0,
    physical: 0,
    pyro: 0,
  },
  amplifyingReactionBonus: 0,
  transformativeReactionBonus: 0,
  additiveReactionBonus: 0,
  defIgnore: 0,
  defReduction: 0,
};

export const defaultCharacterStats: CharacterStats = {
  level: 0,
  ascension: 0,
  baseAtk: 0,
  atk_: 0,
  atk: 0,
  baseDef: 0,
  def_: 0,
  def: 0,
  baseHp: 0,
  hp_: 0,
  hp: 0,
  eleMas: 0,
  enerRech_: 0,
  critRate_: { burst: 0, charged: 0, normal: 0, plunging: 0, skill: 0 },
  critDMG_Elemental: {
    anemo: 0,
    cryo: 0,
    dendro: 0,
    electro: 0,
    geo: 0,
    hydro: 0,
    physical: 0,
    pyro: 0,
  },
  critDMG_Skill: { burst: 0, charged: 0, normal: 0, plunging: 0, skill: 0 },
  dmgBonusElemental: {
    anemo: 0,
    cryo: 0,
    dendro: 0,
    electro: 0,
    geo: 0,
    hydro: 0,
    physical: 0,
    pyro: 0,
  },
  dmgBonusSkill: { burst: 0, charged: 0, normal: 0, plunging: 0, skill: 0 },
  burstCost: 0,
};
