drop table usuarios
create table usuarios(
	id int not null auto_increment,
    nombre varchar(255) not null,
    apellido varchar(255) not null,
    email varchar(255) not null,
    password varchar(2048) not null,
    perfil int not null,
    createdAt Datetime null,
    updatedAt Datetime null,
    primary key(id)
)

insert into usuarios(nombre, apellido, email, password, perfil, createdAt)
values('Patricio', 'Luzzi', 'patricio@gmail.com', '123456', 1, now())