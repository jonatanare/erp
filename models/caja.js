const Sequelize = require('sequelize')
const { db } = require('../config/database')
const { Usuarios } = require('./usuarios')

var Caja = db.sequelize.define(
    'caja',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fechaInicio: {
            type: Sequelize.DATE
        },
        fechaFin: {
            type: Sequelize.DATE
        },
        estado: {
            type: Sequelize.BOOLEAN
        },
        usuario: {
            type: Sequelize.INTEGER
        },
        saldoInicial: {
            type: Sequelize.DECIMAL
        },
        saldoFinal: {
            type: Sequelize.DECIMAL
        },
        arqueo: {
            type: Sequelize.DECIMAL
        },
        faltante: {
            type: Sequelize.DECIMAL
        },
        sobrante: {
            type: Sequelize.DECIMAL
        }
    }, {
        freezeTableName: true
    }
)

Caja.hasOne(Usuarios, { foreignKey: 'id', sourceKey: 'usuario', as: 'Usuario' })

module.exports = {Caja}