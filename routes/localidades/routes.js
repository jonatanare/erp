const express = require('express')
const router = express.Router()
const { verifyToken, isAdmin } = require('../auth/auth')
const { Localidades } = require('../../models/localidades')
const { Provincias } = require('../../models/provincias')
const { db, getUpdateObject } = require('../../config/database')

router.route('/').get(verifyToken, isAdmin, async (req, res) => {
    try{
        let list =  await Localidades.findAll({
            include: [
                {
                    model: Provincias, as: "Provincia"
                }
            ]
        })
        res.send(list)
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/localidad/:id').get(verifyToken, isAdmin, async (req, res) => {
    const { id } = req.params

    let result =  await Localidades.findOne({
        where: { id: id }
    })

    if(result){
        res.send(result);
    }else{
        res.status(404).send('Localidad no encontrada.')
    }
    
})

router.route('/:provincia').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { provincia } = req.params

        let result = await Localidades.findAll({
            include: [
                {
                    model: Provincias, as: "Provincia"
                }
            ],
            where: {provincia: provincia}
        })

        if(result){
            res.send(result);
        }else{
            res.status(404).send('Localidad no encontrada.')
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
            db.sequelize.query("delete from localidades where id = $1", { bind: [id] })
            res.status(200).send({'message': 'Localidad borrado'})
        }else{
            res.status(404).send('Localidad no encontrada.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').put(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        let localidad = await Localidades.findOne({
            where: {id: id}
        })

        if(localidad){
            await localidad.update(getUpdateObject(Localidades, data, ["id"]))
            res.send(localidad)
        }else{
            res.status(404).send('Localidad no encontrada.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const data = req.body

        let localidad = await Localidades.findOne({
            where: {localidad: data.localidad}
        })

        if(!localidad){
            const nueva = await Localidades.create(data)
            res.send(nueva)
        }else{
            res.status(409).send('Localidad existente.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router