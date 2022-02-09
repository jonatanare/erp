const Sequelize = require('sequelize')
const { db } = require('../config/database')
const { CategoriasCuenta } = require('./categorias_cuenta')
const { TiposCuenta } = require('./tipos_cuenta')

var Cuentas = db.sequelize.define(
    'cuentas',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tipo: {
            type: Sequelize.INTEGER
        },
        categoria: {
            type: Sequelize.INTEGER
        },
        codigo: {
            type: Sequelize.STRING
        },
        descripcion: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true
    }
)

Cuentas.hasOne(CategoriasCuenta, { foreignKey: 'id', sourceKey: 'categoria', as: 'Categoria' })
Cuentas.hasOne(TiposCuenta, { foreignKey: 'id', sourceKey: 'tipo', as: 'Tipo' })

module.exports = {Cuentas}