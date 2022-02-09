const express = require('express')
const router = express.Router()
const { verifyToken, isAdmin } = require('../auth/auth')
const { Perfiles } = require('../../models/perfiles')
const { db, getUpdateObject } = require('../../config/database')

router.route('/').get(verifyToken, isAdmin, async (req, res) => {
    try{
        let list =  await Perfiles.findAll()

        res.send(list);
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let perfil = await Perfiles.findOne({
            where: {id: id}
        })

        if(perfil){
            res.send(perfil);
        }else{
            res.status(404).send('Perfil no encontrado.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').delete(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await Perfiles.findOne({
            where: {id: id}
        })

        if(result){
            db.sequelize.query("delete from perfiles where id = $1", { bind: [id] })
            res.status(200).send({'message': 'Perfil borrado'});
        }else{
            res.status(404).send('Perfil no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').put(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        let perfil = await Perfiles.findOne({
            where: {id: id}
        })

        if(perfil){
            await perfil.update(getUpdateObject(Perfiles, data, ["id"]))
            res.send(perfil)
        }else{
            res.status(404).send('Perfil no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const data = req.body

        let perfil = await Perfiles.findOne({
            where: {perfil: data.perfil}
        })

        if(!perfil){
            const nuevo = await Perfiles.create(data)
            res.send(nuevo)
        }else{
            res.status(409).send('Perfil existente.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router