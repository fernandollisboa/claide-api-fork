import dayjs from "dayjs";
import InvalidDateError from "../errors/InvalidDateError";

export function parseBrDateToStandardDate(date) {
  try {
    const [day, month, year] = date.split("/");
    return `${month}/${day}/${year}`;
  } catch (err) {
    throw new InvalidDateError(date);
  }
}

export function parseISODateToBrDate(date) {
  return dayjs(date).format("DD/MM/YYYY");
}
