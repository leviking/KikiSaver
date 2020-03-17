drop database kiki_saver;
create database kiki_saver;

CREATE USER 'admin'@'localhost' IDENTIFIED BY 'abc123';
grant all PRIVILEGES on *.* to 'admin'@'localhost';

use kiki_saver;