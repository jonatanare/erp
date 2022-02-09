drop table proveedores

create table proveedores(
	id int not null auto_increment,
    razon_social varchar(255) not null,
    cuit varchar(255) not null,
    descripcion varchar(2048) not null,
	createdAt Datetime null,
    updatedAt Datetime null,
    primary key(id)
)