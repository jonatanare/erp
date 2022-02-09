drop table tipos_cuenta

create table tipos_cuenta(
	id int not null auto_increment,
    tipo varchar(255) not null,
	createdAt Datetime null,
    updatedAt Datetime null,
    primary key(id)
)
