const Sequelize = require('sequelize')
const { db } = require('../config/database')

var CondicionesFiscales = db.sequelize.define(
    'condiciones_fiscales',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        condicion: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true
    }
)

module.exports = {CondicionesFiscales}