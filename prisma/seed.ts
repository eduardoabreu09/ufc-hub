import { GroupRole, Participation, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const bigText = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit.Vestibulum eleifend sapien a mauris viverra, at tempor diam finibus.Curabitur faucibus feugiat luctus.Duis arcu lacus, pellentesque eu imperdiet sit amet, volutpat id velit.Donec urna est, suscipit quis egestas in, accumsan sed dui.Vestibulum tristique cursus augue, vitae lacinia diam malesuada quis.Nam mattis viverra dictum.Donec tincidunt dolor a nisi iaculis, vitae dignissim orci euismod.Morbi luctus, magna sed congue commodo, lacus ipsum consequat ligula, vel tincidunt lacus libero sit amet nunc.Proin vel faucibus tortor.Curabitur rhoncus, diam at lobortis consectetur, neque eros vestibulum ipsum, interdum tempor justo velit et nisi.Praesent rhoncus nulla vitae odio sodales, sed feugiat leo ultrices.Sed augue mi, luctus quis cursus eu, laoreet fermentum elit.Vestibulum viverra neque erat, finibus feugiat tortor malesuada ut.Nam nec sapien eget lacus scelerisque porttitor.Morbi nec nisl mi.

Quisque imperdiet eu tellus sed scelerisque.Curabitur venenatis nunc est, at lacinia erat porta vitae.Donec auctor eros ac augue tincidunt dignissim.Quisque elementum nisi ut tincidunt porta.Donec consectetur viverra sodales.Morbi luctus urna eget dolor tincidunt pretium.Phasellus non dapibus turpis.Donec sed felis non risus semper finibus nec auctor nisl.Quisque fermentum ipsum nisl, at dapibus odio aliquet in.Vivamus sem urna, scelerisque feugiat ex nec, rhoncus vulputate metus.Sed lacinia, lacus id venenatis porta, leo odio elementum nisl, aliquet gravida diam lectus eu quam.Vestibulum elementum, lectus ac molestie iaculis, orci neque lacinia sapien, eget mattis sem purus convallis odio.Sed maximus, lorem in aliquam semper, sem ligula molestie urna, semper laoreet orci neque nec odio.Praesent ornare tortor id lectus ultrices consectetur.Quisque at mi fringilla, porta ipsum eget, consectetur sapien.

Vestibulum at libero gravida, varius turpis vel, laoreet dolor.Nulla eget ex placerat nisl volutpat dictum.Ut sit amet nisi ac urna venenatis ullamcorper.In eu sodales ante.Integer tempor enim neque, non faucibus orci finibus in.Cras iaculis leo sit amet risus elementum, at interdum odio dignissim.In hac habitasse platea dictumst.Nulla rhoncus vestibulum ligula ut egestas.Curabitur sagittis diam quis ipsum gravida, et cursus est dictum.Quisque sagittis diam felis, id ultrices ipsum placerat sit amet.Donec auctor, massa quis pellentesque consectetur, orci velit vestibulum est, ac posuere magna nulla eget ex.Sed vulputate cursus vehicula.Vestibulum sit amet felis sit amet nibh mollis aliquam a vitae nisi.Vestibulum varius lorem a enim congue auctor.Aliquam gravida elementum ipsum.

Praesent auctor pellentesque mauris at molestie.Curabitur mollis ligula eget convallis tristique.Nam vitae justo vel sapien commodo euismod at a urna.Nulla iaculis molestie diam varius ultricies.Donec euismod elit eu laoreet feugiat.Etiam vestibulum aliquam enim, quis finibus sapien vulputate ac.Etiam iaculis viverra feugiat.Praesent eleifend, dui in vulputate pulvinar, nisl risus cursus felis, eu lobortis orci ex efficitur diam.Ut eget sagittis mauris, sit amet egestas risus.Integer pulvinar volutpat neque, in sodales nulla tristique in.Donec in lorem a dolor commodo posuere non sit amet enim.Nulla efficitur elit congue magna ultrices tincidunt.Curabitur vel orci rhoncus, efficitur neque vitae, aliquam massa.

Duis consectetur, ipsum ut gravida vulputate, orci odio aliquet massa, vel pellentesque purus orci non orci.Quisque posuere dolor at risus pellentesque, quis commodo nisl vestibulum.Sed ac pellentesque tortor.Cras non tincidunt ex, sed tristique mauris.Duis pharetra ipsum lectus, quis hendrerit tellus scelerisque eget.Mauris leo elit, iaculis ac volutpat vitae, mollis vitae nunc.Curabitur blandit volutpat odio nec dapibus.Curabitur viverra tincidunt magna sagittis rhoncus.Quisque eu porttitor ipsum.Proin libero tellus, dignissim ac sodales sit amet, auctor a massa.Vivamus vel suscipit eros, ac suscipit turpis.Nam a risus ac dolor tincidunt accumsan sit amet vitae ante.Aenean imperdiet malesuada tortor fermentum tincidunt.Nullam luctus neque lectus, ac eleifend dolor finibus et.Donec eget lectus vitae tellus molestie consequat.Sed varius elit ex, id rhoncus mauris vulputate eget. 
`;

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

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const eventData = [
    {
      creatorId: 1,
      title: "Meu evento",
      description: "Evento número 1 para fazer teste",
      location: "Bloco 707, Campus do Pici",
      body: bigText,
      eventDate: new Date(),
      imageUrl: "https://www.ufc.br/images/ft_251111_huwcdiabetes_gr.png",
    },
    {
      creatorId: 2,
      title: "Palestra genérica 2025",
      description:
        "Essa palestra vai tratar sobre algum assunto legal, esperamos sua participação",
      body: bigText,
      location: "Auditório do Bloco 707, Campus do Pici",
      eventDate: yesterday,
      imageUrl: "https://www.ufc.br/images/ft_251111_cearaawards1_gr.jpg",
    },
  ];

  const eventParticipation = [
    {
      userId: 2,
      eventId: 1,
      participation: Participation.YES,
    },
    {
      userId: 3,
      eventId: 1,
      participation: Participation.NO,
    },
    {
      userId: 1,
      eventId: 2,
      participation: Participation.YES,
    },
  ];

  const eventTags = [
    { eventId: 1, name: "Estudo" },
    { eventId: 2, name: "Palestra" },
    { eventId: 2, name: "Tecnologia" },
    { eventId: 1, name: "Tecnologia" },
  ];

  await prisma.user.createMany({ data: usersData });
  await prisma.group.createMany({ data: groupsData });
  await prisma.userGroup.createMany({ data: userGroupsData });
  await prisma.event.createMany({ data: eventData });
  await prisma.eventTag.createMany({ data: eventTags });
  await prisma.eventParticipation.createMany({ data: eventParticipation });
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
