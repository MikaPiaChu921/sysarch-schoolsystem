create database student_database;

use student_database;

create table user(
    id int primary key auto_increment,
    email varchar(80),
    password varchar(25)
);

create table student(
    id int primary key auto_increment,
    idno varchar(10) unique,
    lastname varchar(80),
    firstname varchar(80),
    course varchar(10),
    level varchar(5)
);

create table subject(
    id int primary key auto_increment,
    edpcode varchar(10) unique,
    subjectcode varchar(25),
    time varchar(20),
    days varchar(10),
    room varchar(5)
);

create table enrollment(
    enrollment_id int primary key auto_increment,
    idno varchar(10),
    edpcode varchar(10),
    enrolled_by int not null,
    foreign key(idno) references student(idno),
    foreign key(edpcode) references subject(edpcode),
    foreign key(enrolled_by) references user(id)
) engine=innodb;