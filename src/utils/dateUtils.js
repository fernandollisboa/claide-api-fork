import InvalidAtributeError from "../errors/InvalidAtributeError";

export function parseBrDateToStandardDate(date) {
  try {
    const [day, month, year] = date.split("/");
    return `${month}/${day}/${year}`;
  } catch (err) {
    throw new InvalidAtributeError("date", date);
  }
}
