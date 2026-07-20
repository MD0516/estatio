import bcrypt from "bcrypt";
import type { PrismaClient } from "../../generated/prisma/client.js";

export async function seedOwner(prisma: PrismaClient) {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const owner = await prisma.user.upsert({
    where: { email: "owner@estatio.dev" },
    update: {},
    create: {
      name: "Estatio Owner",
      email: "owner@estatio.dev",
      password: passwordHash,
      phone: "9000000000",
      emailVerified: true,
      role: "owner",
    },
  });

  console.log(`Owner user ready: id=${owner.id} email=${owner.email}`);
  return owner;
}