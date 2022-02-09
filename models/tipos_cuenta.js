const Sequelize = require('sequelize')
const { db } = require('../config/database')

var TiposCuenta = db.sequelize.define(
    'tipos_cuenta',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tipo: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true
    }
)

module.exports = {TiposCuenta}