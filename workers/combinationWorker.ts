import bigCartesian from "big-cartesian";
import {
  Character,
  defaultIsActive,
  defaultStacks,
} from "../character/character";
import { Buffs, defaultBuffs } from "../common";
import { IPreset } from "../common/presets";
import { IArtifact } from "../generator/artifact";
import { addObjects } from "../misc/addObjects";
import { reviver } from "./reviver";

addEventListener("message", (e) => {
  const [character, flowers, plumes, sands, goblets, circlets, preset]: [
    string,
    IArtifact[],
    IArtifact[],
    IArtifact[],
    IArtifact[],
    IArtifact[],
    IPreset
  ] = e.data;
  const char: Character = reviver(character);
  let i = 0;
  for (let build of bigCartesian([flowers, plumes, sands, goblets, circlets])) {
    char.equipArtifacts(build);
    const dmg = char
      .getDamage(
        preset.config.map((config) => {
          const charBuffs = char.getBuffs(config.stacks, config.isActive);
          const MV = char.getMotionValue(config.skillType, config.label);
          return {
            MV: { ATK: 0, DEF: 0, HP: 0, EM: 0, ...MV },
            stacks: config.stacks,
            isActive: config.isActive,
            buffs: addObjects<Buffs>(
              defaultBuffs,
              charBuffs,
              preset.globalBuffs,
              config.buffs
            ),
            DamageType: config.dmgType,
            reaction: undefined,
            SkillType: config.skillType,
          };
        })
      )
      .reduce((partialSum, a) => partialSum + a, 0);
    postMessage([
      i++,
      dmg,
      build,
      char.getCharacterStats(defaultStacks, defaultIsActive),
    ]);
    // break;
  }
});
