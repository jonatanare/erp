const Sequelize = require('sequelize')
const { db } = require('../config/database')

var EstadosEjercicio = db.sequelize.define(
    'estados_ejercicio',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        estado: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true
    }
)

module.exports = {EstadosEjercicio}