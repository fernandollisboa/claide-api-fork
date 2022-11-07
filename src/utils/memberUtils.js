import * as memberRepository from "../repositories/memberRepository";

export async function checkMemberAlreadyExists(body) {
  let checkCpf, checkRg, checkPassport, checkSecondaryEmail;
  if (body.cpf !== undefined && body.cpf !== null && body.cpf !== "")
    checkCpf = await memberRepository.getMemberByCpf(body.cpf);
  if (body.rg !== undefined && body.rg !== "" && body.rg !== null)
    checkRg = await memberRepository.getMemberByRg(body.rg);
  if (body.passport !== undefined && body.passport !== null && body.passport !== "")
    checkPassport = await memberRepository.getMemberByPassport(body.passport);
  if (
    body.secondaryEmail !== undefined &&
    body.secondaryEmail !== null &&
    body.secondaryEmail !== ""
  )
    checkPassport = await memberRepository.getMemberBySecondaryEmail(body.secondaryEmail);

  if (checkCpf !== undefined && checkCpf !== null) {
    throw new Error(" Already exists a Member with this cpf");
  } else if (checkPassport !== undefined && checkPassport !== null) {
    throw new Error(" Already exists a Member with this passport");
  } else if (checkRg !== undefined && checkRg !== null) {
    throw new Error(" Already exists a Member with this RG");
  } else if (checkSecondaryEmail !== undefined && checkSecondaryEmail !== null) {
    throw new Error(" Already exists a Member with this secondary email");
  }
}
