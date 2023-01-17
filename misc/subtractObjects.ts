export const toObject = (map = new Map()): Object =>
  Object.fromEntries(
    Array.from(map.entries(), ([k, v]) =>
      v instanceof Map ? [k, toObject(v)] : [k, v]
    )
  );
export function subtractObjects(...objs: any[]) {
  const keys = Object.keys(objs[0]);
  let map = new Map();
  keys.forEach((key) => {
    if (key) {
      if (typeof objs[0][key] === "number") {
        map.set(
          key,
          objs.reduce((partialSum, a) => partialSum - a[key], 0)
        );
      } else {
        const innerObjects = objs.map((obj) => {
          return obj[key as any];
        });
        map.set(key, subtractObjects(...innerObjects));
      }
    }
  });
  return toObject(map);
}
