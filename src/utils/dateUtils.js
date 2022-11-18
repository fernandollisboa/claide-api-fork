export function dateToIso(data) {
  let [day, month, year] = data.split("/");
  return `${month}/${day}/${year}`;
}

export function dateIsoToDate(date) {
  let [month, day, year] = date.split("/");
  return `${day}/${month}/${year}`;
}
