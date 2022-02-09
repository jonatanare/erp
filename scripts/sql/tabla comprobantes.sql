drop table comprobantes

create table comprobantes(
	id int not null auto_increment,
    descripcion varchar(255) not null,
    tipo int not null,
    codigo int not null,
    signo int not null,
    condicion int not null,
	createdAt Datetime null,
    updatedAt Datetime null,
    primary key(id)
)

--compra
insert into comprobantes(tipo, codigo, descripcion, signo, condicion, createdAt)
value
(2, '1', 'FACTURA A', 1, null, now()),
(2, '2', 'NOTA DE DEBITO A', 1, null, now()),
(2, '3', 'NOTA DE CREDITO A', -1, null, now()),

--venta
insert into comprobantes(tipo, codigo, descripcion, signo, condicion, createdAt)
value
(1, '001', 'FACTURAS A', 1, 0, now()),
(1, '002', 'NOTAS DE DEBITO A', 1, 0, now()),
(1, '003', 'NOTAS DE CREDITO A', -1, 0, now()),



