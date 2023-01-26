import { Character } from "../character/character";
import { Raiden } from "../character/RaidenShogun";
import { EngulfingLightning } from "../weapons/engulfinglightning";
import { TheCatch } from "../weapons/thecatch";
import { Weapon } from "../weapons/weapon";

export const reviverMapping: { [key: string]: any } = {
  Character: Character,
  Raiden: Raiden,
  Weapon: Weapon,
  TheCatch: TheCatch,
  EngulfingLightning: EngulfingLightning,
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
