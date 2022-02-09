const Sequelize = require('sequelize')
const { db } = require('../config/database')
const { EstadosEjercicio } = require('./estados_ejercicio')

var Ejercicios = db.sequelize.define(
    'ejercicios',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        inicio: {
            type: Sequelize.DATE
        },
        fin: {
            type: Sequelize.DATE
        },
        estado: {
            type: Sequelize.INTEGER
        }
    }, {
        freezeTableName: true
    }
)

Ejercicios.hasOne(EstadosEjercicio, { foreignKey: 'id', sourceKey: 'estado' , as: 'Estado' })

module.exports = {Ejercicios}