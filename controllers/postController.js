const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const uniqueSlug = require("../middlewares/uniqueSlug.js");

const create = async (req, res) => {
    const { title, slug, content, published, categoriesId, tagsId, image, userId } = req.body;

    try {
        // Genera uno slug univoco se non viene fornito
        const generatedSlug = slug || await uniqueSlug(title);

        const post = await prisma.post.create({
            data: {
                title,
                slug: generatedSlug,
                content,
                published,
                categoriesId,
                image,
                authorId: userId, 
                tags: {
                    connect: Array.isArray(tagsId) ? tagsId.map(id => ({ id })) : []
                }
            },
            include: {
                tags: true,
                category: true, 
                author: true, 
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
                category: true, 
                author: true, 
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
                category: true, 
                author: true,
            }
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Si è verificato un errore durante il recupero dei post.' });
    }
};

const update = async (req, res, next) => {
    const { slug } = req.params;
    const { title, content, published, tags, categoriesId, image, userId } = req.body;

    console.log('Request params:', req.params);
    console.log('Request body:', req.body);

    try {
        const post = await prisma.post.findUnique({
            where: { slug: slug }
        });

        if (!post) {
            console.log('Post not found with slug:', slug);
            throw new RestError('Post not found', 404);
        }

        console.log('Current post data:', post);

        const updatedPost = await prisma.post.update({
            where: { slug: slug },
            data: {
                title,
                content,
                published,
                categoriesId,
                image,
                authorId: userId, 
                tags: {
                    set: tags ? tags.map(tagId => ({ id: tagId })) : [], 
                }
            },
            include: { tags: true, category: true, author: true }
        });

        console.log('Updated post data:', updatedPost);

        res.json(updatedPost);
    } catch (err) {
        console.error('Error updating post:', err);
        next(err);
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
