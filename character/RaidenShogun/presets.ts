import { defaultBuffs } from "../../common";
import { IPreset } from "../../common/presets";
import { defaultIsActive, defaultStacks } from "../character";

export const presets: IPreset[] = [
  {
    name: "Raiden Hyper Initial Slash",
    description: "",
    globalBuffs: {
      ...defaultBuffs,
      atk_: 0.2,
      atk: 1997,
      resistance: { ...defaultBuffs.resistance, electro: -40 },
      critDMG_Elemental: {
        ...defaultBuffs.critDMG_Elemental,
        electro: 0.6,
      },
      dmgBonusElemental: {
        ...defaultBuffs.dmgBonusElemental,
        electro: 0.416,
      },
    },
    optimizationContributions: [
      "atk_",
      "electro_dmg_",
      "enerRech_",
      "critRate_",
      "critDMG_",
    ],
    config: [
      {
        buffs: defaultBuffs,
        stacks: defaultStacks,
        isActive: { ...defaultIsActive, artifact: true },
        skillType: "burst",
        label: "musou no hitotachi base dmg0",
        dmgType: "electro",
      },
    ],
  },
];
