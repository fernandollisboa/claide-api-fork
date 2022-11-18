export function dateToIso(date) {
  let [day, month, year] = date.split("/");
  return `${month}/${day}/${year}`;
}

export function dateIsoToDate(date) {
  let [month, day, year] = date.split("/");
  return `${day}/${month}/${year}`;
}
