const express = require('express')
const router = express.Router()
const { verifyToken, isAdmin } = require('../auth/auth')
const { Cuentas } = require('../../models/cuentas')
const { TiposCuenta } = require('../../models/tipos_cuenta')
const { CategoriasCuenta } = require('../../models/categorias_cuenta')
const { db, getUpdateObject } = require('../../config/database')

router.route('/').get(verifyToken, isAdmin, async (req, res) => {
    try{
        let result =  await Cuentas.findAll({
            include: [
                {
                    model: TiposCuenta, as: "Tipo"
                },
                {
                    model: CategoriasCuenta, as: "Categoria"
                }
            ]
        })
        res.send(result);
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await Cuentas.findOne({
            where: {id: id},
            include: [
                {
                    model: TiposCuenta, as: "Tipos_Cuentas"
                },
                {
                    model: CategoriasCuenta, as: "Categorias_Cuenta"
                }
            ]
        })

        if(result){
            res.send(result)
        }else{
            res.status(404).send('Cuenta no encontrada.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').delete(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await Cuentas.findOne({
            where: {id: id}
        })

        if(result){
            db.sequelize.query("delete from cuentas where id = $1", { bind: [id] })
            res.status(200).send({'message': 'Cuenta borrada'})
        }else{
            res.status(404).send('Cuenta no encontrada.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').put(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        let result = await Cuentas.findOne({
            where: {id: id}
        })

        if(result){
            await result.update(getUpdateObject(Cuentas, data, ["id"]))
            res.send(result)
        }else{
            res.status(404).send('Cuenta no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const data = req.body

        let result = await Cuentas.findOne({
            where: {codigo: data.codigo}
        })

        if(!result){
            const nuevo = await Cuentas.create(data)
            res.send(nuevo)
        }else{
            res.status(409).send('Cuenta existente.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router