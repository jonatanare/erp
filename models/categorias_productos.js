const Sequelize = require('sequelize')
const { db } = require('../config/database')

var CategoriasProducto = db.sequelize.define(
    'categorias_producto',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        categoria: {
            type: Sequelize.STRING
        }
    },
    {
        freezeTableName: true
    }
)

module.exports = {CategoriasProducto}
