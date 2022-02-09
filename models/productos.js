const Sequelize = require('sequelize')
const { db } = require('../config/database')
const { Proveedores } = require('./proveedores')
const { Monedas } = require('./monedas')
const { CategoriasProducto } = require('./categorias_productos')
const { MovimientosDetalle } = require('./movimientos_detalle')

var Productos = db.sequelize.define(
    'productos',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: Sequelize.STRING
        },
        categoria_producto: {
            type: Sequelize.INTEGER
        },
        codigo: {
            type: Sequelize.STRING
        },
        marca: {
            type: Sequelize.STRING
        },
        descripcion: {
            type: Sequelize.STRING
        },
        proveedor:{
            type: Sequelize.INTEGER
        },
        precio_unitario: {
            type: Sequelize.DECIMAL
        },
        iva: {
            type: Sequelize.DECIMAL
        },
        por_gan: {
            type: Sequelize.DECIMAL
        },
        precio_final: {
            type: Sequelize.DECIMAL
        },
        moneda: {
            type: Sequelize.INTEGER
        },
        stock: {
            type: Sequelize.INTEGER
        },
        empresa: {
            type: Sequelize.INTEGER
        }
    }, {
        freezeTableName: true
    }
)

Productos.hasOne(Proveedores, { foreignKey: 'id', sourceKey: 'proveedor', as: 'Proveedor' })
Productos.hasOne(Monedas, { foreignKey: 'id', sourceKey: 'moneda', as: 'Moneda' })
Productos.hasOne(CategoriasProducto, { foreignKey: 'id', sourceKey: 'categoria_producto', as: 'Categoria_Producto' })
MovimientosDetalle.hasOne(Productos, { foreignKey: 'id', sourceKey: 'producto' , as: 'Producto' })

module.exports = {Productos}