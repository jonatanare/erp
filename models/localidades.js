const Sequelize = require('sequelize')
const { db } = require('../config/database')
const { Provincias } = require('./provincias')

var Localidades = db.sequelize.define(
    'localidades',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        localidad: {
            type: Sequelize.STRING
        },
        provincia: {
            type: Sequelize.INTEGER
        }
    }, {
        freezeTableName: true
    }
)

Localidades.hasOne(Provincias, { foreignKey: 'id', sourceKey: 'provincia' , as: 'Provincia' })


module.exports = {Localidades}