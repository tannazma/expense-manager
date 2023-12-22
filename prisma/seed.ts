import userData from "./data/users.json";
import incomes from "./data/incomes.json";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seed = async () => {
  // Seed every user
  for (let i = 0; i < userData.length; i++) {
    const thisUser = userData[i];
    await prisma.user.create({
      data: thisUser,
    });
  }
};

seed();
