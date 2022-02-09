const express = require('express')
const router = express.Router()
const { verifyToken, isAdmin } = require('../auth/auth')
const { Provincias } = require('../../models/provincias')
const { db, getUpdateObject } = require('../../config/database')

router.route('/').get(verifyToken, isAdmin, async (req, res) => {
    try{
        let list =  await Provincias.findAll()
        res.send(list)
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await Provincias.findOne({
            where: {id: id}
        })

        if(result){
            res.send(result);
        }else{
            res.status(404).send('Provincia no encontrada.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').delete(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await Provincias.findOne({
            where: {id: id}
        })

        if(result){
            db.sequelize.query("delete from provincias where id = $1", { bind: [id] })
            res.status(200).send({'message': 'Provincia borrado'})
        }else{
            res.status(404).send('Provincia no encontrada.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').put(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        let prov = await Provincias.findOne({
            where: {id: id}
        })

        if(prov){
            await prov.update(getUpdateObject(Provincias, data, ["id"]))
            res.send(prov)
        }else{
            res.status(404).send('Provincia no encontrada.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const data = req.body

        let prov = await Provincias.findOne({
            where: {provincia: data.provincia}
        })

        if(!prov){
            const nueva = await Provincias.create(data)
            res.send(nueva)
        }else{
            res.status(409).send('Provincia existente.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router