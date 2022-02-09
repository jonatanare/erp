const express = require('express')
const router = express.Router()
const { verifyToken, isAdmin } = require('../auth/auth')
const { TiposCuenta } = require('../../models/tipos_cuenta')
const { db, getUpdateObject } = require('../../config/database')

router.route('/').get(verifyToken, isAdmin, async (req, res) => {
    try{
        let result =  await TiposCuenta.findAll()
        res.send(result);
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await TiposCuenta.findOne({
            where: {id: id}
        })

        if(result){
            res.send(result);
        }else{
            res.status(404).send('Tipo no encontrado.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').delete(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await TiposCuenta.findOne({
            where: {id: id}
        })

        if(result){
            db.sequelize.query("delete from tipos_cuenta where id = $1", { bind: [id] })
            res.status(200).send({'message': 'Tipo borrado'})
        }else{
            res.status(404).send('Tipo no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').put(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        let result = await TiposCuenta.findOne({
            where: {id: id}
        })

        if(result){
            await result.update(getUpdateObject(TiposCuenta, data, ["id"]))
            res.send(result)
        }else{
            res.status(404).send('Tipo no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const data = req.body

        let result = await TiposCuenta.findOne({
            where: {tipo: data.tipo}
        })

        if(!result){
            const nuevo = await TiposCuenta.create(data)
            res.send(nuevo)
        }else{
            res.status(409).send('Tipo existente.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router