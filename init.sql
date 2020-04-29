drop database kiki_saver;
create database kiki_saver;

create USER 'admin'@'localhost' IDENTIFIED BY 'abc123';
grant all PRIVILEGES on *.* to 'admin'@'localhost';

use kiki_saver;

create table users (
    id int auto_increment,
    username varchar(50),
    password varchar(74),
    first_name varchar(20),
    last_name varchar(30),
    phone varchar(10),
    created_at datetime,
    deleted_at datetime,
    is_admin boolean,
    constraint user_id primary key (id),
    constraint username unique(username)
);

create table attendance(
    id int auto_increment,
    user_id int,
    created_at datetime,
    deleted_at datetime,
    gps varchar(80),
    selfie_url varchar(240),
    ip varchar(40),
    constraint id primary key (id),
    constraint foreign key(user_id) references users(id)
);

create table user_resets(
    id int auto_increment,
    user_id int,
    created_at datetime,
    deleted_at datetime,
    reset_key varchar(256),
    constraint id primary key (id),
    constraint foreign key(user_id) references users(id)
)
