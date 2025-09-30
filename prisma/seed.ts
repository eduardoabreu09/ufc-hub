import { GroupRole, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = await bcrypt.hash("@Admin123", 10);
  const usersData = [
    {
      email: "ana.silva@ufc.br",
      name: "Ana Silva",
      course: "Engenharia Civil",
      password: defaultPassword,
    },
    {
      email: "joao.sousa@ufc.br",
      name: "João Sousa",
      course: "Engenharia de Computação",
      password: defaultPassword,
    },
    {
      email: "maria.lima@ufc.br",
      name: "Maria Lima",
      course: "Medicina",
      password: defaultPassword,
    },
  ];

  const groupsData = [
    {
      name: "Vamos Estudar Civil",
      description: "Grupo para estudos em grupo de Engenharia Civil",
      creatorId: 1,
    },
    {
      name: "Vamos Estudar",
      creatorId: 1,
    },
    {
      name: "Vamos Conversar",
      description: "Grupo para conversas gerais",
      creatorId: 3,
    },
  ];

  const userGroupsData = [
    { userId: 1, groupId: 1, role: GroupRole.ADMIN },
    { userId: 1, groupId: 2, role: GroupRole.ADMIN },
    { userId: 3, groupId: 3, role: GroupRole.ADMIN },

    { userId: 2, groupId: 1, role: GroupRole.USER },
    { userId: 1, groupId: 3, role: GroupRole.USER },
    { userId: 2, groupId: 3, role: GroupRole.USER },
  ];

  await prisma.user.createMany({ data: usersData });
  await prisma.group.createMany({ data: groupsData });
  await prisma.userGroup.createMany({ data: userGroupsData });
  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
