const Sequelize = require('sequelize')
const { db } = require('../config/database')


var TiposGasto = db.sequelize.define(
    'tipos_gasto',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        descripcion: {
            type: Sequelize.STRING
        },
        empresa: {
            type: Sequelize.INTEGER
        }
    }, {
        freezeTableName: true
    }
)



module.exports = {TiposGasto}