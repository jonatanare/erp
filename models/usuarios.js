const Sequelize = require('sequelize')
const { db } = require('../config/database')
const { Perfiles } = require('./perfiles')
const { Empresas } = require('./empresas')

var Usuarios = db.sequelize.define(
    'usuarios',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: Sequelize.STRING
        },
        apellido: {
            type: Sequelize.STRING
        },
        email:{
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        perfil: {
            type: Sequelize.INTEGER
        },
        avatar: {
            type: Sequelize.BLOB
        },
        telefono: {
            type: Sequelize.STRING
        },
        domicilio: {
            type: Sequelize.STRING
        },
        localidad: {
            type: Sequelize.INTEGER
        },
        empresa: {
            type: Sequelize.INTEGER
        }

    }, {
        freezeTableName: true
    }
)

Usuarios.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
    delete values.password;
    return values;
  }

Usuarios.hasOne(Perfiles, { foreignKey: 'id', sourceKey: 'perfil' , as: 'Perfil' })
Usuarios.hasOne(Empresas, { foreignKey: 'id', sourceKey: 'empresa' , as: 'Empresa' })

module.exports = {Usuarios}

