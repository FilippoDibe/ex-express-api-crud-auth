// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

async function main() {
  // Cancella i dati esistenti
  await prisma.post.deleteMany();
  await prisma.categories.deleteMany();
  await prisma.tag.deleteMany();

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

  // Genera post di esempio
  const posts = Array.from({ length: 10 }).map(() => ({
    title: faker.lorem.sentence(),
    slug: faker.lorem.slug(),
    content: faker.lorem.paragraphs(3, '\n\n'), // Genera paragrafi con un delimitatore
    published: faker.datatype.boolean(),
    image: faker.image.url(),
    categoriesId: faker.helpers.arrayElement(createdCategories).id,
    tagsId: faker.helpers.arrayElements(createdTags, faker.number.int({ min: 1, max: 3 })).map(tag => tag.id),
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
        categoriesId: post.categoriesId,
        tags: {
          connect: post.tagsId.map(id => ({ id })),
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
