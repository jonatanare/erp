const express = require('express')
const router = express.Router()
const { verifyToken, isAdmin } = require('../auth/auth')
const { Proveedores } = require('../../models/proveedores')
const { Movimientos } = require('../../models/movimientos')
const { db, getUpdateObject } = require('../../config/database')

router.route('/empresa/:empresa').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa } = req.params
        
        let result =  await Proveedores.findAll({
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

        let result = await Proveedores.findOne({
            where: {id: id}
        })

        if(result){
            res.send(result);
        }else{
            res.status(404).send('Proveedor no encontrado.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').delete(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let proveedor = await Proveedores.findOne({
            where: {id: id}
        })

        if(proveedor){
            let movimientos = await Movimientos.findAll({
                where: {
                    proveedor: id
                }
            })

            if(movimientos.length == 0){
                db.sequelize.query("delete from proveedores where id = $1", { bind: [id] })
                res.status(200).send({'message': 'Proveedor borrado'})
            }else{
                res.status(500).send({'message': 'El proveedor tiene movimientos asociados.'})
            }
        }else{
            res.status(404).send('Proveedor no encontrado.')
        }
          
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

router.route('/:id').put(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        let result = await Proveedores.findOne({
            where: {id: id}
        })

        if(result){
            await result.update(getUpdateObject(Proveedores, data, ["id"]))
            res.send(result)
        }else{
            res.status(404).send('Proveedor no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/empresa/:empresa').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa } = req.params
        const data = req.body

        let result = await Proveedores.findOne({
            where: {
                empresa: empresa,
                cuit: data.cuit
                
            }
        })

        if(!result){
            const nuevo = await Proveedores.create(data)
            res.send(nuevo)
        }else{
            res.status(409).send('Proveedor existente.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router