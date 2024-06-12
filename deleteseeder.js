const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Eliminazione di tutti i post
    await prisma.post.deleteMany();

    // Eliminazione di tutte le categorie
    await prisma.categories.deleteMany();

    // Eliminazione di tutti i tag
    await prisma.tag.deleteMany();

    await prisma.user.deleteMany();


    console.log('Database svuotato con successo');
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
