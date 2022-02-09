const express = require('express')
const router = express.Router()
const { verifyToken, isAdmin } = require('../auth/auth')
const { Movimientos } = require('../../models/movimientos')
const { Proveedores } = require('../../models/proveedores')
const { Clientes } = require('../../models/clientes')
const { Comprobantes } = require('../../models/comprobantes')
const { Usuarios } = require('../../models/usuarios')
const { Caja } = require('../../models/caja')
const { db, getUpdateObject } = require('../../config/database')
const { Op } = require("sequelize");
const { MovimientosDetalle } = require('../../models/movimientos_detalle')
const { Productos } = require('../../models/productos')
const { MetodosPago } = require('../../models/metodos_pago')
const { TiposGasto } = require('../../models/tipos_gasto')
const { TiposIngreso } = require('../../models/tipos_ingreso')


router.route('/empresa/:empresa').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa } = req.params

        let result =  await Movimientos.findAll({
            where: {
                empresa: empresa
            },
            order: [
                ['id', 'DESC'],
            ],
            include: [
                {
                    model: Proveedores, as: "Proveedor"
                },
                {
                    model: Clientes, as: "Cliente"
                },
                {
                    model: Comprobantes, as: "Comprobante"
                },
                {
                    model: Usuarios, as: "Usuario"
                },
                {
                    model: Caja, as: "Caja"
                },
                {
                    model: TiposGasto, as: "Tipo_Gasto"
                }
            ]
        })            
        res.send(result);
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/empresa/:empresa/cliente/cc/:cliente').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa, cliente } = req.params

        let result =  await Movimientos.findAll({
            order: [
                ['id', 'DESC'],
            ],
            where: {
                [Op.and]: [
                    { empresa: empresa },
                    { cliente: cliente },
                    db.sequelize.literal('(comprobante = 10 or metodo_pago in (select id from metodos_pago where requiere_cliente = true))')                    
                ]
            },
            include: [
                {
                    model: Proveedores, as: "Proveedor"
                },
                {
                    model: Clientes, as: "Cliente"
                },
                {
                    model: Comprobantes, as: "Comprobante"
                },
                {
                    model: Usuarios, as: "Usuario"
                },
                {
                    model: Caja, as: "Caja"
                },
                {
                    model: TiposGasto, as: "Tipo_Gasto"
                },
                {
                    model: MetodosPago, as: "Metodos_Pago"
                }
            ]
        })            
        res.send(result);
    }catch(err){
        
        res.status(500).send(err)
    }
})

router.route('/empresa/:empresa/cliente/cc').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa } = req.params

        let result = await db.sequelize.query("select" +
                                              " m.cliente as id," + 
                                              " sum( case when c.tipo <> 4 then -1 * m.total else m.total end) as saldo," + 
                                              " CONCAT(cl.nombre , ', ' , cl.apellido) as cliente," +
                                              " cl.telefono" +
                                              " from movimientos as m " +
                                              " left join comprobantes c on c.id = m.comprobante" +
                                              " left join clientes as cl on m.cliente = cl.id" +
                                              " where m.empresa = " + empresa +
                                              " and m.cliente is not null" +
                                              " and (comprobante = 10 or m.metodo_pago in (select id from metodos_pago where requiere_cliente = true))" +
                                              " group by m.cliente")

        
        if(result){
            res.send(result[0]);
        }else{
            res.status(404).send('Movimiento no encontrado.')
        }
    }catch(err){
        
        res.status(500).send(err)
    }
})

router.route('/empresa/:empresa/proveedor/cc/:proveedor').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa, proveedor } = req.params

        let result =  await Movimientos.findAll({
            where: {
                [Op.and]: [
                    { empresa:  empresa },
                    { proveedor:  proveedor },
                    db.sequelize.literal('(comprobante = 13 or metodo_pago in (select id from metodos_pago where requiere_proveedor = true))')                    
                ]
            },
            order: [
                ['id', 'DESC'],
            ],
            include: [
                {
                    model: Proveedores, as: "Proveedor"
                },
                {
                    model: Clientes, as: "Cliente"
                },
                {
                    model: Comprobantes, as: "Comprobante"
                },
                {
                    model: Usuarios, as: "Usuario"
                },
                {
                    model: Caja, as: "Caja"
                },
                {
                    model: TiposGasto, as: "Tipo_Gasto"
                },
                {
                    model: MetodosPago, as: "Metodos_Pago"
                }
            ]
        })     
              
        res.send(result);

    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/empresa/:empresa/proveedor/cc').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa } = req.params

        let result = await db.sequelize.query("select" +
                                              " m.proveedor as id," + 
                                              " sum( case when c.tipo <> 5 then -1 * m.total else m.total end) as saldo," + 
                                              " p.razon_social as proveedor," +
                                              " p.telefono" +
                                              " from movimientos as m " +
                                              " left join comprobantes c on c.id = m.comprobante" +
                                              " left join proveedores as p on m.proveedor = p.id" +
                                              " where m.empresa = " + empresa +
                                              " and m.proveedor is not null" +
                                              " and (comprobante = 13 or m.metodo_pago in (select id from metodos_pago where requiere_proveedor = true))" +
                                              " group by m.proveedor")

        
        if(result){
            res.send(result[0]);
        }else{
            res.status(404).send('Movimiento no encontrado.')
        }
    }catch(err){
        
        res.status(500).send(err)
    }
})

router.route('/caja/:caja/:metodo').get(verifyToken, isAdmin, async (req, res) => {
    const { caja, metodo } = req.params
    let result = null

    if(metodo==0) {
        result =  await Movimientos.findAll({
            order: [
                ['id', 'DESC'],
            ],
            where: {caja: caja },
            include: [
                {
                    model: Proveedores, as: "Proveedor"
                },
                {
                    model: Clientes, as: "Cliente"
                },
                {
                    model: Comprobantes, as: "Comprobante"
                },
                {
                    model: Usuarios, as: "Usuario"
                },
                {
                    model: Caja, as: "Caja"
                },
                {
                    model: TiposGasto, as: "Tipo_Gasto"
                },
                {
                    model: MetodosPago, as: "Metodos_Pago"
                }
            ]
        })  
    } else{
        result =  await Movimientos.findAll({
            order: [
                ['id', 'DESC'],
            ],
            where: {caja: caja , metodo_pago: metodo},
            include: [
                {
                    model: Proveedores, as: "Proveedor"
                },
                {
                    model: Clientes, as: "Cliente"
                },
                {
                    model: Comprobantes, as: "Comprobante"
                },
                {
                    model: Usuarios, as: "Usuario"
                },
                {
                    model: Caja, as: "Caja"
                },
                {
                    model: TiposGasto, as: "Tipo_Gasto"
                }
            ]
        })  
    }

     
                
    res.send(result);
})

router.route('/caja/:fecha/:usuario').get(verifyToken, isAdmin, async (req, res) => {
    const { fecha, usuario } = req.params

    let result =  await Caja.findAll({
        order: [
            ['id', 'DESC'],
        ],
        where:{
            [Op.and]: [
                db.sequelize.where(db.sequelize.fn("date", db.sequelize.col("fechaInicio")), "=", fecha.substr(0,10)),
                {usuario: usuario}
            ]
        },
        include: [
            {
                model: Usuarios, as: "Usuario"
            }
        ]
    })
    
    res.send(result)
})

router.route('/search/empresa/:empresa/:desde/:hasta/:tipo').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa, desde, hasta, tipo } = req.params

        let result = await db.sequelize.query("select sum(total) as y, count(1) as cantidad, date(fecha) as x from movimientos as m where $1 = (select c.tipo from comprobantes as c where c.id = m.comprobante) and date(m.fecha) between $2 and $3 and m.empresa = $4 group by date(fecha)", { bind: [tipo, desde, hasta, empresa] })

        console.log(result[0])

        if(result){
            res.send(result[0]);
        }else{
            res.status(404).send('Movimiento no encontrado.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/search/empresa/:empresa/metodo/:desde/:hasta/:tipo').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa, desde, hasta, tipo } = req.params

        let result = await db.sequelize.query("select sum(total) as importe, count(1) as cantidad, (select descripcion from metodos_pago where id=m.metodo_pago) as metodo from movimientos as m where $1 = (select c.tipo from comprobantes as c where c.id = m.comprobante) and date(m.fecha) between date($2) and date($3) and m.empresa = $4 group by m.metodo_pago", { bind: [tipo, desde, hasta, empresa] })
        
        if(result){
            res.send(result[0]);
        }else{
            res.status(404).send('Movimiento no encontrado.')
        }
    }catch(err){
        console.log(err)
        res.status(500).send(err)

    }
})

router.route('/search/empresa/:empresa/:fecha/:tipo').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa, fecha, tipo } = req.params

        let result = await Movimientos.findAll({
            where: {
                [Op.and]: [
                    { empresa: empresa},
                    db.sequelize.where(db.sequelize.fn("date", db.sequelize.col("fecha")), "=", fecha.substr(0,10)),,
                    db.sequelize.literal(tipo + ' = (select tipo from comprobantes where id = movimientos.comprobante)')
                ]
            },
            include: [
                {
                    model: Proveedores, as: "Proveedor"
                },
                {
                    model: Clientes, as: "Cliente"
                },
                {
                    model: Comprobantes, as: "Comprobante"
                },
                {
                    model: Usuarios, as: "Usuario"
                },
                {
                    model: MetodosPago, as: "Metodos_Pago"
                },
                {
                    model: Caja, as: "Caja"
                },
                {
                    model: TiposGasto, as: "Tipo_Gasto"
                }
            ],
            order: [
                ['id', 'DESC'],
            ],
        })

        if(result){
            res.send(result);
        }else{
            res.status(404).send('Movimiento no encontrado.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/searchhistorial/empresa/:empresa/:desde/:hasta/:tipo').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa, desde, hasta, tipo } = req.params

        let result = await Movimientos.findAll({
            where: {
                [Op.and]: [
                    { empresa: empresa },
                    db.sequelize.where(db.sequelize.fn("date", db.sequelize.col("fecha")), ">=", desde.substr(0,10)),
                    db.sequelize.where(db.sequelize.fn("date", db.sequelize.col("fecha")), "<=", hasta.substr(0,10)),
                    db.sequelize.literal(tipo + ' = (select tipo from comprobantes where id = movimientos.comprobante)')
                ]
            },
            include: [
                {
                    model: Proveedores, as: "Proveedor"
                },
                {
                    model: Clientes, as: "Cliente"
                },
                {
                    model: Comprobantes, as: "Comprobante"
                },
                {
                    model: Usuarios, as: "Usuario"
                },
                {
                    model: MetodosPago, as: "Metodos_Pago"
                },
                {
                    model: Caja, as: "Caja"
                },
                {
                    model: TiposGasto, as: "Tipo_Gasto"
                },
                {
                    model: TiposIngreso, as: "Tipo_Ingreso"
                }
            ],
            order: [
                ['id', 'DESC'],
            ],
        })

        if(result){
            res.send(result);
        }else{
            res.status(404).send('Movimiento no encontrado.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').delete(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params

        let movimiento = await Movimientos.findOne({
            where: {id: id}
        })

        let comprobante = await Comprobantes.findOne({
            where: db.sequelize.literal('id = (select comprobante from movimientos where id = '+id+')')
        })

        if(movimiento){
            let detalles = await MovimientosDetalle.findAll({
                where: {movimiento: id}
            })

            detalles.forEach(async elt => {
                let producto = await Productos.findOne({
                    where: {id: elt.producto}
                })

                let cant = 0;

                if(comprobante.tipo==2){
                    cant = producto.stock - elt.cantidad
                } else{
                    cant = producto.stock + elt.cantidad
                }

                console.log(cant)

                await Productos.update(
                    {
                        stock: cant
                    },
                    {
                        where: {
                            id: producto.id
                        }
                    }
                )
            });


            db.sequelize.query("delete from movimientos where id = $1", { bind: [id] })
            db.sequelize.query("delete from movimientos_detalle where movimiento = $1;", { bind: [id] })
            res.status(200).send({'message': 'Movimiento borrado'});

        }else{
            res.status(404).send('Movimiento no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/:id').put(verifyToken, isAdmin, async (req, res) => {
    try{
        const { id } = req.params
        const data = req.body

        let result = await Movimientos.findOne({
            where: {id: id}
        })

        if(result){
            await result.update(getUpdateObject(Movimientos, data, ["id"]))
            res.send(result)
        }else{
            res.status(404).send('Movimiento no encontrado.')
        }
          
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const data = req.body

        const caja = await Caja.findOne({
                where: {id: data.caja}
        })

        if (caja.estado == 0) {
            res.status(500).send({'message': 'Debe tener una Caja Abierta'});
        } else {
            const nuevo = await Movimientos.create(data)
            res.send(nuevo) 
        }
                
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

router.route('/search/criterio').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const data = req.body;
        let sql = "";

        if (data.estadistica == 1){
            sql = "select sum(m.total) as y, DATE_FORMAT(m.fecha, '%Y-%m') as x from movimientos as m where $1 = (select c.tipo from comprobantes as c where c.id = m.comprobante) and date(m.fecha) between date($2) and date($3) and m.empresa = $4 group by month(m.fecha)";
        }

        if (data.estadistica == 2){
            sql = "select sum(m.total) as y, DATE_FORMAT(m.fecha, '%Y-%m-%d') as x from movimientos as m where $1 = (select c.tipo from comprobantes as c where c.id = m.comprobante) and date(m.fecha) between date($2) and date($3) and m.empresa = $4 group by date(m.fecha) order by m.fecha asc";
        }

        if (data.estadistica == 3){
            sql = "select sum(m.total) as y, DATE_FORMAT(m.fecha, '%Y') as x from movimientos as m where $1 = (select c.tipo from comprobantes as c where c.id = m.comprobante) and date(m.fecha) between date($2) and date($3) and m.empresa = $4 group by year(m.fecha) order by m.fecha asc";
        }
        
        let result = await db.sequelize.query(sql, { bind: [data.tipo, data.desde, data.hasta, data.empresa] })
        
        if(result){
            res.send(result[0]);
        }else{
            res.status(404).send('Movimiento no encontrado.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/search/criterio_compras').post(verifyToken, isAdmin, async (req, res) => {
    try{
        const data = req.body
        let result = undefined;

        if (data.estadistica == 10){
            result = await db.sequelize.query("select sum(total) as y, DATE_FORMAT(fecha, '%Y-%m') as x from movimientos as m where $1 = (select c.tipo from comprobantes as c where c.id = m.comprobante) and date(m.fecha) between date($2) and date($3) and m.empresa = $4 group by month(fecha)", { bind: [data.tipo, data.desde, data.hasta, data.empresa] })
        }

        if (data.estadistica == 11){
            result = await db.sequelize.query("select sum(total) as y, DATE_FORMAT(fecha, '%Y-%m-%d') as x from movimientos as m where $1 = (select c.tipo from comprobantes as c where c.id = m.comprobante) and date(m.fecha) between date($2) and date($3) and m.empresa = $4 group by date(fecha) order by m.fecha asc", { bind: [data.tipo, data.desde, data.hasta, data.empresa] })
        }

        if (data.estadistica == 12){
            result = await db.sequelize.query("select sum(total) as y, DATE_FORMAT(fecha, '%Y') as x from movimientos as m where $1 = (select c.tipo from comprobantes as c where c.id = m.comprobante) and date(m.fecha) between date($2) and date($3) and m.empresa = $4 group by year(fecha) order by m.fecha asc", { bind: [data.tipo, data.desde, data.hasta, data.empresa] })
        }

        if(result){
            res.send(result[0]);
        }else{
            res.status(404).send('Movimiento no encontrado.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/estadistica/empresa/:empresa/:desde/:hasta/:categoria').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa, desde, hasta, categoria } = req.params

        let sql = "select" +
        " c.id as categoria_id," +
        " c.categoria as x," +
        " sum(m.cantidad) as y," +
        " sum(m.total) as total" +
        " from movimientos_detalle m" +
        " left join productos p on m.producto = p.id" +
        " left join categorias_producto c on p.categoria_producto = c.id" +
        " left join movimientos mov on m.movimiento = mov.id" +
        " where m.producto not in (0)" +
        " and 1 = (select tipo from comprobantes as com where mov.comprobante = com.id)" +
        " and date(mov.fecha) between $1 and $2" +
        " and mov.empresa = $3" +
        " group by p.categoria_producto"

        if(categoria != 0){
            sql += " having p.categoria_producto = $4"
        }

        let result = await db.sequelize.query(sql, { bind: [desde, hasta, empresa, categoria] })

        if(result){
            res.send(result[0]);
        }else{
            res.status(404).send('Movimiento no encontrado.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/estadisticaproductos/empresa/:empresa/:desde/:hasta').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa, desde, hasta } = req.params

        let sql = "select" +
        " d.producto as producto_id," +
        " p.nombre as x," +
        " sum(d.cantidad) as y" +
        " from movimientos_detalle as d" +
        " left join productos p on d.producto = p.id" +
        " left join movimientos mov on d.movimiento = mov.id" +
        " where 1 = (select tipo from comprobantes as com where mov.comprobante = com.id)" +
        " and date(mov.fecha) between $1 and $2"+
        " and mov.empresa = $3" +
        " group by d.producto" + 
        " order by 3 desc limit 20"
        
        let result = await db.sequelize.query(sql, { bind: [desde, hasta, empresa] })

        if(result){
            res.send(result[0]);
        }else{
            res.status(404).send('Movimiento no encontrado.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/estadisticadiezproductos/empresa/:empresa/:desde/:hasta').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa, desde, hasta } = req.params

        let sql = "select" +
        " d.producto as producto_id," +
        " p.nombre as x," +
        " sum(d.cantidad) as y" +
        " from movimientos_detalle as d" +
        " left join productos p on d.producto = p.id" +
        " left join movimientos mov on d.movimiento = mov.id" +
        " where 1 = (select tipo from comprobantes as com where mov.comprobante = com.id)" +
        " and date(mov.fecha) between $1 and $2"+
        " and mov.empresa = $3" +
        " group by d.producto" + 
        " order by 3 desc limit 10"

        
        let result = await db.sequelize.query(sql, { bind: [desde, hasta, empresa] })

        if(result){
            res.send(result[0]);
        }else{
            res.status(404).send('Movimiento no encontrado.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/estadisticausuario/empresa/:empresa/:desde/:hasta').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa, desde, hasta } = req.params

        let sql = "select" +
        " mov.usuario as usuario_id," +
        " concat(u.nombre, ' ', u.apellido) as x," +
        " sum(mov.total) as y" +
        " from movimientos mov" +
        " left join usuarios u on mov.usuario = u.id" +
        " where 1 = (select tipo from comprobantes as com where mov.comprobante = com.id)" +
        " and date(mov.fecha) between $1 and $2" +
        " and mov.empresa = $3" +
        " group by mov.usuario"

        
        let result = await db.sequelize.query(sql, { bind: [desde, hasta, empresa] })

        if(result){
            res.send(result[0]);
        }else{
            res.status(404).send('Movimiento no encontrado.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/estadisticametodospago/empresa/:empresa/:desde/:hasta').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa, desde, hasta } = req.params

        let sql = "select" +
        " mov.metodo_pago as metodo_pago_id," +
        " met.descripcion as x," +
        " sum(mov.total) as y" +
        " from movimientos mov" +
        " left join metodos_pago met on mov.metodo_pago = met.id" +
        " where 1 = (select com.tipo from comprobantes as com where mov.comprobante = com.id)" +
        " and date(mov.fecha) between $1 and $2" +
        " and mov.empresa = $3" +
        " group by mov.metodo_pago"

        
        let result = await db.sequelize.query(sql, { bind: [desde, hasta, empresa] })

        if(result){
            res.send(result[0]);
        }else{
            res.status(404).send('Movimiento no encontrado.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

router.route('/estadisticacomparativa/empresa/:empresa/:desde/:hasta').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa, desde, hasta } = req.params

        let sql = "select" +
        " DATE_FORMAT(fecha, '%Y-%m') as x," +
        " sum(m.total) as y" +
        " from movimientos as m" +
        " where (select tipo from comprobantes as com where m.comprobante = com.id) = 1" +
	    " and date(m.fecha) between $1 and $2" +
        " and m.empresa = $3" +
        " group by MONTH(fecha) order by m.fecha asc"

        
        let result1 = await db.sequelize.query(sql, { bind: [desde, hasta, empresa] })

        sql = "select" +
        " DATE_FORMAT(fecha, '%Y-%m') as x," +
        " sum(m.total) as y" +
        " from movimientos as m" +
        " where (select tipo from comprobantes as com where m.comprobante = com.id) = 3" +
	    " and date(m.fecha) between $1 and $2" +
        " and m.empresa = $3" +
        " group by MONTH(fecha) order by m.fecha asc"

        
        let result2 = await db.sequelize.query(sql, { bind: [desde, hasta, empresa] })

        let result = [
            result1[0],
            result2[0]
        ]

        if(result){
            res.send(result);
        }else{
            res.status(404).send('Movimiento no encontrado.')
        }

    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

router.route('/estadisticacomparativaingresosgastos/empresa/:empresa/:desde/:hasta').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa, desde, hasta } = req.params

        let sql = "select" +
        " DATE_FORMAT(fecha, '%Y-%m') as x," +
        " sum(m.total) as y" +
        " from movimientos as m" +
        " where (select tipo from comprobantes as com where m.comprobante = com.id) = 6" +
	    " and date(m.fecha) between $1 and $2" +
        " and m.empresa = $3" +
        " group by MONTH(fecha) order by m.fecha asc"

        
        let result1 = await db.sequelize.query(sql, { bind: [desde, hasta, empresa] })

        sql = "select" +
        " DATE_FORMAT(fecha, '%Y-%m') as x," +
        " sum(m.total) as y" +
        " from movimientos as m" +
        " where (select tipo from comprobantes as com where m.comprobante = com.id) = 3" +
	    " and date(m.fecha) between $1 and $2" +
        " and m.empresa = $3" +
        " group by MONTH(fecha) order by m.fecha asc"

        
        let result2 = await db.sequelize.query(sql, { bind: [desde, hasta, empresa] })

        let result = [
            result1[0],
            result2[0]
        ]

        if(result){
            res.send(result);
        }else{
            res.status(404).send('Movimiento no encontrado.')
        }

    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

router.route('/estadisticaventascomprascomparativa/empresa/:empresa/:desde/:hasta').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa, desde, hasta } = req.params

        let sql = "select" +
        " DATE_FORMAT(m.fecha, '%Y-%m') as x," +
        " sum(m.total) as y" +
        " from movimientos as m" +
        " where (select tipo from comprobantes as com where m.comprobante = com.id) = 1" +
	    " and date(m.fecha) between $1 and $2" +
        " and m.empresa = $3" +
        " group by MONTH(m.fecha) order by m.fecha asc"

        
        let result1 = await db.sequelize.query(sql, { bind: [desde, hasta, empresa] })

        sql = "select" +
        " DATE_FORMAT(m.fecha, '%Y-%m') as x," +
        " sum(m.total) as y" +
        " from movimientos as m" +
        " where (select tipo from comprobantes as com where m.comprobante = com.id) = 2" +
	    " and date(m.fecha) between $1 and $2" +
        " and m.empresa = $3" +
        " group by MONTH(m.fecha) order by m.fecha asc"

        
        let result2 = await db.sequelize.query(sql, { bind: [desde, hasta, empresa] })

        let result = [
            result1[0],
            result2[0]
        ]

        if(result){
            res.send(result);
        }else{
            res.status(404).send('Movimiento no encontrado.')
        }

    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

router.route('/estadisticacomparativaventascomprasgastos/empresa/:empresa/:desde/:hasta').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa, desde, hasta } = req.params

        let sql = "select" +
        " DATE_FORMAT(fecha, '%Y-%m') as x," +
        " sum(m.total) as y" +
        " from movimientos as m" +
        " where (select tipo from comprobantes as com where m.comprobante = com.id) = 1" +
	    " and date(m.fecha) between $1 and $2" +
        " and m.empresa = $3" +
        " group by MONTH(fecha) order by m.fecha asc"

        
        let result1 = await db.sequelize.query(sql, { bind: [desde, hasta, empresa] })

        sql = "select" +
        " DATE_FORMAT(fecha, '%Y-%m') as x," +
        " sum(m.total) as y" +
        " from movimientos as m" +
        " where (select tipo from comprobantes as com where m.comprobante = com.id) = 2" +
	    " and date(m.fecha) between $1 and $2" +
        " and m.empresa = $3" +
        " group by MONTH(fecha) order by m.fecha asc"

        
        let result2 = await db.sequelize.query(sql, { bind: [desde, hasta, empresa] })

        sql = "select" +
        " DATE_FORMAT(fecha, '%Y-%m') as x," +
        " sum(m.total) as y" +
        " from movimientos as m" +
        " where (select tipo from comprobantes as com where m.comprobante = com.id) = 3" +
	    " and date(m.fecha) between $1 and $2" +
        " and m.empresa = $3" +
        " group by MONTH(fecha) order by m.fecha asc"

        
        let result3 = await db.sequelize.query(sql, { bind: [desde, hasta, empresa] })

        let result = [
            result1[0],
            result2[0],
            result3[0]
        ]

        if(result){
            res.send(result);
        }else{
            res.status(404).send('Movimiento no encontrado.')
        }

    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

router.route('/estadistica/empresa/:empresa/:desde/:hasta/:categoria/:producto').get(verifyToken, isAdmin, async (req, res) => {
    try{
        const { empresa, desde, hasta, categoria, producto } = req.params

        let sql = "select" +
        " c.id as categoria_id," +
        " c.categoria as categoria," +
        " p.id as producto_id," +
        " p.nombre as x," +
        " sum(m.cantidad) as y," +
        " sum(m.total) as total" +
        " from movimientos_detalle m" +
        " left join productos p on m.producto = p.id" +
        " left join categorias_producto c on p.categoria_producto = c.id" +
        " left join movimientos mov on m.movimiento = mov.id" +
        " where m.producto not in (0)" +
        " and 1 = (select tipo from comprobantes as com where mov.comprobante = com.id)" +
        " and date(mov.fecha) between $1 and $2" +
        " and mov.empresa = $3"
        
        if(producto != 0){
            sql += " and p.id = $5"
        }

        sql += " group by p.categoria_producto, p.id"

        if(categoria != 0){
            sql += " having p.categoria_producto = $4"
        }

        console.log(sql);

        let result = await db.sequelize.query(sql, { bind: [desde, hasta, empresa, categoria, producto] })

        console.log(result[0]);

        if(result){
            res.send(result[0]);
        }else{
            res.status(404).send('Movimiento no encontrado.')
        }
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router
