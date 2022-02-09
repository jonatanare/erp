drop table categorias_producto

create table categorias_producto(
	id int not null auto_increment,
    categoria varchar(255) not null,
	createdAt Datetime null,
    updatedAt Datetime null,
    primary key(id)
)
