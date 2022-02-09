drop table estados_ejercicio

create table estados_ejercicio(
	id int not null auto_increment,
    estado varchar(255) not null,
	createdAt Datetime null,
    updatedAt Datetime null,
    primary key(id)
)