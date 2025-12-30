import "dotenv/config";
import { GroupRole, Participation, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import { fakerPT_BR as faker } from "@faker-js/faker";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const COURSES = [
  "Engenharia de Computação",
  "Engenharia Civil",
  "Engenharia Elétrica",
  "Medicina",
  "Direito",
  "Design",
  "Administração",
  "Psicologia",
  "Arquitetura",
  "Sistemas de Informação",
  "Ciência da Computação",
  "Letras",
  "Filosofia",
  "Física",
  "Matemática",
];

const TAGS = [
  "Estudo", "Tecnologia", "Saúde", "Cinema", "Cultura", "Design", "Produto",
  "Inovação", "Apoio", "Cálculo", "Programação", "Carreira", "Eventos", "UFC"
];

async function resetDatabase() {
  console.log("Resetting database...");
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

async function seedUsers(count: number) {
  console.log(`Seeding ${count} users...`);
  const defaultPassword = await bcrypt.hash("@Admin123", 10);
  
  const usersData = Array.from({ length: count }).map(() => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return {
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName, provider: "ufc.br" }).toLowerCase(),
      course: faker.helpers.arrayElement(COURSES),
      password: defaultPassword,
    };
  });

  // Split into chunks to avoid memory issues or large transaction limits
  const chunkSize = 1000;
  for (let i = 0; i < usersData.length; i += chunkSize) {
    await prisma.user.createMany({
      data: usersData.slice(i, i + chunkSize),
      skipDuplicates: true,
    });
  }

  const users = await prisma.user.findMany({ select: { id: true } });
  return users.map(u => u.id);
}

async function seedGroups(userIds: number[], count: number) {
  console.log(`Seeding ${count} groups...`);
  
  const groupsData = Array.from({ length: count }).map(() => ({
    name: faker.company.name(),
    description: faker.lorem.sentence(),
    creatorId: faker.helpers.arrayElement(userIds),
  }));

  await prisma.group.createMany({ data: groupsData });
  const groups = await prisma.group.findMany({ select: { id: true, creatorId: true } });
  const groupIds = groups.map(g => g.id);

  console.log("Adding members to groups...");
  const userGroupsData: { userId: number; groupId: number; role: GroupRole }[] = [];
  
  for (const group of groups) {
    // Add creator as ADMIN
    userGroupsData.push({
      userId: group.creatorId,
      groupId: group.id,
      role: GroupRole.ADMIN,
    });

    // Add 5-20 random members
    const memberCount = faker.number.int({ min: 5, max: 20 });
    const randomMembers = faker.helpers.arrayElements(userIds, memberCount);
    
    for (const memberId of randomMembers) {
      if (memberId !== group.creatorId) {
        userGroupsData.push({
          userId: memberId,
          groupId: group.id,
          role: GroupRole.USER,
        });
      }
    }
  }

  // Chunk UserGroup inserts
  const chunkSize = 2000;
  for (let i = 0; i < userGroupsData.length; i += chunkSize) {
    await prisma.userGroup.createMany({
      data: userGroupsData.slice(i, i + chunkSize),
      skipDuplicates: true,
    });
  }

  return groupIds;
}

async function seedEvents(userIds: number[], groupIds: number[], count: number) {
  console.log(`Seeding ${count} events...`);
  
  const eventsData = Array.from({ length: count }).map(() => {
    const eventDate = faker.date.future();
    return {
      title: faker.lorem.words({ min: 3, max: 6 }),
      description: faker.lorem.sentence(),
      body: faker.lorem.paragraphs(3),
      location: faker.location.streetAddress(),
      eventDate,
      duration: faker.number.int({ min: 30, max: 480 }),
      creatorId: faker.helpers.arrayElement(userIds),
      groupId: faker.helpers.arrayElement([...groupIds, null]),
      imageUrl: faker.image.url(),
    };
  });

  // createMany doesn't support nested creates for tags, so we'll do it in chunks
  const chunkSize = 100;
  for (let i = 0; i < eventsData.length; i += chunkSize) {
    await prisma.event.createMany({
      data: eventsData.slice(i, i + chunkSize),
    });
  }

  const events = await prisma.event.findMany({ select: { id: true } });
  const eventIds = events.map(e => e.id);

  console.log("Seeding event tags and participations...");
  const eventTagsData: { eventId: number; name: string }[] = [];
  const participationsData: { userId: number; eventId: number; participation: Participation }[] = [];

  for (const eventId of eventIds) {
    // Tags
    const tagCount = faker.number.int({ min: 1, max: 3 });
    const selectedTags = faker.helpers.arrayElements(TAGS, tagCount);
    for (const tagName of selectedTags) {
      eventTagsData.push({ eventId, name: tagName });
    }

    // Participations (10-30 per event)
    const partCount = faker.number.int({ min: 10, max: 30 });
    const randomUsers = faker.helpers.arrayElements(userIds, partCount);
    for (const userId of randomUsers) {
      participationsData.push({
        userId,
        eventId,
        participation: faker.helpers.arrayElement([Participation.YES, Participation.NO, Participation.MAYBE]),
      });
    }
  }

  await prisma.eventTag.createMany({ data: eventTagsData, skipDuplicates: true });
  
  const partChunkSize = 2000;
  for (let i = 0; i < participationsData.length; i += partChunkSize) {
    await prisma.eventParticipation.createMany({
      data: participationsData.slice(i, i + partChunkSize),
      skipDuplicates: true,
    });
  }

  return eventIds;
}

async function seedBlogPosts(userIds: number[], count: number) {
  console.log(`Seeding ${count} blog posts...`);
  
  const blogPostsData = Array.from({ length: count }).map(() => ({
    title: faker.lorem.sentence(),
    body: faker.lorem.sentences(2),
    content: faker.lorem.paragraphs(5),
    authorId: faker.helpers.arrayElement(userIds),
  }));

  const chunkSize = 100;
  for (let i = 0; i < blogPostsData.length; i += chunkSize) {
    await prisma.blogPost.createMany({
      data: blogPostsData.slice(i, i + chunkSize),
    });
  }

  const blogPosts = await prisma.blogPost.findMany({ select: { id: true } });
  const blogPostIds = blogPosts.map(b => b.id);

  console.log("Seeding blog tags...");
  const blogTagsData: { blogId: number; name: string }[] = [];
  for (const blogId of blogPostIds) {
    const tagCount = faker.number.int({ min: 1, max: 3 });
    const selectedTags = faker.helpers.arrayElements(TAGS, tagCount);
    for (const tagName of selectedTags) {
      blogTagsData.push({ blogId, name: tagName });
    }
  }

  await prisma.blogTag.createMany({ data: blogTagsData, skipDuplicates: true });

  return blogPostIds;
}

async function main() {
  const startTime = Date.now();
  
  await resetDatabase();

  const userIds = await seedUsers(10000);
  const groupIds = await seedGroups(userIds, 300);
  const eventIds = await seedEvents(userIds, groupIds, 800);
  const blogPostIds = await seedBlogPosts(userIds, 600);

  const duration = (Date.now() - startTime) / 1000;
  console.log(`Seed completed in ${duration.toFixed(2)}s`, {
    users: userIds.length,
    groups: groupIds.length,
    events: eventIds.length,
    blogPosts: blogPostIds.length,
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
