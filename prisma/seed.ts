import { GroupRole, Participation, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const bigText = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eleifend sapien a mauris viverra, at tempor diam finibus. Curabitur faucibus feugiat luctus. Duis arcu lacus, pellentesque eu imperdiet sit amet, volutpat id velit. Donec urna est, suscipit quis egestas in, accumsan sed dui. Vestibulum tristique cursus augue, vitae lacinia diam malesuada quis. Nam mattis viverra dictum. Donec tincidunt dolor a nisi iaculis, vitae dignissim orci euismod. Morbi luctus, magna sed congue commodo, lacus ipsum consequat ligula, vel tincidunt lacus libero sit amet nunc.

Quisque imperdiet eu tellus sed scelerisque. Curabitur venenatis nunc est, at lacinia erat porta vitae. Donec auctor eros ac augue tincidunt dignissim. Quisque elementum nisi ut tincidunt porta. Donec consectetur viverra sodales. Morbi luctus urna eget dolor tincidunt pretium. Phasellus non dapibus turpis. Donec sed felis non risus semper finibus nec auctor nisl. Quisque fermentum ipsum nisl, at dapibus odio aliquet in. Vivamus sem urna, scelerisque feugiat ex nec, rhoncus vulputate metus.

Vestibulum at libero gravida, varius turpis vel, laoreet dolor. Nulla eget ex placerat nisl volutpat dictum. Ut sit amet nisi ac urna venenatis ullamcorper. In eu sodales ante. Integer tempor enim neque, non faucibus orci finibus in. Cras iaculis leo sit amet risus elementum, at interdum odio dignissim. In hac habitasse platea dictumst. Nulla rhoncus vestibulum ligula ut egestas. Curabitur sagittis diam quis ipsum gravida, et cursus est dictum.

Praesent auctor pellentesque mauris at molestie. Curabitur mollis ligula eget convallis tristique. Nam vitae justo vel sapien commodo euismod at a urna. Nulla iaculis molestie diam varius ultricies. Donec euismod elit eu laoreet feugiat. Etiam vestibulum aliquam enim, quis finibus sapien vulputate ac. Etiam iaculis viverra feugiat. Praesent eleifend, dui in vulputate pulvinar, nisl risus cursus felis, eu lobortis orci ex efficitur diam.

Duis consectetur, ipsum ut gravida vulputate, orci odio aliquet massa, vel pellentesque purus orci non orci. Quisque posuere dolor at risus pellentesque, quis commodo nisl vestibulum. Sed ac pellentesque tortor. Cras non tincidunt ex, sed tristique mauris. Duis pharetra ipsum lectus, quis hendrerit tellus scelerisque eget. Mauris leo elit, iaculis ac volutpat vitae, mollis vitae nunc. Curabitur blandit volutpat odio nec dapibus. Curabitur viverra tincidunt magna sagittis rhoncus. Quisque eu porttitor ipsum. Proin libero tellus, dignissim ac sodales sit amet, auctor a massa.
`;

const daysFromNow = (days: number) => {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now;
};

async function resetDatabase() {
  await prisma.$transaction([
    prisma.like.deleteMany(),
    prisma.message.deleteMany(),
    prisma.eventParticipation.deleteMany(),
    prisma.eventTag.deleteMany(),
    prisma.blogTag.deleteMany(),
    prisma.event.deleteMany(),
    prisma.blogPost.deleteMany(),
    prisma.userGroup.deleteMany(),
    prisma.group.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}

async function seedUsers() {
  const defaultPassword = await bcrypt.hash("@Admin123", 10);

  const users = [
    {
      email: "ana.silva@ufc.br",
      name: "Ana Silva",
      course: "Engenharia Civil",
      password: defaultPassword,
    },
    {
      email: "joao.sousa@ufc.br",
      name: "Joao Sousa",
      course: "Engenharia de Computacao",
      password: defaultPassword,
    },
    {
      email: "maria.lima@ufc.br",
      name: "Maria Lima",
      course: "Medicina",
      password: defaultPassword,
    },
    {
      email: "bruno.costa@ufc.br",
      name: "Bruno Costa",
      course: "Design",
      password: defaultPassword,
    },
    {
      email: "clara.nunes@ufc.br",
      name: "Clara Nunes",
      course: "Direito",
      password: defaultPassword,
    },
    {
      email: "rafael.oliveira@ufc.br",
      name: "Rafael Oliveira",
      course: "Administracao",
      password: defaultPassword,
    },
  ];

  return Promise.all(users.map((user) => prisma.user.create({ data: user })));
}

async function seedGroups(users: Awaited<ReturnType<typeof seedUsers>>) {
  const [ana, joao, maria, bruno, clara, rafael] = users;

  const studyGroup = await prisma.group.create({
    data: {
      name: "Estudos de Calculo I",
      description: "Listas comentadas, resumos e monitorias de Calculo I",
      creatorId: ana.id,
      users: {
        create: [
          { userId: ana.id, role: GroupRole.ADMIN },
          { userId: joao.id, role: GroupRole.USER },
          { userId: maria.id, role: GroupRole.USER },
        ],
      },
      messages: {
        create: [
          { senderId: joao.id, body: "Alguem revisou a lista 3?" },
          { senderId: ana.id, body: "Posto o gabarito ainda hoje." },
        ],
      },
    },
  });

  const techGroup = await prisma.group.create({
    data: {
      name: "Liga de Tecnologia",
      description: "Eventos, projetos e monitorias de computacao",
      creatorId: joao.id,
      users: {
        create: [
          { userId: joao.id, role: GroupRole.ADMIN },
          { userId: bruno.id, role: GroupRole.ADMIN },
          { userId: rafael.id, role: GroupRole.USER },
        ],
      },
      messages: {
        create: [
          {
            senderId: rafael.id,
            body: "Precisamos de voluntarios para o hackathon.",
          },
          { senderId: joao.id, body: "Vou fechar as trilhas ate sexta." },
        ],
      },
    },
  });

  const healthGroup = await prisma.group.create({
    data: {
      name: "Saude e Bem-Estar",
      description:
        "Discussao sobre bem-estar, pratica esportiva e apoio estudantil",
      creatorId: maria.id,
      users: {
        create: [
          { userId: maria.id, role: GroupRole.ADMIN },
          { userId: clara.id, role: GroupRole.USER },
          { userId: ana.id, role: GroupRole.USER },
        ],
      },
      messages: {
        create: [
          {
            senderId: clara.id,
            body: "Podemos marcar uma caminhada no campus?",
          },
        ],
      },
    },
  });

  const cinemaGroup = await prisma.group.create({
    data: {
      name: "Cinema e Cultura",
      description: "Cineclubes, debates e roteiros criativos",
      creatorId: bruno.id,
      users: {
        create: [
          { userId: bruno.id, role: GroupRole.ADMIN },
          { userId: clara.id, role: GroupRole.USER },
          { userId: rafael.id, role: GroupRole.USER },
        ],
      },
      messages: {
        create: [
          { senderId: rafael.id, body: "Sugiro tarantino na proxima sessao." },
          { senderId: bruno.id, body: "Fechado, escolho o filme hoje." },
        ],
      },
    },
  });

  return { studyGroup, techGroup, healthGroup, cinemaGroup };
}

async function seedEvents(
  users: Awaited<ReturnType<typeof seedUsers>>,
  groups: Awaited<ReturnType<typeof seedGroups>>
) {
  const [ana, joao, maria, bruno, clara, rafael] = users;
  const { studyGroup, techGroup, healthGroup, cinemaGroup } = groups;

  return Promise.all([
    prisma.event.create({
      data: {
        title: "Revisao para prova de Calculo",
        description: "Encontro rapido para revisar integrais e limites",
        body: bigText,
        location: "Sala 201, Bloco 701",
        duration: 90,
        eventDate: daysFromNow(3),
        creatorId: ana.id,
        groupId: studyGroup.id,
        tags: { create: [{ name: "Estudo" }, { name: "Calculo" }] },
        participations: {
          create: [
            { userId: ana.id, participation: Participation.YES },
            { userId: joao.id, participation: Participation.MAYBE },
            { userId: maria.id, participation: Participation.YES },
          ],
        },
        likes: { create: [{ userId: rafael.id }, { userId: clara.id }] },
        messages: {
          create: [
            {
              senderId: joao.id,
              body: "Consigo levar um quadro de exercicios.",
            },
            { senderId: maria.id, body: "Vou focar em limites laterais." },
          ],
        },
      },
    }),
    prisma.event.create({
      data: {
        title: "Hackathon Pici 2025",
        description: "48h de maratona para resolver desafios da universidade",
        body: bigText,
        location: "Auditorio do Pici",
        duration: 480,
        imageUrl: "https://www.ufc.br/images/ft_251111_cearaawards1_gr.jpg",
        eventDate: daysFromNow(14),
        creatorId: joao.id,
        groupId: techGroup.id,
        tags: { create: [{ name: "Tecnologia" }, { name: "Inovacao" }] },
        participations: {
          create: [
            { userId: joao.id, participation: Participation.YES },
            { userId: bruno.id, participation: Participation.YES },
            { userId: rafael.id, participation: Participation.MAYBE },
          ],
        },
        likes: {
          create: [
            { userId: ana.id },
            { userId: maria.id },
            { userId: clara.id },
          ],
        },
        messages: {
          create: [
            { senderId: bruno.id, body: "Podemos abrir uma trilha de design?" },
            { senderId: rafael.id, body: "Tenho patrocinio para os lanches." },
          ],
        },
      },
    }),
    prisma.event.create({
      data: {
        title: "Roda de conversa: Saude Mental",
        description: "Espaco seguro para falar sobre rotina, sono e apoio",
        body: bigText,
        location: "Casa de Cultura",
        duration: 120,
        eventDate: daysFromNow(-2),
        creatorId: maria.id,
        groupId: healthGroup.id,
        tags: { create: [{ name: "Saude" }, { name: "Apoio" }] },
        participations: {
          create: [
            { userId: maria.id, participation: Participation.YES },
            { userId: ana.id, participation: Participation.MAYBE },
            { userId: clara.id, participation: Participation.YES },
          ],
        },
        likes: { create: [{ userId: joao.id }] },
        messages: {
          create: [
            {
              senderId: clara.id,
              body: "Vale trazer colegas de outros cursos?",
            },
          ],
        },
      },
    }),
    prisma.event.create({
      data: {
        title: "Sessao de cinema: Tarantino",
        description: "Bate-papo apos exibicao de Pulp Fiction",
        body: bigText,
        location: "Sala multimidia do RU",
        duration: 150,
        eventDate: daysFromNow(5),
        creatorId: bruno.id,
        groupId: cinemaGroup.id,
        tags: { create: [{ name: "Cinema" }, { name: "Cultura" }] },
        participations: {
          create: [
            { userId: bruno.id, participation: Participation.YES },
            { userId: clara.id, participation: Participation.YES },
            { userId: rafael.id, participation: Participation.YES },
          ],
        },
        likes: { create: [{ userId: maria.id }] },
        messages: {
          create: [{ senderId: rafael.id, body: "Alguem leva pipoca?" }],
        },
      },
    }),
    prisma.event.create({
      data: {
        title: "Aula aberta de UX e prototipacao",
        description: "Figma, fluxos e handoff para devs",
        body: bigText,
        location: "Lab de Informatica 2",
        duration: 120,
        eventDate: daysFromNow(7),
        creatorId: bruno.id,
        groupId: techGroup.id,
        tags: { create: [{ name: "Design" }, { name: "Produto" }] },
        participations: {
          create: [
            { userId: bruno.id, participation: Participation.YES },
            { userId: joao.id, participation: Participation.YES },
            { userId: ana.id, participation: Participation.NO },
          ],
        },
        likes: { create: [{ userId: clara.id }] },
        messages: {
          create: [
            { senderId: bruno.id, body: "Tragam notebooks carregados." },
          ],
        },
      },
    }),
  ]);
}

async function seedBlogPosts(users: Awaited<ReturnType<typeof seedUsers>>) {
  const [ana, joao, maria, bruno, clara, rafael] = users;

  return Promise.all([
    prisma.blogPost.create({
      data: {
        title: "Como organizar seus estudos no semestre",
        body: "Calendario semanal, revisoes e tecnicas rapidas.",
        content: bigText,
        authorId: joao.id,
        tags: { create: [{ name: "Estudo" }, { name: "Rotina" }] },
        likes: {
          create: [
            { userId: ana.id },
            { userId: maria.id },
            { userId: rafael.id },
          ],
        },
        messages: {
          create: [
            { senderId: ana.id, body: "Usei o modelo de calendario e ajudou." },
            { senderId: rafael.id, body: "Vou adaptar para estagio." },
          ],
        },
      },
    }),
    prisma.blogPost.create({
      data: {
        title: "Checklist rapida para projetos de design",
        body: "Como sair do briefing para um prototipo navegavel.",
        content: bigText,
        authorId: bruno.id,
        tags: { create: [{ name: "Design" }, { name: "Produto" }] },
        likes: { create: [{ userId: clara.id }, { userId: joao.id }] },
        messages: {
          create: [
            { senderId: clara.id, body: "Adorei a parte de acessibilidade." },
          ],
        },
      },
    }),
    prisma.blogPost.create({
      data: {
        title: "Pesquisa cientifica: primeiros passos",
        body: "Referencias, grupos de pesquisa e biblioteca digital.",
        content: bigText,
        authorId: maria.id,
        tags: { create: [{ name: "Pesquisa" }, { name: "Biblioteca" }] },
        likes: { create: [{ userId: ana.id }, { userId: joao.id }] },
        messages: {
          create: [{ senderId: ana.id, body: "Vou indicar para a monitoria." }],
        },
      },
    }),
    prisma.blogPost.create({
      data: {
        title: "Guia de editais e bolsas",
        body: "Onde acompanhar oportunidades e como se preparar.",
        content: bigText,
        authorId: clara.id,
        tags: { create: [{ name: "Bolsa" }, { name: "Oportunidades" }] },
        likes: { create: [{ userId: maria.id }, { userId: rafael.id }] },
        messages: {
          create: [
            {
              senderId: rafael.id,
              body: "Tem edital de inovacao aberto este mes.",
            },
          ],
        },
      },
    }),
  ]);
}

async function main() {
  await resetDatabase();

  const users = await seedUsers();
  const groups = await seedGroups(users);
  const events = await seedEvents(users, groups);
  const blogPosts = await seedBlogPosts(users);

  console.log("Seed completed", {
    users: users.length,
    groups: Object.keys(groups).length,
    events: events.length,
    blogPosts: blogPosts.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
