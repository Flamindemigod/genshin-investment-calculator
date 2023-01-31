import { defaultBuffs } from "../../common";
import { IPreset } from "../../common/presets";
import { defaultIsActive, defaultStacks } from "../character";

export const presets: IPreset[] = [
  {
    name: "C3 Raiden Hyper Initial Slash",
    description:
      "C3 Raiden, C6R1 Skyward Harp Sara, C0R1 Kazuha 4VV @ 1000EM, C6R1 Mistsplitter Bennett 4NO",
    talents: { normal: 10, skill: 10, burst: 13 },
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
        buffs: {
          ...defaultBuffs,
          MV: {
            ...defaultBuffs.MV,
            burst: { ...defaultBuffs.MV.burst, ATK: 4.956 },
          },
        },
        stacks: defaultStacks,
        isActive: { ...defaultIsActive, artifact: true },
        skillType: "burst",
        label: "musou no hitotachi base dmg0",
        dmgType: "electro",
      },
    ],
  },
];
