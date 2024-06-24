const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

async function main() {
  // Cancella i dati esistenti
  await prisma.post.deleteMany();
  await prisma.categories.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // Categorie di esempio
  const categories = ['Technology', 'Health', 'Travel', 'Education', 'Food'].map(name => ({
    name,
  }));

  // Tags di esempio
  const tags = ['JavaScript', 'React', 'Fitness', 'Nutrition', 'Adventure', 'Culture', 'Programming', 'Lifestyle'].map(name => ({
    name,
  }));

  // Crea categorie usando upsert per evitare duplicati
  const createdCategories = await Promise.all(
    categories.map(async category => {
      return await prisma.categories.upsert({
        where: { name: category.name },
        update: {},
        create: category,
      });
    })
  );

  // Crea tags usando upsert per evitare duplicati
  const createdTags = await Promise.all(
    tags.map(async tag => {
      return await prisma.tag.upsert({
        where: { name: tag.name },
        update: {},
        create: tag,
      });
    })
  );

  // Crea utenti di esempio
  const users = await Promise.all(Array.from({ length: 5 }).map(async () => ({
    email: faker.internet.email(),
    name: faker.person.fullName(),
    password: await hashPassword('password123'), // Usa una funzione per hashare la password
    img_path: faker.image.avatar(),
  })));

  const createdUsers = await Promise.all(
    users.map(async user => {
      return await prisma.user.create({
        data: user,
      });
    })
  );

  // Genera post di esempio
  const posts = Array.from({ length: 10 }).map(() => ({
    title: faker.lorem.sentence(),
    slug: faker.lorem.slug(),
    content: faker.lorem.paragraphs(3, '\n\n'), // Genera paragrafi con un delimitatore
    published: faker.datatype.boolean(),
    image: faker.image.url(),
    categoryId: faker.helpers.arrayElement(createdCategories).id,
    tagsId: faker.helpers.arrayElements(createdTags, faker.number.int({ min: 1, max: 3 })).map(tag => tag.id),
    authorId: faker.helpers.arrayElement(createdUsers).id, // Associa un autore casuale a ciascun post
  }));

  // Crea post
  await Promise.all(
    posts.map(post => prisma.post.create({
      data: {
        title: post.title,
        slug: post.slug,
        content: post.content,
        published: post.published,
        image: post.image,
        category: {
          connect: { id: post.categoryId },
        },
        tags: {
          connect: post.tagsId.map(id => ({ id })),
        },
        author: {
          connect: { id: post.authorId }, // Collegamento all'autore
        },
      },
    }))
  );

  console.log('Database populated successfully with sample data!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Funzione di hashing della password (puoi usare bcrypt o un altro metodo)
async function hashPassword(password) {
  const bcrypt = require('bcrypt');
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}
