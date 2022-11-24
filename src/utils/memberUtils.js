import * as memberRepository from "../repositories/memberRepository";

export async function checkMemberAlreadyExists(id, cpf, rg, passport, secondaryEmail) {
  //TO-DO fazer todas essas verificações em paralelo
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

//TO-DO refatorar/renomear essa função,
//      que tal checkMemberDocumentsOnUpdate({ isBrazilian, cpf, rg, passport, existingMember })
export async function checkMemberDocumentsOnUpdate({
  isBrazilian,
  cpf,
  rg,
  passport,
  existingMember,
}) {
  if (
    isBrazilian &&
    (!existingMember.rg.trim() || !existingMember.cpf.trim() || !rg.trim() || !cpf.trim())
  ) {
    throw new Error("A brazilian must have cpf or rg");
  }

  if (!isBrazilian && (!existingMember.passport.trim() || !passport.trim())) {
    throw new Error("A foreigner must have a passport");
  }
}
