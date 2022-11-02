export function endDateError(date) {
  return {
    type: "error_date",
    message: `Data ${date} de encerramento anterior a data de início do projeto`,
  };
}
