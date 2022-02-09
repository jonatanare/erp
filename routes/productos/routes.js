const express = require('express')
const router = express.Router()
const { verifyToken, isAdmin } = require('../auth/auth')
const { Productos } = require('../../models/productos')
const { Proveedores } = require('../../models/proveedores')
const { Monedas } = require('../../models/monedas')
const { CategoriasProducto } = require('../../models/categorias_productos')
const { db, getUpdateObject } = require('../../config/database')

router.route('/empresa/:empresa').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa } = req.params

        let result =  await Productos.findAll({
            where: { empresa: empresa },
            include: [
                {
                    model: Proveedores, as: "Proveedor"
                },
                {
                    model: Monedas, as: "Moneda"
                },
                {
                    model: CategoriasProducto, as: "Categoria_Producto"
                }
            ]
        })

        res.send(result);
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/empresa/:empresa/:codigo').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa, codigo } = req.params

        let result = await Productos.findOne({
            where: {
                empresa: empresa,
                codigo: codigo
            },
            include: [
                {
                    model: Proveedores, as: "Proveedor"
                },
                {
                    model: Monedas, as: "Moneda"
                },
                {
                    model: CategoriasProducto, as: "Categoria_Producto"
                }
            ]
        })

        if(result){
            res.send(result);
        }else{
            res.status(404).send('Producto no encontrado.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').delete(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await Productos.findOne({
            where: {id: id}
        })

        if(result){
            db.sequelize.query("delete from productos where id = $1", { bind: [id] })
            res.status(200).send({'message': 'Producto borrado'})
        }else{
            res.status(404).send('Producto no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').put(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        let prod = await Productos.findOne({
            where: {id: id}
        })

        if(prod){
            await prod.update(getUpdateObject(Productos, data, ["id"]))
            res.send(prod)
        }else{
            res.status(404).send('Producto no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/empresa/:empresa').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa } = req.params
        const data = req.body

        console.log(empresa)
        console.log(data)


        let producto = await Productos.findOne({
            where: {
                empresa: empresa,
                codigo: data.codigo
            }
        })

        if(!producto){
            const nuevo = await Productos.create(data)
            res.send(nuevo)
        }else{
            res.status(409).send('Producto existente.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router