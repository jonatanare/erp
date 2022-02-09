const Sequelize = require('sequelize')
const { db } = require('../config/database')

var Provincias = db.sequelize.define(
    'provincias',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        provincia: {
            type: Sequelize.STRING
        },
        codigoPostal: {
            type: Sequelize.STRING
        },
    }, {
        freezeTableName: true
    }
)

module.exports = {Provincias}