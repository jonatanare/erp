drop table direcciones

create table direcciones(
	id int not null auto_increment,
    calle varchar(255) not null,
    numero varchar(255) not null,
    localidad int not null,
    cp varchar(11) not null,
	createdAt Datetime null,
    updatedAt Datetime null,
    primary key(id)
)