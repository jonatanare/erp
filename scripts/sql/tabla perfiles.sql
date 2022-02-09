drop table perfiles
create table perfiles(
	id int not null auto_increment,
    perfil varchar(255) not null,
	createdAt Datetime null,
    updatedAt Datetime null,
    primary key(id)
)

insert into perfiles(perfil, createdAt)
values('ADMIN', now())