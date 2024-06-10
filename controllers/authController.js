const { PrismaClient } = require("@prisma/client");
const errorHandler = require("../middlewares/errorHandler.js");
const RestError = require('../middlewares/restError.js');
const generateToken = require("../utils/generateToken.js");
const { hashPassword, comparePassword } = require("../utils/password.js");
const deleteProfilePic = require("../utils/deleteProfilePic.js");
const prisma = new PrismaClient();
require("dotenv").config();
const {PORT, HOST} = process.env;
const port = PORT || 3000;

const register = async (req, res) => {
    try{
        const {email, name, password} = req.body;

        const data = {
            email,
            name,
            password: await hashPassword(password),
        }
        if(req.file){
            data.img_path = `${HOST}:${PORT}/profile_pics/${req.file.filename}`;
        }

        const user = await prisma.user.create({data});

        const token = generateToken({
            email: user.email,
            name: user.name
        })
        delete user.id;
        delete user.password;

        res.json({token, data:user});
    }catch (err) {
        if(req.file){
            deleteProfilePic(req.file.filename);
        }
        errorHandler(err, req,res)
    }
    
}

const login = async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await prisma.user.findUnique({
            where: {email}
        });

        const err = new RestError(`Email o password errati`, 400);

        if(!user){
            throw err
        }
        const passwordOk = await comparePassword (password, user.password);
        if(!passwordOk){
            throw err
        }

        const token = generateToken({
            email: user.email,
            name: user.name
        });
        delete user.id;
        delete user.password;

        res.json({token, data: user})
    }catch (error){
        errorHandler(error, req, res)
    }
}

module.exports = {
    register,
    login
}