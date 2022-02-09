drop table condiciones_fiscales

create table condiciones_fiscales(
	id int not null auto_increment,
    condicion varchar(255) not null,
	createdAt Datetime null,
    updatedAt Datetime null,
    primary key(id)
)