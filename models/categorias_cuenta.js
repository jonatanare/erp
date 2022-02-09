const Sequelize = require('sequelize')
const { db } = require('../config/database')

var CategoriasCuenta = db.sequelize.define(
    'categorias_cuenta',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        categoria: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true
    }
)

module.exports = {CategoriasCuenta}