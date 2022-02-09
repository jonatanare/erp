const Sequelize = require('sequelize')
const { db } = require('../config/database')
const { Clientes } = require('./clientes')
const { Proveedores } = require('./proveedores')
const { MovimientosDetalle } = require('./movimientos_detalle')
const { Comprobantes } = require('./comprobantes')
const { Usuarios } = require('./usuarios')
const { MetodosPago } = require('./metodos_pago')
const { Caja } = require('./caja')
const { TiposGasto } = require('./tipos_gasto')
const { TiposIngreso } = require('./tipos_ingreso')

var Movimientos = db.sequelize.define(
    'movimientos',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        proveedor: {
            type: Sequelize.INTEGER
        },
        cliente: {
            type: Sequelize.INTEGER
        },
        fecha:{
            type: Sequelize.DATE
        },
        total: {
            type: Sequelize.DECIMAL
        },
        usuario: {
            type: Sequelize.INTEGER
        },
        comprobante: {
            type: Sequelize.INTEGER
        },
        metodo_pago: {
            type: Sequelize.INTEGER
        },

        tipo_gasto: {
            type: Sequelize.INTEGER
        },
        tipo_ingreso: {
            type: Sequelize.INTEGER
        },
        caja: {
            type: Sequelize.INTEGER
        },
        empresa: {
            type: Sequelize.INTEGER
        }
        
    }, {
        freezeTableName: true
    }
)


Movimientos.hasOne(Clientes, { foreignKey: 'id', sourceKey: 'cliente' , as: 'Cliente' })
Movimientos.hasOne(Proveedores, { foreignKey: 'id', sourceKey: 'proveedor' , as: 'Proveedor' })
Movimientos.hasMany(MovimientosDetalle, { foreignKey: 'movimiento', targetKey: 'id', as: 'Movimientos_Detalle' })
Movimientos.hasOne(Comprobantes, { foreignKey: 'id', sourceKey: 'comprobante' , as: 'Comprobante' })
Movimientos.hasOne(Usuarios, { foreignKey: 'id', sourceKey: 'usuario' , as: 'Usuario' })
Movimientos.hasOne(MetodosPago, { foreignKey: 'id', sourceKey: 'metodo_pago' , as: 'Metodos_Pago' })
Movimientos.hasOne(Caja, { foreignKey: 'id', sourceKey: 'caja' , as: 'Caja' })
Movimientos.hasOne(TiposGasto, { foreignKey: 'id', sourceKey: 'tipo_gasto' , as: 'Tipo_Gasto' })
Movimientos.hasOne(TiposIngreso, { foreignKey: 'id', sourceKey: 'tipo_ingreso' , as: 'Tipo_Ingreso' })

module.exports = {Movimientos}

