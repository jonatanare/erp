const express = require('express')
const router = express.Router()
const { verifyToken, isAdmin } = require('../auth/auth')
const { Clientes } = require('../../models/clientes')
const { Movimientos } = require('../../models/movimientos')
const { CondicionesFiscales } = require('../../models/condiciones_fiscales')
const { db, getUpdateObject } = require('../../config/database')

router.route('/empresa/:empresa').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa } = req.params

        let result =  await Clientes.findAll({
            where: {
                empresa: empresa
            },
            include: [
                {
                    model: CondicionesFiscales, as: "Condicion"
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

        let perfil = await Clientes.findOne({
            where: {id: id},
            include: [
                {
                    model: CondicionesFiscales, as: "Condicion"
                }
            ]
        })

        if(perfil){
            res.send(perfil);
        }else{
            res.status(404).send('Cliente no encontrado.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').delete(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let cliente = await Clientes.findOne({
            where: {id: id}
        })

        if(cliente){
            let movimientos = await Movimientos.findAll({
                where: {
                    cliente: id
                }
            })

            if(movimientos.length == 0){
                let rta = db.sequelize.query("delete from clientes where id = $1", { bind: [id] })
                res.status(200).send({'message': 'Cliente borrado'})
            }else{
                res.status(500).send({'message': 'El cliente tiene movimientos asociados.'})
            }
            
        }else{
            res.status(404).send('Cliente no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').put(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        let result = await Clientes.findOne({
            where: {id: id}
        })

        if(result){
            await result.update(getUpdateObject(Clientes, data, ["id"]))
            res.send(result)
        }else{
            res.status(404).send('Cliente no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/empresa/:empresa').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa } = req.params
        const data = req.body

        let result = await Clientes.findOne({
            where: {
                empresa: empresa,
                taxid: data.taxid
            }
        })

        if(!result){
            const nuevo = await Clientes.create(data)
            res.send(nuevo)
        }else{
            res.status(409).send('Cliente existente.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router