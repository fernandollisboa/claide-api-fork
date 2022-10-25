import prisma from "../database/prismaClient";

export async function insertUser({ name, email, password }) {
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
  return user;
}
