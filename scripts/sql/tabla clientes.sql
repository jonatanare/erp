drop table clientes

create table clientes(
	id int not null auto_increment,
    condicion int not null,
    nombre varchar(255) null,
    apellido varchar(255) null,
    razon_social varchar(255) null,
    taxid varchar(255) not null,
	createdAt Datetime null,
    updatedAt Datetime null,
    primary key(id)
)