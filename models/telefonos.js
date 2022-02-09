const Sequelize = require('sequelize')
const { db } = require('../config/database')

var Telefonos = db.sequelize.define(
    'telefonos',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        numero: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true
    }
)

module.exports = {Telefonos}