const express = require('express')
const router = express.Router()
const { verifyToken, isAdmin } = require('../auth/auth')
const { Telefonos } = require('../../models/telefonos')
const { db, getUpdateObject } = require('../../config/database')

router.route('/').get(verifyToken, isAdmin, async (req, res) => {
    try{
        let list =  await Telefonos.findAll()
        res.send(list)
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await Telefonos.findOne({
            where: {id: id}
        })

        if(result){
            res.send(result);
        }else{
            res.status(404).send('Telefono no encontrado.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').delete(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await Telefonos.findOne({
            where: {id: id}
        })

        if(result){
            db.sequelize.query("delete from telefonos where id = $1", { bind: [id] })
            res.status(200).send({'message': 'Teléfono borrado'})
        }else{
            res.status(404).send('Teléfono no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').put(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        let tel = await Telefonos.findOne({
            where: {id: id}
        })

        if(tel){
            await tel.update(getUpdateObject(Telefonos, data, ["id"]))
            res.send(tel)
        }else{
            res.status(404).send('Telefonos no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const data = req.body

        let tel = await Telefonos.findOne({
            where: {numero: data.numero}
        })

        if(!tel){
            const nuevo = await Telefonos.create(data)
            res.send(nuevo)
        }else{
            res.status(409).send('Telefono existente.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router