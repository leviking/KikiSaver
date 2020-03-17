drop database kiki_saver;
create database kiki_saver;

create USER 'admin'@'localhost' IDENTIFIED BY 'abc123';
grant all PRIVILEGES on *.* to 'admin'@'localhost';

use kiki_saver;

create table users (
    id tinyint auto_increment,
    username varchar(20),
    password varhar(20),
    first_name varchar(20),
    last_name varchar(30),
    phone varchar(10),
    created_at datetime,
    deleted_at datetime,
    constraint user_id primary key (id),
    constraint username unique(username),
    constraint email unique(email)

)