drop table telefonos

create table telefonos(
	id int not null auto_increment,
    numero varchar(255) not null,
	createdAt Datetime null,
    updatedAt Datetime null,
    primary key(id)
)