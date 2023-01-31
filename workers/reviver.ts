import { Character } from "../character/character";
import { Raiden } from "../character/RaidenShogun";
import { CalamityQueller } from "../weapons/calamityqueller";
import { EngulfingLightning } from "../weapons/engulfinglightning";
import { PrimodialJadeWingedSpear } from "../weapons/primodialjadewingedspear";
import { SkywardSpine } from "../weapons/skywardspine";
import { StaffOfHoma } from "../weapons/staffofhoma";
import { StaffOfTheScarletSands } from "../weapons/staffofthescarletsands";
import { TheCatch } from "../weapons/thecatch";
import { VortexVanquisher } from "../weapons/vortexvanquisher";
import { Weapon } from "../weapons/weapon";

export const reviverMapping: { [key: string]: any } = {
  Character: Character,
  Weapon: Weapon,
  Raiden: Raiden,
  TheCatch: TheCatch,
  EngulfingLightning: EngulfingLightning,
  StaffOfTheScarletSands: StaffOfTheScarletSands,
  CalamityQueller: CalamityQueller,
  PrimodialJadeWingedSpear: PrimodialJadeWingedSpear,
  VortexVanquisher: VortexVanquisher,
  SkywardSpine: SkywardSpine,
  StaffOfHoma: StaffOfHoma,
};

export const reviver = (json: string) => {
  const jsonObj = JSON.parse(JSON.parse(json));
  const type = jsonObj["__type__"];
  const args = jsonObj["__args__"];
  const obj = new reviverMapping[type](...args);
  if (jsonObj.__weapon__) {
    obj.equipWeapon(reviver(JSON.stringify(jsonObj.__weapon__)));
  }
  return obj;
};
