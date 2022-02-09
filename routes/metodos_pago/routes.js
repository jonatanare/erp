const express = require('express')
const router = express.Router()
const { verifyToken, isAdmin } = require('../auth/auth')
const { MetodosPago } = require('../../models/metodos_pago')
const { db, getUpdateObject } = require('../../config/database')

router.route('/').get(verifyToken, isAdmin, async (req, res) => {
    try{
        let list =  await MetodosPago.findAll()
        res.send(list)
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await MetodosPago.findOne({
            where: {id: id}
        })

        if(result){
            res.send(result);
        }else{
            res.status(404).send('Metodo de Pago no encontrado.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').delete(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await MetodosPago.findOne({
            where: {id: id}
        })

        if(result){
            db.sequelize.query("delete from metodos_pago where id = $1", { bind: [id] })
            res.status(200).send({'message': 'Metodo de Pago borrado'});
        }else{
            res.status(404).send('Metodo de Pago no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').put(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        let metodo = await MetodosPago.findOne({
            where: {id: id}
        })

        if(metodo){
            await metodo.update(getUpdateObject(MetodosPago, data, ["id"]))
            res.send(metodo)
        }else{
            res.status(404).send('Metodo de Pago no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const data = req.body

        let metodo = await MetodosPago.findOne({
            where: {descripcion: data.descripcion}
        })

        if(!metodo){
            const nueva = await MetodosPago.create(data)
            res.send(nueva)
        }else{
            res.status(409).send('Metodo de Pago existente.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router