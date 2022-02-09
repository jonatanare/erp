drop table productos

create table productos(
	id int not null auto_increment,
    nombre varchar(255) not null,
    categoria_producto int not null,
    codigo varchar(255) not null,
    marca varchar(255) not null,
    descripcion varchar(2048) not null,
    proveedor int not null,
    precio_unitario decimal(12,4) not null,
    iva decimal(12,4) not null,
    por_gan decimal(12,4) not null,
    precio_final decimal(12,4) null,
    moneda int not null,
	createdAt Datetime null,
    updatedAt Datetime null,
    primary key(id)
)