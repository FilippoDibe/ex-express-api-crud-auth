const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createSlug = async (title, existingSlugs) => {
  if (typeof title !== 'string' || title.trim() === '') {
    throw new Error("Invalid title");
  }

  let slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, '');
  if (slug === '') {
    throw new Error("Invalid title");
  }

  let originalSlug = slug;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${originalSlug}-${counter}`;
    counter++;
  }

  return slug;
};

const uniqueSlug = async (req, res, next) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Il titolo è richiesto per generare slug' });
  }

  try {
    const existingSlugs = await prisma.post.findMany({
      select: { slug: true }
    }).then(posts => posts.map(post => post.slug));

    req.body.slug = await createSlug(title, existingSlugs);
    next();
  } catch (error) {
    console.error("Errore durante la generazione dello slug:", error);
    res.status(500).json({ error: 'Si è verificato un errore durante la generazione dello slug.' });
  }
};

module.exports = uniqueSlug;
