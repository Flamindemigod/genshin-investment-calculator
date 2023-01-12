import { randomInt } from "crypto";

export function choose(options: any[]) {
  const index = randomInt(options.length);
  return options[index];
}

export const weightedChoose = (options: any[], weights: number[]) => {
  var num = Math.random(),
    s = 0,
    lastIndex = weights.length - 1;

  for (var i = 0; i < lastIndex; ++i) {
    s += weights[i];
    if (num < s) {
      return options[i];
    }
  }

  return options[lastIndex];
};
