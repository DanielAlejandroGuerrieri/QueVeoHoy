create database Acamica; -- creacion de la base de datos con nombre Acamica

USE Acamica; -- base de datos a utilizar

CREATE TABLE pelicula(
	id int not null primary key auto_increment,
    titulo varchar(100),
    duracion int,
    director varchar(400),
    anio int,
    fecha_lanzamiento datetime,
    puntuacion int,
    poster varchar(300),
    trama varchar(700)
);

CREATE TABLE genero(
	id int not null primary key auto_increment,
    nombre varchar(30)
);

CREATE TABLE actor(
id int not null primary key auto_increment,
nombre varchar(70)
);

create table actor_pelicula(
id int not null primary key auto_increment,
actor_id int,
pelicula_id int
);

alter table pelicula add column genero_id int;
alter table pelicula add FOREIGN KEY (genero_id) references genero(id);

describe pelicula;
describe actor_pelicula;
describe actor;

select * from pelicula;
select * from pelicula where puntuacion>= 7;

select genero_id, titulo, anio, trama from pelicula;

select * from pelicula, genero where genero_id = genero.id;

select COUNT(*) as total FROM pelicula p JOIN genero AS g ON p.genero_id = g.id

        
