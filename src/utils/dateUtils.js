export function dateToIso(date) {
  const [day, month, year] = date.split("/");
  return `${month}/${day}/${year}`;
}

export function dateIsoToDate(date) {
  const [month, day, year] = date.split("/");
  return `${day}/${month}/${year}`;
}
