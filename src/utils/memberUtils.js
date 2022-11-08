import * as memberRepository from "../repositories/memberRepository";

export async function checkMemberAlreadyExists(body) {
  let checkCpf, checkRg, checkPassport, checkSecondaryEmail;
  if (body.cpf !== undefined && body.cpf !== null && body.cpf !== "")
    checkCpf = await memberRepository.getMemberByCpf(body.cpf);
  if (body.rg !== undefined && body.rg !== "" && body.rg !== null)
    checkRg = await memberRepository.getMemberByRg(body.rg);
  if (body.passport !== undefined && body.passport !== null && body.passport !== "") {
    checkPassport = await memberRepository.getMemberByPassport(body.passport);
  }
  if (
    body.secondaryEmail !== undefined &&
    body.secondaryEmail !== null &&
    body.secondaryEmail !== ""
  )
    checkSecondaryEmail = await memberRepository.getMemberBySecondaryEmail(body.secondaryEmail);

  if (checkCpf !== undefined && checkCpf !== null && checkCpf.id !== body.id) {
    throw new Error(" Already exists a Member with this cpf");
  } else if (
    checkPassport !== undefined &&
    checkPassport !== null &&
    checkPassport.id !== body.id
  ) {
    throw new Error(" Already exists a Member with this passport");
  } else if (checkRg !== undefined && checkRg !== null && checkRg.id !== body.id) {
    throw new Error(" Already exists a Member with this RG");
  } else if (
    checkSecondaryEmail !== undefined &&
    checkSecondaryEmail !== null &&
    checkSecondaryEmail.id !== body.id
  ) {
    throw new Error(" Already exists a Member with this secondary email");
  }
}

export async function checkCpfRgPassportOnUpdate(bodyReq, dbInfo) {
  if (
    bodyReq.isBrazilian &&
    (dbInfo.rg === null || dbInfo.rg === "") &&
    (dbInfo.cpf === null || dbInfo.cpf === "") &&
    (bodyReq.rg === null || bodyReq.rg === "") &&
    (bodyReq.cpf === null || bodyReq.cpf === "")
  ) {
    throw new Error("A brazilian must cpf or rg");
  }
  if (
    !bodyReq.isBrazilian &&
    (dbInfo.passport === null || dbInfo.passport === "") &&
    (bodyReq.passport === null || bodyReq.passport === "")
  ) {
    throw new Error("A gringo must have a passport");
  }
}
