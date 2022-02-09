const express = require('express')
const router = express.Router()
const { verifyToken, isAdmin } = require('../auth/auth')
const { Caja } = require('../../models/caja')
const { Usuarios } = require('../../models/usuarios')
const { Movimientos } = require('../../models/movimientos')
const { db, getUpdateObject } = require('../../config/database')
const { Op } = require("sequelize");
const { Comprobantes } = require('../../models/comprobantes')

router.route('/empresa/:empresa').get(verifyToken, isAdmin, async (req, res) => {
    try{

        const { empresa } = req.params

        let result =  await Caja.findAll({
            where: {
                empresa: empresa
            },
            include: [
                {
                    model: Usuarios, as: "Usuario"
                }
            ]
        })
        res.send(result)
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:usuario').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { usuario } = req.params

        let result = await Caja.findAll({
            where: {usuario: usuario},
            include: [
                {
                    model: Usuarios, as: "Usuario"
                }
            ]
        })

        if(result){
            res.send(result);
        }else{
            res.status(404).send('Moneda no encontrada.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:fecha/:usuario').get(verifyToken, isAdmin, async (req, res) => {
    const { fecha, usuario } = req.params

    let result = await Caja.findAll({
        where:{
            [Op.and]: [
                db.sequelize.where(db.sequelize.fn("date", db.sequelize.col("fechaInicio")), "=", fecha.substr(0,10)),
                {
                    usuario: usuario
                }
            ]
        },
        include: [
            {
                model: Usuarios, as: "Usuario"
            }
        ]
    })

    res.send(result);
})

router.route('/search/saldo/:id').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let caja = await Caja.findOne({
            where: {id: id}
        })

        if(!caja){
            res.status(404).send('Caja no encontrada.')
        }

        let sql = `
                    select 
                    (
                        select
                        saldoInicial
                        from caja
                        where id = $1
                    )
                    +
                    (
                        select
                        COALESCE(sum(m.total),0) as total
                        from movimientos m
                        left join comprobantes c on c.id = m.comprobante
                        where m.caja = $1
                        and c.tipo in (1, 4, 6)
                        and m.metodo_pago = 1
                    )
                    -
                    (
                        select
                        COALESCE(sum(m.total),0) as total
                        from movimientos m
                        left join comprobantes c on c.id = m.comprobante
                        where m.caja = $1
                        and c.tipo in (2, 3, 5)
                        and m.metodo_pago = 1
                    ) as saldo
            `

        let result = await db.sequelize.query(sql, { bind: [id] })
        
                      console.log(result[0][0])  

        res.status(200).send(result[0][0]);
          
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

router.route('/:id').delete(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let result = await Caja.findOne({
            where: {id: id}
        })

        if(result){
            db.sequelize.query("delete from caja where id = $1", { bind: [id] })
            res.status(200).send({'message': 'Caja borrada'});
        }else{
            res.status(404).send('Caja no encontrada.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').put(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        let caja = await Caja.findOne({
            where: {id: id}
        })

        if(caja){
            await caja.update(getUpdateObject(Caja, data, ["id"]))
            res.send(caja)
        }else{
            res.status(404).send('Caja no encontrada.')
        }
          
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

router.route('/').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const data = req.body

        let caja = await Caja.findOne({
            where: {
                [Op.and]: [
                    { usuario: data.usuario },
                    { estado: 1 }
                  ]
            }
        })

        if(!caja){
            const nueva = await Caja.create(data)
            res.send(nueva)
        }else{
            res.status(409).send('Existe una caja abierta.')
        }
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

router.route('/arqueo').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const data = req.body

        let caja = await Caja.findOne({
            where: [
                { id: data.caja }
            ]
        })

        if(!caja){
            res.status(404).send('No existe la caja.')
        }

        let sql
        
        if(data.metodo == 1){
            sql = `
                select
                COALESCE(sum(m.total),0) as total
                from movimientos m
                left join comprobantes c on c.id = m.comprobante
                where c.tipo = $1
                and m.caja = $2
                and m.metodo_pago = 1
            `
        }else{
            sql = `
                select
                    COALESCE(sum(m.total),0) as total
                from movimientos m
                left join comprobantes c on c.id = m.comprobante
                where c.tipo = $1
                and m.caja = $2
                and m.metodo_pago <> 1
            `
        }
        

        let result = await db.sequelize.query(sql, { bind: [data.tipo, data.caja] })

        res.status(200).send(result[0][0])

    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

module.exports = router