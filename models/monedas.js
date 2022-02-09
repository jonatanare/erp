const Sequelize = require('sequelize')
const { db } = require('../config/database')

var Monedas = db.sequelize.define(
    'monedas',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        moneda: {
            type: Sequelize.STRING
        },
        simbolo: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true
    }
)

module.exports = {Monedas}