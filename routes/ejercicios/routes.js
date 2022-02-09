const express = require('express')
const router = express.Router()
const { verifyToken, isAdmin } = require('../auth/auth')
const { Ejercicios } = require('../../models/ejercicios')
const { EstadosEjercicio } = require('../../models/estados_ejercicio')
const { db, getUpdateObject } = require('../../config/database')

router.route('/').get(verifyToken, isAdmin, async (req, res) => {
    try{
        let result =  await Ejercicios.findAll({
            include: [
                {
                    model: EstadosEjercicio, as: "Estado"
                }
            ]
        })
        res.send(result)
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await Ejercicios.findOne({
            where: {id: id},
            include: [
                {
                    model: EstadosEjercicio, as: "Estado"
                }
            ]
        })

        if(result){
            res.send(result);
        }else{
            res.status(404).send('Ejercicio no encontrado.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').delete(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await Ejercicios.findOne({
            where: {id: id}
        })

        if(result){
            db.sequelize.query("delete from ejercicios where id = $1", { bind: [id] })
            res.status(200).send({'message': 'Ejercicio borrado'})
        }else{
            res.status(404).send('Ejercicio no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').put(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        let result = await Ejercicios.findOne({
            where: {id: id}
        })

        if(result){
            await result.update(getUpdateObject(Ejercicios, data, ["id"]))
            res.send(result)
        }else{
            res.status(404).send('Ejercicio no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const data = req.body

        let result = await Ejercicios.findOne({
            where: {inicio: data.inicio}
        })

        if(!result){
            const nuevo = await Ejercicios.create(data)
            res.send(nuevo)
        }else{
            res.status(409).send('Ejercicio existente.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router