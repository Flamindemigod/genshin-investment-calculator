import bigCartesian from "big-cartesian";
import { Character } from "../character/character";
import { defaultBuffs } from "../common";
import { IArtifact } from "../generator/artifact";
import { reviver } from "./reviver";

addEventListener("message", (e) => {
  const [character, flowers, plumes, sands, goblets, circlets]: [
    string,
    IArtifact[],
    IArtifact[],
    IArtifact[],
    IArtifact[],
    IArtifact[]
  ] = e.data;
  const char: Character = reviver(character);
  let i = 0;
  for (let build of bigCartesian([flowers, plumes, sands, goblets, circlets])) {
    char.equipArtifacts(build);
    const charBuffs = char.getBuffs(
      { weapon: 0, artifact: 0 },
      {
        artifactPassive: true,
        weaponPassive: true,
      }
    );
    const [dmg, props] = char.getDamage([
      {
        MV: { ATK: 721.4, DEF: 0, EM: 0, HP: 0 },
        buffs: {
          ...charBuffs,
          atk_: 0.2,
          atk: 1997,
          resistance: { ...charBuffs.resistance, electro: -40 },
          critDMG_Elemental: {
            ...charBuffs.critDMG_Elemental,
            electro: charBuffs.critDMG_Elemental.electro + 0.6,
          },
          dmgBonusElemental: {
            ...charBuffs.dmgBonusElemental,
            electro: charBuffs.dmgBonusElemental.electro + 0.416,
          },
        },
        DamageType: "electro",
        reaction: undefined,
        SkillType: "burst",
      },
    ])[0];
    postMessage([i++, dmg, build, char.getCharacterStats(), props]);
  }
});
