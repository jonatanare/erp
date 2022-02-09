const Sequelize = require('sequelize');
const db = {}

const sequelize = new Sequelize('u279015983_erp', 'u279015983_erp', '[k0/3Eu?=TN', {
    host: '185.201.11.93',
    dialect: 'mysql',
    operatorAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

/*
const sequelize = new Sequelize('erp', 'root', 'Fi11235813*', {
    host: '127.0.0.1',
    dialect: 'mysql',
    operatorAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})
*/

db.sequelize = sequelize
db.Sequelize = Sequelize

getUpdateObject = (model, data, skip) => {  
    let attr = model.tableAttributes
    let result = {}
    Object.keys(attr).forEach(a => {
        if (skip.indexOf(a) < 0 && data[a]!=undefined ){
            result[a] = data[a]
        }
    })
    return result
}

module.exports = { db, getUpdateObject }
