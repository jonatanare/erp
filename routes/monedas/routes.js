const express = require('express')
const router = express.Router()
const { verifyToken, isAdmin } = require('../auth/auth')
const { Monedas } = require('../../models/monedas')
const { db, getUpdateObject } = require('../../config/database')

router.route('/').get(verifyToken, isAdmin, async (req, res) => {
    try{
        let list =  await Monedas.findAll()
        res.send(list)
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await Monedas.findOne({
            where: {id: id}
        })

        if(result){
            res.send(result);
        }else{
            res.status(404).send('Moneda no encontrada.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').delete(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await Monedas.findOne({
            where: {id: id}
        })

        if(result){
            db.sequelize.query("delete from monedas where id = $1", { bind: [id] })
            res.status(200).send({'message': 'Moneda borrado'});
        }else{
            res.status(404).send('Moneda no encontrada.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').put(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        let moneda = await Monedas.findOne({
            where: {id: id}
        })

        if(moneda){
            await moneda.update(getUpdateObject(Monedas, data, ["id"]))
            res.send(moneda)
        }else{
            res.status(404).send('Moneda no encontrada.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const data = req.body

        let moneda = await Monedas.findOne({
            where: {moneda: data.moneda}
        })

        if(!moneda){
            const nueva = await Monedas.create(data)
            res.send(nueva)
        }else{
            res.status(409).send('Moneda existente.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router