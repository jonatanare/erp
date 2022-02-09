const Sequelize = require('sequelize')
const { db } = require('../config/database')

var Proveedores = db.sequelize.define(
    'proveedores',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        razon_social: {
            type: Sequelize.STRING
        },
        cuit: {
            type: Sequelize.STRING
        },
        telefono: {
            type: Sequelize.STRING
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

module.exports = {Proveedores}