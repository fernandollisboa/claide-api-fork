import MemberConflictError from "../errors/MemberConflictError";
import * as memberRepository from "../repositories/memberRepository";
import BaseError from "../errors/BaseError";
import MemberInvalidServicesError from "../errors/MemberInvalidServicesError";

export async function checkMemberAlreadyExists({
  id,
  cpf,
  rg,
  passport,
  secondaryEmail,
  lattes,
  lsdEmail,
}) {
  //TO-DO fazer todas essas verificações em paralelo
  let checkCpf, checkRg, checkPassport, checkSecondaryEmail, checkLattes, checkLsdEmail;
  if (cpf) checkCpf = await memberRepository.getMemberByCpf(cpf);
  if (rg) checkRg = await memberRepository.getMemberByRg(rg);
  if (passport) checkPassport = await memberRepository.getMemberByPassport(passport);
  if (secondaryEmail)
    checkSecondaryEmail = await memberRepository.getMemberBySecondaryEmail(secondaryEmail);
  if (lattes) checkLattes = await memberRepository.getMemberByLattes(lattes);
  if (lsdEmail) checkLsdEmail = await memberRepository.getMemberByEmailLsd(lsdEmail);

  if (checkCpf && checkCpf.id !== id) throw new MemberConflictError("cpf", cpf);
  if (checkPassport && checkPassport.id !== id) throw new MemberConflictError("passport", passport);
  if (checkRg && checkRg.id !== id) throw new MemberConflictError("rg", rg);
  if (checkSecondaryEmail && checkSecondaryEmail.id !== id)
    throw new MemberConflictError("secondaryEmail", secondaryEmail);
  if (checkLattes && checkLattes.id !== id) throw new MemberConflictError("lattes", lattes);
  if (checkLsdEmail && checkLsdEmail.id !== id)
    throw new MemberConflictError("Email LSD", lsdEmail);
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
    //!existingMember.rg.trim() && -> essa verificacao nao faz mais sentido, pois agora podemos salvar string vazia para um membro em rg e/ou cpf caso ele seja alterado para estrangeiro
    //!existingMember.cpf.trim() &&
    !rg.trim() &&
    !cpf.trim()
  ) {
    throw new BaseError("A brazilian must have cpf or rg", 422);
  }

  if (!isBrazilian && !passport.trim()) {
    throw new BaseError("A foreigner must have a passport", 422);
  }
}

export async function checkServices(services) {
  const servicesSet = new Set(services);
  if (servicesSet.size !== services.length)
    throw new MemberInvalidServicesError("Services", services);
}
