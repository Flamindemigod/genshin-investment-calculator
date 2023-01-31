import { Buffs } from ".";
import { DamageTypes } from "../calculator";
import { IsActive, Stacks } from "../character/character";
import { StatKey } from "../generator/artifact";

export interface presetConfig {
  buffs: Buffs;
  stacks: Stacks;
  isActive: IsActive;
  skillType: "normal" | "skill" | "burst";
  label: string;
  dmgType: DamageTypes;
}

export interface IPreset {
  name: string;
  description: string;
  talents: { normal: number; skill: number; burst: number };
  globalBuffs: Buffs;
  optimizationContributions: StatKey[];
  config: presetConfig[];
}
