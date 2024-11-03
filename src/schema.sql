create database employee_db;
\c employee_db;

CREATE TABLE department(
    id serial primary key,
    name varchar(30) unique not null
);

CREATE TABLE role(
    id serial primary key,
    title varchar(30)unique not null,
    salary decimal not null,
    department_id int not null,
    foreign key (department_id) references department(id)
);

CREATE TABLE employee(
    id serial primary key,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int not null ,
    foreign key(role_id) references role(id),
    manager_id int,
    foreign key (manager_id) references employee(id)
);
