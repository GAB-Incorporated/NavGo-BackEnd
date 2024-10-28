-- Active: 1726496730791@@127.0.0.1@3306@navgo_db
create database if not exists navgo_db;

use navgo_db;

create table if not exists buildings(
    building_id int auto_increment primary key,
    building_name varchar(50),
    description varchar(100),
    soft_delete bool default false
);

create table if not exists location_types(
    type_id int auto_increment primary key,
    type_name varchar(50),
    description varchar(100),
    soft_delete bool default false
);

create table if not exists locations(
    location_id int auto_increment primary key,
    campus varchar(100),
    building_id int,
    floor_number int,
    location_type_id int,
    location_name varchar(50),
    description varchar(200),
    coordinates JSON,
    open_time timestamp default current_timestamp,
    closing_time timestamp default current_timestamp,
    soft_delete bool default false,
    foreign key (building_id) references buildings(building_id),
    foreign key (location_type_id) references location_types(type_id)
);

create table if not exists users(
    user_id int auto_increment primary key,
    first_name varchar(50),
    last_name varchar(150),
    nick_name varchar(50),
    email varchar(200) unique,
    password_hash varchar(255),
    user_type varchar(50),
    photo_id varchar(255),
    soft_delete bool default false
);

create table if not exists courses(
    course_id int auto_increment primary key,
    course_name varchar(100),
    coordinator_id int,
    soft_delete bool default false,
    foreign key (coordinator_id) references users(user_id)
);

create table if not exists subjects(
    subject_id int auto_increment primary key,
    subject_name varchar(100),
    course_id int,
    soft_delete bool default false,
    foreign key (course_id) references courses(course_id)
);

create table if not exists periods(
    period_id int auto_increment primary key,
    start_hour time,
    end_hour time,
    day_time varchar(20),
    soft_delete bool default false
);

create table if not exists modules(
    module_id int auto_increment primary key,
    module_number int,
    course_id int,
    module_name varchar(50),
    soft_delete bool default false,
    foreign key (course_id) references courses(course_id)
);

create table if not exists course_periods(
    course_id int,
    period_id int,
    soft_delete bool default false,
    primary key (course_id, period_id),
    foreign key (course_id) references courses(course_id),
    foreign key (period_id) references periods(period_id)
);

create table if not exists class_info(
    class_id int auto_increment primary key,
    subject_id int,
    period_id int,
    week_day int,
    teacher_id int,
    course_id int,
    module_id int,
    location_id int,
    bucket varchar(255),
    soft_delete bool default false,
    foreign key (teacher_id) references users(user_id),
    foreign key (subject_id) references subjects(subject_id),
    foreign key (period_id) references periods(period_id),
    foreign key (course_id) references courses(course_id),
    foreign key (module_id) references modules(module_id),
    foreign key (location_id) references locations(location_id)
);

create table if not exists students(
    student_id int auto_increment primary key,
    course_id int,
    user_id int,
	module_id int,
    soft_delete bool default false,
    foreign key (course_id) references courses(course_id),
    foreign key (user_id) references users(user_id),
    foreign key (module_id) references modules(module_id)
);

create table if not exists verification_codes(
    id int auto_increment primary key,
    code varchar(10) not null,
    user_id int not null,
    foreign key (user_id) references users(user_id)
);

insert into buildings (building_name, description) values 
('Building A', 'Main administrative building'),
('Building B', 'Science and Technology'),
('Building C', 'Library and Study Rooms');

insert into location_types (type_name, description) values 
('Classroom', 'Room used for teaching classes'),
('Laboratory', 'Room equipped for experiments and research'),
('Office', 'Room used for administrative purposes');

insert into locations (campus, building_id, floor_number, location_type_id, location_name, description) values 
('Main Campus', 1, 1, 1, 'Room 101', 'Main Classroom'),
('Main Campus', 2, 2, 2, 'Lab 202', 'Computer Science Lab'),
('Main Campus', 3, 3, 3, 'Office 301', 'Administration Office');

insert into users (first_name, last_name, nick_name, email, password_hash, user_type, photo_id) values 
('John', 'Doe', 'Dudo', 'johndoe@example.com', 'HASHPASS', 'STUDENT', 'link-photo_1'),
('Jane', 'Smith', 'Jsmith', 'janesmith@example.com', 'HASHPASS', 'TEACHER', 'link-photo_2'),
('Marcos', 'Costa', 'Marcao', 'marcos@example.com', 'HASHPASS', 'ADMINISTRATOR', 'link-photo_3'),
('Albert', 'Einstein', 'Beto', 'albert@example.com', 'HASHPASS', 'STUDENT', 'link-photo_4'),
('Nikola', 'Tesla', 'Nicolas', 'nikolas@example.com', 'HASHPASS', 'STUDENT', 'link-photo_5'),
('José', 'da Silva', 'Zé', 'estudante@gmail.com', 'HASHPASS', 'STUDENT', 'link232'),
('João', 'da Silva', 'Jão', 'professor@gmail.com', 'HASHPASS', 'TEACHER', 'link232')

insert into courses (course_name, coordinator_id) values 
('Computer Science', 3),
('Business Administration', 3),
('Mechanical Engineering', 3);

insert into modules (course_id, module_number, module_name) values 
(1, 1, 'M1'),
(1, 2, 'M2'),
(2, 1, 'M1');

insert into subjects (subject_name, course_id) values 
('Programming 101', 1),
('Business Law', 2),
('Thermodynamics', 3);

insert into periods (start_hour, end_hour, day_time) values 
('08:00:00', '12:00:00', 'Morning'),
('13:00:00', '17:00:00', 'Afternoon'),
('18:00:00', '22:00:00', 'Evening');

insert into course_periods (course_id, period_id) values 
(1, 1),
(2, 2),
(3, 3);

insert into class_info (subject_id, period_id, week_day, teacher_id, course_id, module_id, location_id, bucket) values
(2, 1, 2, 2, 1, 1, 2, 'class/1/1/1728335520514'),
(3, 1, 2, 1, 1, 1, 2, 'class/2/1/1729377180853'),
(1, 3, 1, 3, 1, 1, 2, 'class/1/1/1729607863992');

insert into students (course_id ,user_id ,module_id) values 
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(1, 6, 2);

insert into verification_codes (code, user_id) values 
('ABC123SP', 1),
('DEF456SP', 1),
('GHI789SP', 1);
