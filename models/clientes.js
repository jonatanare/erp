const Sequelize = require('sequelize')
const { db } = require('../config/database')
const { CondicionesFiscales } = require('./condiciones_fiscales')
const { Localidades } = require('./localidades')

var Clientes = db.sequelize.define(
    'clientes',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        condicion: {
            type: Sequelize.INTEGER
        },
        nombre: {
            type: Sequelize.STRING
        },
        telefono: {
            type: Sequelize.STRING
        },
          
        domicilio: {
            type: Sequelize.STRING
        },
        localidad: {
            type: Sequelize.STRING
        },
        apellido: {
            type: Sequelize.STRING
        },
        razon_social: {
            type: Sequelize.STRING
        },
        taxid:{
            type: Sequelize.STRING
        },
        empresa:{
            type: Sequelize.INTEGER
        }
    }, {
        freezeTableName: true
    }
)

Clientes.hasOne(CondicionesFiscales, { foreignKey: 'id', sourceKey: 'condicion' , as: 'Condicion' })
Clientes.hasOne(Localidades, { foreignKey: 'id', sourceKey: 'localidad' , as: 'Localidad' })

module.exports = {Clientes}