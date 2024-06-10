const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const errorHandler = require('../middlewares/errorHandler.js');
const RestError = require('../middlewares/restError.js');

const create = async (req, res) => {
    const {name} = req.body;

    const data = {name};
    try{
        const category = await prisma.categories.create({data});
        res.status(200).send(category);
    }catch(err){
        errorHandler(err, req, res);
    }
}

const index = async (req, res) => {
    try{
        const categories = await prisma.categories.findMany();
        res.json(categories);
    }catch(err){
        errorHandler(err, req, res);
    }
}

const show = async(req, res) => {
    try{
        const id = parseInt(req.params.id);
        const category = await prisma.categories.findUnique({
            where: {id}
        });
        if(category) {
            res.json(category);
        }else{
            throw new RestError (`categoria con id ${id}, non trovata.`, 404);
        }
    }catch(err){
        errorHandler(err, req, res)
    }
}

const update = async (req, res) => {
    try{
        const id = parseInt(req.params.id);
        const category = await prisma.category.update({
            where: {id},
            data: req.body
        })
        res.json(category)
    }catch(err){
        errorHandler(err, req, res);
    }
}

const destroy = async(req, res) => {
    try{
        const id = parseInt(req.params.id);
        await prisma.categories.delete({
            where: {id}
        })
        res.json(`categoria con ${id} eliminata con successo`)
    }catch ( err){
        errorHandler(err, req, res);
    }
}

module.exports = {
    create,
    index,
    show,
    update,
    destroy
}