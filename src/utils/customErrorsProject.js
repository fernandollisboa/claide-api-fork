export function endDateError(date) {
  return {
    type: "error_date",
    message: `Data ${date} de encerramento anterior a data de início do projeto`,
  };
}

export function notFoundError(atribute, value) {
  return {
    type: "not_found",
    message: `Projeto com ${atribute}: ${value} não encontrado`,
  };
}

export function invalidAtribute(atribute, value) {
  return {
    type: "invalid_type",
    message: `Atributo ${atribute}: ${value} inválido`,
  };
}
