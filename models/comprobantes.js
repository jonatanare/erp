const Sequelize = require('sequelize')
const { db } = require('../config/database')
const { CondicionesFiscales } = require('./condiciones_fiscales')



var Comprobantes = db.sequelize.define(
    'comprobantes',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        
        descripcion: {
            type: Sequelize.STRING,
        },
        
        tipo: {
            type: Sequelize.INTEGER,
        },
        
        codigo: {
            type: Sequelize.INTEGER,
        },

        condicion: {
            type: Sequelize.INTEGER,
        },

        signo: {
            type: Sequelize.INTEGER,
        },
        
    }, {
        freezeTableName: true
    }
)

Comprobantes.hasOne(CondicionesFiscales, { foreignKey: 'id', sourceKey: 'condicion' , as: 'Condicion' })

module.exports = {Comprobantes}