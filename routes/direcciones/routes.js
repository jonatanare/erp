const express = require('express')
const router = express.Router()
const { verifyToken, isAdmin } = require('../auth/auth')
const { Direcciones } = require('../../models/direcciones')
const { Localidades } = require('../../models/localidades')
const { Provincias } = require('../../models/provincias')
const { db, getUpdateObject } = require('../../config/database')

router.route('/').get(verifyToken, isAdmin, async (req, res) => {
    try{
        let list =  await Direcciones.findAll({
            include: [
                {
                    model: Localidades,
                    as: "Localidad",
                    include: [
                        {
                            model: Provincias,
                            as: "Provincia"
                        }
                    ]
                }
            ]
        })
        res.send(list)
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await Direcciones.findOne({
            where: {id: id},
            include: [
                {
                    model: Localidades,
                    as: "Localidad",
                    include: [
                        {
                            model: Provincias,
                            as: "Provincia"
                        }
                    ]
                }
            ]
        })

        if(result){
            res.send(result);
        }else{
            res.status(404).send('Dirección no encontrada.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').delete(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await Direcciones.findOne({
            where: {id: id}
        })

        if(result){
            db.sequelize.query("delete from direcciones where id = $1", { bind: [id] })
            res.status(200).send({'message': 'Dirección borrado'})
        }else{
            res.status(404).send('Dirección no encontrada.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').put(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        let dir = await Direcciones.findOne({
            where: {id: id}
        })

        if(dir){
            await dir.update(getUpdateObject(Direcciones, data, ["id"]))
            res.send(dir)
        }else{
            res.status(404).send('Dirección no encontrada.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const data = req.body
        const nuevoDir = await Direcciones.create(data)
        res.send(nuevoDir)
          
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router