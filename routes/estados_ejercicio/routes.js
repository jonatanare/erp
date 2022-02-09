const express = require('express')
const router = express.Router()
const { verifyToken, isAdmin } = require('../auth/auth')
const { EstadosEjercicio } = require('../../models/estados_ejercicio')
const { db, getUpdateObject } = require('../../config/database')

router.route('/').get(verifyToken, isAdmin, async (req, res) => {
    try{
        let result =  await EstadosEjercicio.findAll()
        res.send(result)
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await EstadosEjercicio.findOne({
            where: {id: id}
        })

        if(result){
            res.send(result);
        }else{
            res.status(404).send('Estado no encontrado.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').delete(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await EstadosEjercicio.findOne({
            where: {id: id}
        })

        if(result){
            db.sequelize.query("delete from estados_ejercicio where id = $1", { bind: [id] })
            res.status(200).send({'message': 'Estado borrado'})
        }else{
            res.status(404).send('Estado no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').put(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        let result = await EstadosEjercicio.findOne({
            where: {id: id}
        })

        if(result){
            await result.update(getUpdateObject(EstadosEjercicio, data, ["id"]))
            res.send(result)
        }else{
            res.status(404).send('Estado no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const data = req.body

        let result = await EstadosEjercicio.findOne({
            where: {estado: data.estado}
        })

        if(!result){
            const nuevo = await EstadosEjercicio.create(data)
            res.send(nuevo)
        }else{
            res.status(409).send('Estado existente.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router