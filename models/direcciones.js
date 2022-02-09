const Sequelize = require('sequelize')
const { db } = require('../config/database')
const { Localidades } = require('./localidades')

var Direcciones = db.sequelize.define(
    'direcciones',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        calle: {
            type: Sequelize.STRING
        },
        numero: {
            type: Sequelize.STRING
        },
        localidad: {
            type: Sequelize.INTEGER
        },
        cp: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true
    }
)

Direcciones.hasOne(Localidades, { foreignKey: 'id', sourceKey: 'localidad' , as: 'Localidad' })

module.exports = {Direcciones}