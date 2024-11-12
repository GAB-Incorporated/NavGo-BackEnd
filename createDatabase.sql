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

create table if not exists nodes (
    node_id int auto_increment primary key,
    building_id INT,
    floor_number INT,
    x DECIMAL(10, 8),
    y DECIMAL(10, 8),
    description VARCHAR(100),
    node_type ENUM('regular', 'stair') default 'regular',
    foreign key (building_id) references buildings(building_id)
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

-- INSERT INTO locations (campus, building_id, floor_number, location_type_id, location_name, description, coordinates) VALUES
-- ('Main Campus', 1, 0, 3, 'Area da Instituição', 'The area of the institution', 
--     JSON_ARRAY(JSON_ARRAY(-23.641745, -46.836244), JSON_ARRAY(-23.641423, -46.836757), JSON_ARRAY(-23.640949, -46.836323), JSON_ARRAY(-23.640958, -46.836029), JSON_ARRAY(-23.641084, -46.835416))),
-- ('Main Campus', 1, 0, 3, 'Main Building', 'The main building of ETEC', 
--     JSON_ARRAY(JSON_ARRAY(-23.641008, -46.836329), JSON_ARRAY(-23.641190, -46.836365), JSON_ARRAY(-23.641292, -46.835695), JSON_ARRAY(-23.641119, -46.835665))),
-- ('Main Campus', 1, 0, 3, 'Main Entrance', 'The main entrance hallway', 
--     JSON_ARRAY(JSON_ARRAY(-23.6415495, -46.835993), JSON_ARRAY(-23.641523, -46.836090), JSON_ARRAY(-23.641453, -46.836110), JSON_ARRAY(-23.641361, -46.836120), JSON_ARRAY(-23.641303, -46.836173), JSON_ARRAY(-23.641239, -46.836469))),
-- ('Main Campus', 1, 0, 3, 'Biblioteca', 'A biblioteca da etec, onde está disponível diversos livros, trabalhos de conclusão de cursos anteriores e computadores para acesso a internet', 
--     JSON_ARRAY(JSON_ARRAY(72, 8), JSON_ARRAY(72, 20), JSON_ARRAY(64, 20), JSON_ARRAY(64, 8))),
-- ('Main Campus', 1, 0, 3, 'CPD', 'Sala do suporte técnico da escola', 
--     JSON_ARRAY(JSON_ARRAY(72, 0), JSON_ARRAY(72, 8), JSON_ARRAY(61, 8), JSON_ARRAY(61, 0))),
-- ('Main Campus', 1, 0, 3, 'Secretaria', 'Secretaria e corpo adminsitrativo da escola, aqui você pode tirar dúvidas especifícas e verificar o estado dos seus cartões de ônibus escolares', 
--     JSON_ARRAY(JSON_ARRAY(64, 13), JSON_ARRAY(64, 20), JSON_ARRAY(52, 20), JSON_ARRAY(52, 13))),
-- ('Main Campus', 1, 0, 3, 'Diretoria', 'Sala exclusiva para a diretoria', 
--     JSON_ARRAY(JSON_ARRAY(52, 13), JSON_ARRAY(52, 20), JSON_ARRAY(46, 20), JSON_ARRAY(46, 13))),
-- ('Main Campus', 1, 0, 3, 'Cozinha', 'Sala exclusiva para a cozinha', 
--     JSON_ARRAY(JSON_ARRAY(46, 13), JSON_ARRAY(46, 20), JSON_ARRAY(38, 20), JSON_ARRAY(38, 13))),
-- ('Main Campus', 1, 0, 3, 'Laboratório Maker', 'Laboratório com notebooks, impressora 3d e equipado para aulas de sistemas embarcados', 
--     JSON_ARRAY(JSON_ARRAY(20, 14), JSON_ARRAY(10, 14), JSON_ARRAY(10, 20), JSON_ARRAY(20, 20))),
-- ('Main Campus', 1, 0, 3, 'Auditório', 'Auditório para palestras e apresentações', 
--     JSON_ARRAY(JSON_ARRAY(0, 14), JSON_ARRAY(10, 14), JSON_ARRAY(10, 20), JSON_ARRAY(0, 20))),
-- ('Main Campus', 1, 1, 2, 'Laboratório 1', 'Laboratório equipado para aulas com computadores', 
--     JSON_ARRAY(JSON_ARRAY(2, 0), JSON_ARRAY(10, 0), JSON_ARRAY(10, 6), JSON_ARRAY(2, 6))),
-- ('Main Campus', 1, 1, 2, 'Laboratório 2', 'Laboratório equipado para aulas com computadores', 
--     JSON_ARRAY(JSON_ARRAY(60, 0), JSON_ARRAY(68, 0), JSON_ARRAY(68, 6), JSON_ARRAY(60, 6))),
-- ('Main Campus', 1, 0, 2, 'Pátio', 'Pátio da escola', 
--     JSON_ARRAY(JSON_ARRAY(0,0), JSON_ARRAY(72, 0), JSON_ARRAY(72, 20), JSON_ARRAY(0, 20)));

INSERT INTO locations (campus, building_id, floor_number, location_type_id, location_name, description, coordinates) VALUES
('Main Campus', 1, 0, 3, 'Térreo', 'Térreo da Instituição', 
    JSON_ARRAY(JSON_ARRAY(0,0), JSON_ARRAY(72, 0), JSON_ARRAY(72, 20), JSON_ARRAY(0, 20))),
('Main Campus', 1, 0, 3, 'Escada 1º Andar', 'Escada para o térreo e para o segundo andar.', 
    JSON_ARRAY(JSON_ARRAY(55, 2), JSON_ARRAY(59, 2), JSON_ARRAY(59, 8), JSON_ARRAY(55, 8))),
('Main Campus', 1, 0, 3, 'Linha Escada 1º Andar', 'Linha da escada para o térreo e para o segundo andar.', 
    JSON_ARRAY(JSON_ARRAY(57, 8), JSON_ARRAY(57, 2))),
('Main Campus', 1, 0, 3, 'Biblioteca', 'Informações sobre a biblioteca e como chegar lá.', 
    JSON_ARRAY(JSON_ARRAY(72, 8), JSON_ARRAY(72, 20), JSON_ARRAY(64, 20), JSON_ARRAY(64, 8))),
('Main Campus', 1, 0, 3, 'CPD', 'Informações sobre o CPD.', 
    JSON_ARRAY(JSON_ARRAY(72, 0), JSON_ARRAY(72, 8), JSON_ARRAY(59, 8), JSON_ARRAY(59, 0))),
('Main Campus', 1, 0, 3, 'Secretaria', 'Informações sobre a secretaria.', 
    JSON_ARRAY(JSON_ARRAY(64, 13), JSON_ARRAY(64, 20), JSON_ARRAY(53, 20), JSON_ARRAY(53, 13))),
('Main Campus', 1, 0, 3, 'Diretoria', 'Informações sobre a diretoria.', 
    JSON_ARRAY(JSON_ARRAY(53, 13), JSON_ARRAY(53, 20), JSON_ARRAY(44, 20), JSON_ARRAY(44, 13))),
('Main Campus', 1, 0, 3, 'Cozinha', 'Informações sobre a cozinha.', 
    JSON_ARRAY(JSON_ARRAY(44, 13), JSON_ARRAY(44, 20), JSON_ARRAY(34, 20), JSON_ARRAY(34, 13))),
('Main Campus', 1, 0, 3, 'Banheiro Masculino', 'Informações sobre o banheiro masculino.', 
    JSON_ARRAY(JSON_ARRAY(34, 13), JSON_ARRAY(34, 20), JSON_ARRAY(27, 20), JSON_ARRAY(27, 13))),
('Main Campus', 1, 0, 3, 'Banheiro Feminino', 'Informações sobre o banheiro feminino.', 
    JSON_ARRAY(JSON_ARRAY(27, 13), JSON_ARRAY(27, 20), JSON_ARRAY(20, 20), JSON_ARRAY(20, 13))),
('Main Campus', 1, 0, 3, 'Laboratório Maker', 'Informações sobre o laboratório maker.', 
    JSON_ARRAY(JSON_ARRAY(20, 13), JSON_ARRAY(10, 13), JSON_ARRAY(10, 20), JSON_ARRAY(20, 20))),
('Main Campus', 1, 0, 3, 'Auditório', 'Informações sobre o auditório.', 
    JSON_ARRAY(JSON_ARRAY(0, 13), JSON_ARRAY(10, 13), JSON_ARRAY(10, 20), JSON_ARRAY(0, 20))),
('Main Campus', 1, 0, 3, 'Cafeteria', 'Informações sobre a cafeteria.', 
    JSON_ARRAY(JSON_ARRAY(0, 0), JSON_ARRAY(12, 0), JSON_ARRAY(12, 8), JSON_ARRAY(0, 8))),
('Main Campus', 1, 1, 3, 'Second Floor', '1º Andar da Instituição', 
    JSON_ARRAY(JSON_ARRAY(0, 0), JSON_ARRAY(72, 0), JSON_ARRAY(72, 20), JSON_ARRAY(0, 20))),
('Main Campus', 1, 1, 3, 'Escada 2º Andar', 'Escada para o térreo e para o segundo andar.', 
    JSON_ARRAY(JSON_ARRAY(55, 2), JSON_ARRAY(59, 2), JSON_ARRAY(59, 8), JSON_ARRAY(55, 8))),
('Main Campus', 1, 1, 3, 'Linha Escada 2º Andar', 'Linha da escada para o térreo e para o segundo andar.', 
    JSON_ARRAY(JSON_ARRAY(57, 8), JSON_ARRAY(57, 2))),
('Main Campus', 1, 1, 2, 'Laboratório 6', 'Informações sobre o Laboratório 6.', 
    JSON_ARRAY(JSON_ARRAY(2, 0), JSON_ARRAY(10, 0), JSON_ARRAY(10, 6), JSON_ARRAY(2, 6))),
('Main Campus', 1, 1, 2, 'Laboratório 1', 'O melhor lab.', 
    JSON_ARRAY(JSON_ARRAY(67, 8), JSON_ARRAY(65, 8), JSON_ARRAY(65, 10), JSON_ARRAY(72, 10), JSON_ARRAY(72, 0), JSON_ARRAY(67, 0))),
('Main Campus', 1, 1, 2, 'Laboratório 4', 'Laboratório 4.', 
    JSON_ARRAY(JSON_ARRAY(66, 12), JSON_ARRAY(65, 12), JSON_ARRAY(65, 10), JSON_ARRAY(72, 10), JSON_ARRAY(72, 20), JSON_ARRAY(67, 20), JSON_ARRAY(67, 12))),
('Main Campus', 1, 1, 2, 'Laboratório 5', 'Laboratório 5.', 
    JSON_ARRAY(JSON_ARRAY(67, 12), JSON_ARRAY(67, 20), JSON_ARRAY(59, 20), JSON_ARRAY(59, 12))),
('Main Campus', 1, 1, 2, 'Laboratório 3', 'Informações sobre o Laboratório 3.', 
    JSON_ARRAY(JSON_ARRAY(59, 0), JSON_ARRAY(67, 0), JSON_ARRAY(67, 8), JSON_ARRAY(59, 8))),
('Main Campus', 1, 1, 2, 'Lab 07', 'Laboratório 07.', 
    JSON_ARRAY(JSON_ARRAY(59, 12), JSON_ARRAY(59, 20), JSON_ARRAY(52, 20), JSON_ARRAY(52, 12))),
('Main Campus', 1, 1, 2, 'Lab 07 Corner', 'Quarto de círculo do Laboratório 07.', 
    JSON_ARRAY(JSON_ARRAY(54, 16), JSON_ARRAY(54, 20), JSON_ARRAY(52, 20), JSON_ARRAY(52, 16)));

INSERT INTO nodes (building_id, floor_number, x, y, description, node_type) VALUES
(1, 0, 26, 2, 'Entrada Principal', 'regular'),
(1, 0, 2, 12, 'Auditório', 'regular'),
(1, 0, 13, 12, 'Laboratório Maker', 'regular'),
(1, 0, 23, 12, 'Banheiro Feminino', 'regular'),
(1, 0, 30, 12, 'Banheiro Masculino', 'regular'),
(1, 0, 36, 12, 'Cozinha', 'regular'),
(1, 0, 46, 12, 'Diretoria', 'regular'),
(1, 0, 55, 12, 'Secretaria', 'regular'),
(1, 0, 64, 11, 'Biblioteca', 'regular'),
(1, 0, 61, 9, 'RH e CPD', 'regular'),
(1, 0, 57, 8, 'Escadas', 'stair'),
(1, 1, 57, 8, 'Escadas', 'stair'),
(1, 0, 3, 9, 'Cafeteria', 'regular'),
(1, 0, 36, 1, 'Refeitório', 'regular'),
(1, 0, 13, 1, 'Refeitório Ala-direita', 'regular'),
(1, 0, 46, 1, 'Refeitório Ala-esquerda', 'regular'),
(1, 1, 61, 9, 'Laboratório 3', 'regular'),
(1, 1, 61, 9, 'Laboratório 1', 'regular'),
(1, 1, 64, 11, 'Laboratório 4', 'regular'),
(1, 1, 64, 11, 'Laboratório 5', 'regular'),
(1, 1, 57, 9, 'Laboratório 7', 'regular');

insert into users (first_name, last_name, nick_name, email, password_hash, user_type, photo_id) values 
('John', 'Doe', 'Dudo', 'johndoe@example.com', 'HASHPASS', 'STUDENT', 'link-photo_1'),
('Jane', 'Smith', 'Jsmith', 'janesmith@example.com', 'HASHPASS', 'TEACHER', 'link-photo_2'),
('Marcos', 'Costa', 'Marcao', 'marcos@example.com', 'HASHPASS', 'ADMINISTRATOR', 'link-photo_3'),
('Albert', 'Einstein', 'Beto', 'albert@example.com', 'HASHPASS', 'STUDENT', 'link-photo_4'),
('Nikola', 'Tesla', 'Nicolas', 'nikolas@example.com', 'HASHPASS', 'STUDENT', 'link-photo_5'),
('José', 'da Silva', 'Zé', 'estudante@gmail.com', 'HASHPASS', 'STUDENT', 'link232'),
('João', 'da Silva', 'Jão', 'professor@gmail.com', 'HASHPASS', 'TEACHER', 'link232');

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
(1, 6, 2),
(1, 7, 2);

insert into verification_codes (code, user_id) values 
('ABC123SP', 1),
('DEF456SP', 1),
('GHI789SP', 1);
