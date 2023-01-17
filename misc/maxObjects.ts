const toObject = (map = new Map()): Object =>
  Object.fromEntries(
    Array.from(map.entries(), ([k, v]) =>
      v instanceof Map ? [k, toObject(v)] : [k, v]
    )
  );
export function maxObjects(...objs: any[]) {
  const keys = Object.keys(objs[0]);
  let map = new Map();
  keys.forEach((key) => {
    if (key) {
      if (typeof objs[0][key] === "object") {
        const innerObjects = objs.map((obj) => {
          return obj[key as any];
        });
        map.set(key, maxObjects(...innerObjects));
      } else {
        map.set(key, Math.max(...objs));
      }
    }
  });
  return toObject(map);
}
