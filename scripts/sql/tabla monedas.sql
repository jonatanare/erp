
create table monedas(
	id int not null auto_increment,
    moneda varchar(255) not null,
    simbolo varchar(255) not null,
    createdAt Datetime null,
    updatedAt Datetime null,
    primary key(id)
)
