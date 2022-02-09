const Sequelize = require('sequelize')
const { db } = require('../config/database')

var Empresas = db.sequelize.define(
    'empresas',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        razon_social: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true
    }
)

module.exports = {Empresas}