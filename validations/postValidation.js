const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const postData = {
    title: {
        in: ["body"],
        notEmpty: {
            errorMessage: 'Title è un campo obbligatorio.',
            bail: true
        },
        isString: {
            errorMessage: 'Title deve essere una stringa.',
            bail: true
        },
        isLength: {
            errorMessage: 'Title deve essere di almeno 9 caratteri',
            options: { min: 9 }
        }
    },
    slug: {
        in: ["body"],
        notEmpty: {
            errorMessage: 'Slug è un campo obbligatorio.',
            bail: true
        },
        isString: {
            errorMessage: 'Slug deve essere una stringa.',
            bail: true
        },
        isLength: {
            errorMessage: 'Slug deve essere di almeno 3 caratteri',
            options: { min: 3 }
        }
    },
    content: {
        in: ["body"],
        notEmpty: {
            errorMessage: 'Content è un campo obbligatorio.',
            bail: true
        },
        isString: {
            errorMessage: 'Content deve essere una stringa.',
            bail: true
        }
    },
    published: {
        in: ["body"],
        isBoolean: {
            errorMessage: 'Published deve essere un booleano.',
            bail: true
        }
    },
    categoriesId: {
        in: ["body"],
        optional: true,
        isInt: {
            errorMessage: 'categoriesId deve essere un numero intero.',
            bail: true
        },
        custom: {
            options: async (value) => {
                const category = await prisma.categories.findUnique({
                    where: { id: value }
                });
                if (!category) {
                    throw new Error(`Non esiste una categoria con id ${value}`);
                }
                return true;
            }
        }
    },
    tagId: {
        in: ["body"],
        optional: true,
        isInt: {
            errorMessage: 'tagId deve essere un numero intero.',
            bail: true
        },
        custom: {
            options: async (value) => {
                const tag = await prisma.tag.findUnique({
                    where: { id: value }
                });
                if (!tag) {
                    throw new Error(`Non esiste un tag con id ${value}`);
                }
                return true;
            }
        }
    }
};

module.exports = { postData };
