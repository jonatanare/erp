drop table categorias_cuenta

create table categorias_cuenta(
	id int not null auto_increment,
    categoria varchar(255) not null,
	createdAt Datetime null,
    updatedAt Datetime null,
    primary key(id)
)
