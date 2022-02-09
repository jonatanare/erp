
create table ejercicios(
	id int not null auto_increment,
    inicio datetime not null,
    fin datetime not null,
    estado int not null,
    createdAt Datetime null,
    updatedAt Datetime null,
    primary key(id)
)
