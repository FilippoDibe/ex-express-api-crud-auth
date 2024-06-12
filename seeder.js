const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Creazione degli utenti
    const users = await prisma.user.createMany({
      data: Array.from({ length: 10 }, (_, i) => ({
        email: `user${i + 1}@example.com`,
        name: `User ${i + 1}`,
        password: 'password' // Assicurati di hashare le password in un caso reale
      }))
    });

    // Creazione delle categorie
    const categories = await prisma.categories.createMany({
      data: [
        { name: 'Category 1' },
        { name: 'Category 2' },
        { name: 'Category 3' }
      ]
    });

    // Creazione dei tag
    const tags = await prisma.tag.createMany({
      data: Array.from({ length: 5 }, (_, i) => ({
        name: `Tag ${i + 1}`
      }))
    });

    // Creazione dei post
    const posts = await prisma.post.createMany({
      data: Array.from({ length: 20 }, (_, i) => {
        const categoryId = categories[Math.floor(Math.random() * categories.length)].id;
        const authorId = users[Math.floor(Math.random() * users.length)].id;
        const tagIds = tags.slice(0, Math.floor(Math.random() * tags.length) + 1).map(tag => tag.id);
        return {
          title: `Post ${i + 1}`,
          slug: `post-${i + 1}`,
          content: `Content of post ${i + 1}`,
          published: true,
          categoriesId: categoryId,
          authorId: authorId,
          tags: { connect: tagIds.map(tagId => ({ id: tagId })) }
        };
      })
    });

    console.log('Seed completed successfully');
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
