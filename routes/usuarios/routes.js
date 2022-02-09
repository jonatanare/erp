const express = require('express')
const router = express.Router()
const { verifyToken, isAdmin } = require('../auth/auth')
const { Usuarios } = require('../../models/usuarios')
const { Perfiles } = require('../../models/perfiles')
const { Empresas } = require('../../models/empresas')
const { db, getUpdateObject } = require('../../config/database')
const path = require('path')
const multer = require('multer')


router.route('/empresa/:empresa').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa } = req.params

        let list =  await Usuarios.findAll({
            where: {
                empresa: empresa
            },
            include: [
                {
                    model: Perfiles, as: "Perfil"
                },
                {
                    model: Empresas, as: "Empresa"
                }
            ]
        })

        res.send(list);
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

router.route('/:id').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await Usuarios.findOne({
            where: {id: id},
            include: [
                {
                    model: Perfiles, as: "Perfil"
                },
                {
                    model: Empresas, as: "Empresa"
                }
            ]
        })

        if(result){
            res.send(result);
        }else{
            res.status(404).send('Usuario no encontrado.')
        }
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

router.route('/:id').delete(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await Usuarios.findOne({
            where: {id: id}
        })

        if(result){
            db.sequelize.query("delete from usuarios where id = $1", { bind: [id] })
           
            res.status(200).send({'message': 'Usuario borrado'});

        }else{
            res.status(404).send('Usuario no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').put(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        let usuario = await Usuarios.findOne({
            where: {id: id}
        })

        if(usuario){
            await usuario.update(getUpdateObject(Usuarios, data, ["id"]))
            res.send(usuario)
        }else{
            res.status(404).send('Usuario no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const data = req.body

        let usuario = await Usuarios.findOne({
            where: {email: data.email}
        })

        if(!usuario){
            const nuevo = await Usuarios.create(data)
            res.send(nuevo)
        }else{
            res.status(409).send('Usuario existente.')
        }
          
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

var storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './files/')
    },
    filename: (req, file, cb)=>{
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

router.post('/upload', upload.single('file'), async (req, res) => {
    
    console.log(req.body)
    console.log(req.file.path)
    
    let usuario = await Usuarios.findOne({
        where: {id: req.body.usuario}
    })

    var fullUrl = req.protocol + '://' + req.get('host')+ '/' + req.file.path

    let data = {
        avatar: fullUrl.replace('\\','/')
    }

    if(usuario){
        await usuario.update(getUpdateObject(Usuarios, data, ["id"]))
        res.send(usuario)
    }else{
        res.status(404).send('Usuario no encontrado.')
    }


})

module.exports = router
