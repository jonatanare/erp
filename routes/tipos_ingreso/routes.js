const express = require('express')
const router = express.Router()
const { verifyToken, isAdmin } = require('../auth/auth')
const { TiposIngreso } = require('../../models/tipos_ingreso')
const { db, getUpdateObject } = require('../../config/database')

router.route('/empresa/:empresa').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa } = req.params

        let result =  await TiposIngreso.findAll({
            where: {
                empresa: empresa
            },
        }
            
        )
        res.send(result);
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await TiposIngreso.findOne({
            where: {id: id}
        })

        if(result){
            res.send(result);
        }else{
            res.status(404).send('Tipo de ingreso no encontrado.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').delete(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await TiposIngreso.findOne({
            where: {id: id}
        })

        if(result){
            db.sequelize.query("delete from tipos_ingreso where id = $1", { bind: [id] })
            res.status(200).send({'message': 'Tipo de ingreso borrado'})
        }else{
            res.status(404).send('Tipo de ingreso no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').put(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        let result = await TiposIngreso.findOne({
            where: {id: id}
        })

        if(result){
            await result.update(getUpdateObject(TiposIngreso, data, ["id"]))
            res.send(result)
        }else{
            res.status(404).send('Tipo de ingreso no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/empresa/:empresa').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa } = req.params
        const data = req.body

        let result = await TiposIngreso.findOne({
            where: {
                empresa: empresa,
                descripcion: data.descripcion
            }
        })

        if(!result){
            const nuevo = await TiposIngreso.create(data)
            res.send(nuevo)
        }else{
            res.status(409).send('Tipo de ingreso existente.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router