import { GroupRole, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = await bcrypt.hash("@Admin123", 10);
  const usersData = [
    {
      id: 0,
      email: "ana.silva@ufc.br",
      username: "anasilva",
      name: "Ana Silva",
      course: "Engenharia Civil",
      password: defaultPassword,
    },
    {
      id: 1,
      email: "joao.sousa@ufc.br",
      username: "joaosousa",
      name: "João Sousa",
      course: "Engenharia de Computação",
      password: defaultPassword,
    },
    {
      id: 2,
      email: "maria.lima@ufc.br",
      username: "marialima",
      name: "Maria Lima",
      course: "Medicina",
      password: defaultPassword,
    },
  ];

  const groupsData = [
    {
      id: 0,
      name: "Vamos Estudar Civil",
      description: "Grupo para estudos em grupo de Engenharia Civil",
      creatorId: 0,
    },
    {
      id: 1,
      name: "Vamos Estudar",
      creatorId: 0,
    },
    {
      id: 2,
      name: "Vamos Conversar",
      description: "Grupo para conversas gerais",
      creatorId: 2,
    },
  ];

  const userGroupsData = [
    { userId: 0, groupId: 0, role: GroupRole.ADMIN },
    { userId: 0, groupId: 1, role: GroupRole.ADMIN },
    { userId: 2, groupId: 2, role: GroupRole.ADMIN },

    { userId: 1, groupId: 0, role: GroupRole.USER },
    { userId: 0, groupId: 2, role: GroupRole.USER },
    { userId: 1, groupId: 2, role: GroupRole.USER },
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
