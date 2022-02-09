const express = require('express')
const router = express.Router()
const { verifyToken, isAdmin } = require('../auth/auth')
const { CondicionesFiscales } = require('../../models/condiciones_fiscales')
const { db, getUpdateObject } = require('../../config/database')

router.route('/').get(verifyToken, isAdmin, async (req, res) => {
    try{
        let result =  await CondicionesFiscales.findAll()

        res.send(result);
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await CondicionesFiscales.findOne({
            where: {id: id}
        })

        if(result){
            res.send(result);
        }else{
            res.status(404).send('Condicion no encontrada.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').delete(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await CondicionesFiscales.findOne({
            where: {id: id}
        })

        if(result){
            db.sequelize.query("delete from condiciones_fiscales where id = $1", { bind: [id] })
            res.status(200).send({'message': 'Condicion borrada'});
        }else{
            res.status(404).send('Condicion no encontrada.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').put(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        let result = await CondicionesFiscales.findOne({
            where: {id: id}
        })

        if(result){
            await result.update(getUpdateObject(CondicionesFiscales, data, ["id"]))
            res.send(result)
        }else{
            res.status(404).send('Condicion no encontrada.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const data = req.body

        let result = await CondicionesFiscales.findOne({
            where: {condicion: data.condicion}
        })

        if(!result){
            const nuevo = await CondicionesFiscales.create(data)
            res.send(nuevo)
        }else{
            res.status(409).send('Condicion existente.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router