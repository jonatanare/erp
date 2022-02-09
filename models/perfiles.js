const Sequelize = require('sequelize')
const { db } = require('../config/database')

var Perfiles = db.sequelize.define(
    'perfiles',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        perfil: {
            type: Sequelize.STRING
        }
    },
    {
        freezeTableName: true
    }
)

module.exports = {Perfiles}
