const express = require('express')
const router = express.Router()
const { verifyToken, isAdmin } = require('../auth/auth')
const { Productos } = require('../../models/productos')
const { db, getUpdateObject } = require('../../config/database')
const { MovimientosDetalle } = require('../../models/movimientos_detalle')
const { Comprobantes } = require('../../models/comprobantes')


router.route('/').get(verifyToken, isAdmin, async (req, res) => {
    try{
        let list =  await MovimientosDetalle.findAll({
            include: [
                {
                    model: Productos, as: "Producto"
                }
            ]
        })            
        res.send(list);
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await MovimientosDetalle.findAll({
            where: {movimiento: id},
            include: [
                {
                    model: Productos, as: "Producto"
                }
            ]
        })

        if(result){
            res.send(result);
        }else{
            res.status(404).send('Detalle no encontrado.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').delete(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await MovimientosDetalle.findOne({
            where: {id: id}
        })

        if(result){
            db.sequelize.query("delete from movimientos_detalle where id = $1", { bind: [id] })
           
            res.status(200).send({'message': 'Detalle borrado'});

        }else{
            res.status(404).send('Detalle no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').put(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        let result = await MovimientosDetalle.findOne({
            where: {id: id}
        })

        if(result){
            await result.update(getUpdateObject(MovimientosDetalle, data, ["id"]))
            res.send(result)
        }else{
            res.status(404).send('Detalle no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const data = req.body
        const nuevo = await MovimientosDetalle.create(data)

        let producto = await Productos.findOne({
            where: {id: data.producto}
        })

        let comprobante = await Comprobantes.findOne({
            where: db.sequelize.literal('id = (select comprobante from movimientos where id = '+data.movimiento+')')
        })

        console.log(comprobante);
        
        if(comprobante.tipo==2){
            let precioF = data.precioUnitario + data.precioUnitario * producto.por_gan /100 + data.precioUnitario * producto.iva /100
        
            await Productos.update(
                {
                    precio_unitario: data.precioUnitario,
                    precio_final:  precioF,
                    stock: producto.stock + data.cantidad
                },
                {
                    where: {
                        id: data.producto
                    }
                }
            )
            
        } else{
            await Productos.update(
                {
                    stock: producto.stock - data.cantidad
                },
                {
                    where: {
                        id: data.producto
                    }
                }
            )
            
        }

        

        

        res.send(nuevo)
                
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

module.exports = router
