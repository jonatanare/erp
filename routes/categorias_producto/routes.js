const express = require('express')
const router = express.Router()
const { verifyToken, isAdmin } = require('../auth/auth')
const { CategoriasProducto } = require('../../models/categorias_productos')
const { db, getUpdateObject } = require('../../config/database')

router.route('/').get(verifyToken, isAdmin, async (req, res) => {
    try{
        let result =  await CategoriasProducto.findAll()
        res.send(result);
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await CategoriasProducto.findOne({
            where: {id: id}
        })

        if(result){
            res.send(result);
        }else{
            res.status(404).send('Categoría no encontrada.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').delete(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await CategoriasProducto.findOne({
            where: {id: id}
        })

        if(result){
            db.sequelize.query("delete from categorias_producto where id = $1", { bind: [id] })
            res.status(200).send({'message': 'Categoria borrado'})
        }else{
            res.status(404).send('Categoria no encontrada.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').put(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        let result = await CategoriasProducto.findOne({
            where: {id: id}
        })

        if(result){
            await result.update(getUpdateObject(CategoriasProducto, data, ["id"]))
            res.send(result)
        }else{
            res.status(404).send('Categoria no encontrada.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const data = req.body

        let result = await CategoriasProducto.findOne({
            where: {categoria: data.categoria}
        })

        if(!result){
            const nuevo = await CategoriasProducto.create(data)
            res.send(nuevo)
        }else{
            res.status(409).send('Categoria existente.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router