drop database kiki_saver;
create database kiki_saver;

CREATE USER 'admin'@'localhost' IDENTIFIED BY 'abc123';
grant all PRIVILEGES on *.* to 'admin'@'localhost';

use kiki_saver;

create table attendance(
    id int auto_increment,
    user_id int,
    created_at datetime,
    deleted_at datetime,
    gps int,
    selfie_url varchar(240),
    ip int,
    constraint foreign key(user_id) references users(id)
);
