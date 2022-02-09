drop table cuentas

create table cuentas(
	id int not null auto_increment,
    tipo int not null,
    categoria int not null,
    codigo varchar(255) not null,
    descripcion varchar(2048) not null,
	createdAt Datetime null,
    updatedAt Datetime null,
    primary key(id)
)