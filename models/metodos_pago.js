const Sequelize = require('sequelize')
const { db } = require('../config/database')

var MetodosPago = db.sequelize.define(
    'metodos_pago',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        descripcion: {
            type: Sequelize.STRING
        },
        requiere_cliente: {
            type: Sequelize.BOOLEAN
        },
        requiere_proveedor: {
            type: Sequelize.BOOLEAN
        },
    }, {
        freezeTableName: true
    }
)

module.exports = {MetodosPago}