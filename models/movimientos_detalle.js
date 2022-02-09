const Sequelize = require('sequelize')
const { db } = require('../config/database')
const Productos = require('./productos')


var MovimientosDetalle = db.sequelize.define(
    'movimientos_detalle',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        movimiento: {
            type: Sequelize.INTEGER
        },
        producto: {
            type: Sequelize.INTEGER
        },
        
        cantidad:{
            type: Sequelize.INTEGER
        },
        precioUnitario: {
            type: Sequelize.DECIMAL
        },
        total: {
            type: Sequelize.DECIMAL
        }
    }, {
        freezeTableName: true
    }
)


module.exports = {MovimientosDetalle}


