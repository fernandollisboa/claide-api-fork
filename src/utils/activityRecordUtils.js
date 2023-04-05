export function getDifference(objOld, objNew) {
  const newValueChanged = {};
  const oldValueChanged = {};

  for (const key in objOld) {
    if (Object.prototype.hasOwnProperty.call(objNew, key)) {
      if (typeof objOld[key] === "object") {
        if (JSON.stringify(objOld[key]) !== JSON.stringify(objNew[key])) {
          newValueChanged[key] = objNew[key];
          oldValueChanged[key] = objOld[key];
        }
      } else if (objOld[key] !== objNew[key]) {
        newValueChanged[key] = objNew[key];
        oldValueChanged[key] = objOld[key];
      }
    }
  }

  return { newValueChanged, oldValueChanged };
}
