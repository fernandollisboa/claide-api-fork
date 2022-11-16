import * as memberRepository from "../repositories/memberRepository";

export async function checkMemberAlreadyExists(id, cpf, rg, passport, secondaryEmail) {
  let checkCpf, checkRg, checkPassport, checkSecondaryEmail;
  if (cpf) checkCpf = await memberRepository.getMemberByCpf(cpf);
  if (rg) checkRg = await memberRepository.getMemberByRg(rg);
  if (passport) {
    checkPassport = await memberRepository.getMemberByPassport(passport);
  }
  if (secondaryEmail)
    checkSecondaryEmail = await memberRepository.getMemberBySecondaryEmail(secondaryEmail);

  if (checkCpf && checkCpf.id !== id) {
    throw new Error("Already exists a Member with this cpf");
  } else if (checkPassport && checkPassport.id !== id) {
    throw new Error("Already exists a Member with this passport");
  } else if (checkRg && checkRg.id !== id) {
    throw new Error("Already exists a Member with this RG");
  } else if (checkSecondaryEmail && checkSecondaryEmail.id !== id) {
    throw new Error("Already exists a Member with this secondary email");
  }
}

export async function checkCpfRgPassportOnUpdate(isBrazilian, cpf, rg, passport, dbInfo) {
  if (isBrazilian && !dbInfo.rg.trim() && !dbInfo.cpf.trim() && !rg.trim() && !cpf.trim()) {
    throw new Error("A brazilian must have cpf or rg");
  }

  if (!isBrazilian && !dbInfo.passport.trim() && !passport.trim()) {
    throw new Error("A foreigner must have a passport");
  }
}
