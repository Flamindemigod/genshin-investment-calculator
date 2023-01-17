export const toObject = (map = new Map()): Object =>
  Object.fromEntries(
    Array.from(map.entries(), ([k, v]) =>
      v instanceof Map ? [k, toObject(v)] : [k, v]
    )
  );
// export function addObjects(...objs: any[]) {
//   const keys = Object.keys(objs[0]);
//   let map = new Map();
//   keys.forEach((key) => {
//     if (key) {
//       if (typeof objs[0][key] === "number") {
//         map.set(
//           key,
//           objs.reduce((partialSum, a) => partialSum + a[key], 0)
//         );
//       } else {
//         const innerObjects = objs.map((obj) => {
//           return obj[key as any];
//         });
//         map.set(key, addObjects(...innerObjects));
//       }
//     }
//   });
//   return toObject(map);
// }

export function addObjects<T>(...objs: any[]) {
  const keys = Object.keys(objs[0]);
  let newObj: any = {};
  keys.forEach((key) => {
    if (typeof objs[0][key] === "object") {
      const innerObjects = objs.map((obj) => obj[key]);
      newObj[key] = addObjects(...innerObjects);
    } else {
      newObj[key] = objs.reduce((partialSum, a) => partialSum + a[key], 0);
    }
  });
  return newObj as T;
}
