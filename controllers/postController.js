const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const create = async (req, res) => {
    const { title, slug, content, published, categoriesId, tagIds } = req.body;

    try {
        const post = await prisma.post.create({
            data: {
                title,
                slug,
                content,
                published,
                categoriesId,
                tags: {
                    connect: tagIds.map(id => ({ id }))
                }
            },
            include: {
                tags: true,
                Categories: true
            }
        });
        res.status(200).send(post);
    } catch (err) {
        console.error("Errore durante la creazione del post:", err);
        res.status(500).json({ err: "Si è verificato un errore durante la creazione del post." });
    }
};

const showBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const post = await prisma.post.findUnique({
            where: { slug },
            include: {
                tags: true,
                Categories: true
            }
        });
        if (post) {
            res.json(post);
        } else {
            return res.status(404).json({ error: 'Post non trovato.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Si è verificato un errore durante il recupero del post.' });
    }
};

const index = async (req, res) => {
    const { published, search } = req.query;
    try {
        const posts = await prisma.post.findMany({
            where: {
                AND: [
                    published !== undefined ? { published: published === 'true' } : {},
                    search ? {
                        OR: [
                            { title: { contains: search, mode: 'insensitive' } },
                            { content: { contains: search, mode: 'insensitive' } }
                        ]
                    } : {}
                ]
            },
            include: {
                tags: true,
                Categories: true
            }
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Si è verificato un errore durante il recupero dei post.' });
    }
};

const update = async (req, res) => {
  try {
      const { slug } = req.params;
      const { title, content, published, categoriesId, tags } = req.body;
      
      // Prepara i dati da aggiornare
      const updateData = {
          title,
          content,
          published,
          categoriesId,
          tags: {
              set: tags.map(id => ({ id })) // Imposta i nuovi tag
          }
      };

      // Esegui l'aggiornamento
      const post = await prisma.post.update({
          where: { slug },
          data: updateData,
          include: {
              tags: true,
              Categories: true
          }
      });

      res.json(post);
  } catch (err) {
      console.error("Errore durante l'aggiornamento del post:", err);
      res.status(500).json({ error: 'Si è verificato un errore durante l\'aggiornamento del post.' });
  }
};

const destroy = async (req, res) => {
    const { slug } = req.params;
    try {
        await prisma.post.delete({
            where: { slug },
        });
        res.json(`Post ${slug} eliminato con successo`);
    } catch (err) {
        res.status(500).json({ error: 'Si è verificato un errore durante l\'eliminazione del post.' });
    }
};

module.exports = {
    create,
    index,
    showBySlug,
    update,
    destroy
};
