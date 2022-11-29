import MemberConflictError from "../errors/MemberConflictError";
import * as memberRepository from "../repositories/memberRepository";

export async function checkMemberAlreadyExists(id, cpf, rg, passport, secondaryEmail) {
  //TO-DO fazer todas essas verificações em paralelo
  let checkCpf, checkRg, checkPassport, checkSecondaryEmail;
  if (cpf) checkCpf = await memberRepository.getMemberByCpf(cpf);
  if (rg) checkRg = await memberRepository.getMemberByRg(rg);
  if (passport) checkPassport = await memberRepository.getMemberByPassport(passport);
  if (secondaryEmail)
    checkSecondaryEmail = await memberRepository.getMemberBySecondaryEmail(secondaryEmail);

  if (checkCpf && checkCpf.id !== id) throw new MemberConflictError("cpf", cpf);
  if (checkPassport && checkPassport.id !== id) throw new MemberConflictError("passport", passport);
  if (checkRg && checkRg.id !== id) throw new MemberConflictError("rg", rg);
  if (checkSecondaryEmail && checkSecondaryEmail.id !== id)
    throw new MemberConflictError("secondaryEmail", secondaryEmail);
}

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

  //TO-DO trocar eses dois pra BaseError
  if (!isBrazilian && (!existingMember.passport.trim() || !passport.trim())) {
    throw new Error("A foreigner must have a passport");
  }
}
