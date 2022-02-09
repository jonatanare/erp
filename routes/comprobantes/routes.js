const express = require('express')
const router = express.Router()
const { verifyToken, isAdmin } = require('../auth/auth')
const { Comprobantes } = require('../../models/comprobantes')
const { CondicionesFiscales } = require('../../models/condiciones_fiscales')
const { db, getUpdateObject } = require('../../config/database')

router.route('/tipo/:tipo').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { tipo } = req.params
        
        let list =  await Comprobantes.findAll({
            where: { tipo: tipo },
            include: [
                {
                    model: CondicionesFiscales, as: "Condicion"
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

        let perfil = await Comprobantes.findOne({
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
            res.status(404).send('Condicion fiscal no encontrada.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').delete(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await Comprobantes.findOne({
            where: {id: id}
        })

        if(result){
            db.sequelize.query("delete from comprobantes where id = $1", { bind: [id] })
            res.status(200).send({'message': 'Comprobante borrado'})
        }else{
            res.status(404).send('Comprobante no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').put(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        let result = await Comprobantes.findOne({
            where: {id: id}
        })

        if(result){
            await result.update(getUpdateObject(Comprobantes, data, ["id"]))
            res.send(result)
        }else{
            res.status(404).send('Comprobante no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const data = req.body

        let result = await Comprobantes.findOne({
            where: {taxid: data.taxid}
        })

        if(!result){
            const nuevo = await Comprobantes.create(data)
            res.send(nuevo)
        }else{
            res.status(409).send('Comprobante existente.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router