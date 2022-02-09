drop table movimientos

create table movimientos(
	id int not null auto_increment,
	tipo int not null,
    proveedor int null,
    cliente int null,
    fecha Datetime not null,
    total decimal (12,2) not null,
    usuario int not null,
    comprobantes int not null,
    createdAt Datetime null,
    updatedAt Datetime null,
    primary key(id)
)