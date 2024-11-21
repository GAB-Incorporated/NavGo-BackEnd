create database if not exists navgo_db;

use navgo_db;

create table if not exists buildings(
    building_id int
    auto_increment primary key,
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

INSERT INTO locations (campus, building_id, floor_number, location_type_id, location_name, description, coordinates) VALUES
('Main Campus', 1, 0, 3, 'Térreo', 'Térreo da Instituição',
    JSON_ARRAY(JSON_ARRAY(0, 0), JSON_ARRAY(72, 0), JSON_ARRAY(72, 20), JSON_ARRAY(0, 20))),

('Main Campus', 1, 0, 3, 'Biblioteca', 'Informações sobre a biblioteca', 
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

('Main Campus', 1, 1, 3, 'Primeiro Andar', '1º Andar da Instituição.', 
    JSON_ARRAY(JSON_ARRAY(0, 0), JSON_ARRAY(72, 0), JSON_ARRAY(72, 20), JSON_ARRAY(0, 20))),

('Main Campus', 1, 1, 2, 'Laboratório 1', 'Laboratório de informática.', 
    JSON_ARRAY(JSON_ARRAY(67, 8), JSON_ARRAY(65, 8), JSON_ARRAY(65, 10), JSON_ARRAY(72, 10), JSON_ARRAY(72, 0), JSON_ARRAY(67, 0))),

('Main Campus', 1, 1, 2, 'Laboratório de Gestão', 'Laboratório destinado a alunos do curso de Recursos Humanos.', 
    JSON_ARRAY(JSON_ARRAY(66, 12), JSON_ARRAY(65, 12), JSON_ARRAY(65, 10), JSON_ARRAY(72, 10), JSON_ARRAY(72, 20), JSON_ARRAY(67, 20), JSON_ARRAY(67, 12))),

('Main Campus', 1, 1, 2, 'Laboratório 4', 'Informações sobre o laboratório 4.', 
    JSON_ARRAY(JSON_ARRAY(67, 12), JSON_ARRAY(67, 20), JSON_ARRAY(59, 20), JSON_ARRAY(59, 12))),

('Main Campus', 1, 1, 2, 'Laboratório 3', 'Informações sobre o Laboratório 3.', 
    JSON_ARRAY(JSON_ARRAY(59, 0), JSON_ARRAY(67, 0), JSON_ARRAY(67, 8), JSON_ARRAY(59, 8))),

('Main Campus', 1, 1, 2, 'Lab 07', 'Laboratório 07.', 
    JSON_ARRAY(JSON_ARRAY(59, 12), JSON_ARRAY(59, 20), JSON_ARRAY(52, 20), JSON_ARRAY(52, 12))),

('Main Campus', 1, 1, 2, 'Lab 07 Corner', 'Quarto de círculo do Laboratório 07.', 
    JSON_ARRAY(JSON_ARRAY(54, 16), JSON_ARRAY(54, 20), JSON_ARRAY(52, 20), JSON_ARRAY(52, 16))),

('Main Campus', 1, 1, 3, 'Sala dos professores', 'Sala dos professores', 
    JSON_ARRAY(JSON_ARRAY(52, 12), JSON_ARRAY(52, 20), JSON_ARRAY(45, 20), JSON_ARRAY(45, 12))),

('Main Campus', 1, 1, 3, 'Escada à esquerda - 1º Andar', 'Escada para o térreo e para o segundo andar.', 
    JSON_ARRAY(JSON_ARRAY(57, 4), JSON_ARRAY(59, 4), JSON_ARRAY(59, 8), JSON_ARRAY(57, 8))),

('Main Campus', 1, 1, 3, 'Escada à esquerda - 1º Andar', 'Escada para o térreo e para o segundo andar.', 
    JSON_ARRAY(JSON_ARRAY(56, 4), JSON_ARRAY(54, 4), JSON_ARRAY(54, 8), JSON_ARRAY(56, 8))),

('Main Campus', 1, 1, 3, 'Escada à esquerda - 1º Andar', 'Escada para o térreo e para o segundo andar.', 
    JSON_ARRAY(JSON_ARRAY(54, 2), JSON_ARRAY(59, 2), JSON_ARRAY(59, 4), JSON_ARRAY(54, 4))),

('Main Campus', 1, 1, 3, 'Degraus da Escada', 'Degraus de acesso para o próximo andar.', 
    JSON_ARRAY(JSON_ARRAY(54, 5), JSON_ARRAY(56, 5), JSON_ARRAY(56, 4), JSON_ARRAY(57, 4), JSON_ARRAY(57, 5), JSON_ARRAY(59, 5), JSON_ARRAY(57, 5), JSON_ARRAY(57, 6), JSON_ARRAY(59, 6), JSON_ARRAY(59, 7), JSON_ARRAY(57, 7), JSON_ARRAY(57, 7), JSON_ARRAY(57, 4), JSON_ARRAY(56, 4), JSON_ARRAY(56, 6), JSON_ARRAY(54, 6), JSON_ARRAY(55, 6), JSON_ARRAY(56, 6), JSON_ARRAY(56, 7), JSON_ARRAY(54, 7))),

('Main Campus', 1, 0, 3, 'Escada Térreo', 'Escada para o primeiro andar.', 
JSON_ARRAY(JSON_ARRAY(57, 4), JSON_ARRAY(59, 4), JSON_ARRAY(59, 8), JSON_ARRAY(57, 8))),

('Main Campus', 1, 0, 3, 'Escada Térreo', 'Escada para o primeiro andar.', 
    JSON_ARRAY(JSON_ARRAY(56, 4), JSON_ARRAY(54, 4), JSON_ARRAY(54, 8), JSON_ARRAY(56, 8))),

('Main Campus', 1, 0, 3, 'Escada Térreo', 'Escada para o primeiro andar.', 
    JSON_ARRAY(JSON_ARRAY(54, 2), JSON_ARRAY(59, 2), JSON_ARRAY(59, 4), JSON_ARRAY(54, 4))),

('Main Campus', 1, 0, 3, 'Degraus da Escada à esquerda', 'Degraus de acesso para o próximo andar.', 
JSON_ARRAY(JSON_ARRAY(54, 5), JSON_ARRAY(56, 5), JSON_ARRAY(56, 4), JSON_ARRAY(57, 4), JSON_ARRAY(57, 5), JSON_ARRAY(59, 5), JSON_ARRAY(57, 5), JSON_ARRAY(57, 6), JSON_ARRAY(59, 6), JSON_ARRAY(59, 7), JSON_ARRAY(57, 7), JSON_ARRAY(57, 7), JSON_ARRAY(57, 4), JSON_ARRAY(56, 4), JSON_ARRAY(56, 6), JSON_ARRAY(54, 6), JSON_ARRAY(55, 6), JSON_ARRAY(56, 6), JSON_ARRAY(56, 7), JSON_ARRAY(54, 7))),

('Main Campus', 1, 1, 2, 'Laboratório de Redes de Computadores', 'Laboratório dedicado a estudos e práticas em redes de computadores, equipado com dispositivos e recursos para simulação e configuração de redes.', 
JSON_ARRAY(JSON_ARRAY(0, 0), JSON_ARRAY(11.5, 0), JSON_ARRAY(11.5, 8), JSON_ARRAY(0, 8))),
    
('Main Campus', 1, 1, 2, 'Laboratório de Análises Microbiológicas', 'Laboratório focado em estudos microbiológicos e práticas científicas, com equipamentos para análises de microrganismos.', 
JSON_ARRAY(JSON_ARRAY(11.5, 12), JSON_ARRAY(11.5, 20), JSON_ARRAY(0, 20), JSON_ARRAY(0, 12))),
    
('Main Campus', 1, 1, 2, 'Laboratório 2', 'Laboratório de Informática', 
JSON_ARRAY(JSON_ARRAY(23, 12), JSON_ARRAY(23, 20), JSON_ARRAY(11.5, 20), JSON_ARRAY(11.5, 12))),
    
('Main Campus', 1, 1, 2, 'Laboratório 6', 'Laboratório de Informática', 
JSON_ARRAY(JSON_ARRAY(11.5, 0), JSON_ARRAY(11.5, 8), JSON_ARRAY(23, 8), JSON_ARRAY(23, 0))),

('Main Campus', 1, 1, 3, 'Banheiro Masculino', 'Informações sobre o banheiro masculino.', 
JSON_ARRAY(JSON_ARRAY(33, 12), JSON_ARRAY(33, 20), JSON_ARRAY(28, 20), JSON_ARRAY(28, 12))),
    
('Main Campus', 1, 1, 3, 'Banheiro Feminino', 'Informações sobre o banheiro feminino.', 
JSON_ARRAY(JSON_ARRAY(28, 12), JSON_ARRAY(28, 20), JSON_ARRAY(23, 20), JSON_ARRAY(23, 12))),
    
('Main Campus', 1, 1, 2, 'Laboratório de Eletroeletrônica', 'Laboratório de Eletrônica digital e microprocessadores.', 
JSON_ARRAY(JSON_ARRAY(40, 0), JSON_ARRAY(40, 8), JSON_ARRAY(28, 8), JSON_ARRAY(28, 0))),
    
('Main Campus', 1, 1, 2, 'Laboratório 05', 'Laboratório de Informática', 
JSON_ARRAY(JSON_ARRAY(52, 0), JSON_ARRAY(52, 8), JSON_ARRAY(40, 8), JSON_ARRAY(40, 0))),
    
('Main Campus', 1, 1, 2, 'Laboratório de Automação', 'Laboratório de Máquinas Elétricas e Automação.', 
JSON_ARRAY(JSON_ARRAY(45, 20), JSON_ARRAY(45, 12), JSON_ARRAY(33, 12), JSON_ARRAY(33, 20))),
    
('Main Campus', 1, 1, 3, 'Elevador', 'Elevador para todos os andares.', 
JSON_ARRAY(JSON_ARRAY(54, 3), JSON_ARRAY(54, 7), JSON_ARRAY(52, 7), JSON_ARRAY(52, 3))),

('Main Campus', 1, 1, 3, 'Escada à Direita - Andar 1', 'Escada para o térreo e para o segundo andar.',
JSON_ARRAY(JSON_ARRAY(23, 4), JSON_ARRAY(25, 4), JSON_ARRAY(25, 8), JSON_ARRAY(23, 8))),

('Main Campus', 1, 1, 3, 'Escada à Direita - Andar 1', 'Escada para o térreo e para o segundo andar.', 
JSON_ARRAY(JSON_ARRAY(23, 2), JSON_ARRAY(28, 2), JSON_ARRAY(28, 4), JSON_ARRAY(23, 4))),

('Main Campus', 1, 1, 3, 'Escada à Direita - Andar 1', 'Escada para o térreo e para o segundo andar.', 
JSON_ARRAY(JSON_ARRAY(28, 4), JSON_ARRAY(26, 4), JSON_ARRAY(26, 8), JSON_ARRAY(28, 8))),

('Main Campus', 1, 1, 3, 'Degraus da Escada à Direita', 'Degraus de acesso para o próximo andar.', 
JSON_ARRAY(JSON_ARRAY(23, 5), JSON_ARRAY(25, 5), JSON_ARRAY(25, 4), JSON_ARRAY(26, 4), JSON_ARRAY(26, 5), JSON_ARRAY(28, 5), JSON_ARRAY(26, 5), JSON_ARRAY(26, 6), JSON_ARRAY(28, 6), JSON_ARRAY(28, 7), JSON_ARRAY(26, 7), JSON_ARRAY(26, 7), JSON_ARRAY(26, 4), JSON_ARRAY(25, 4), JSON_ARRAY(25, 6), JSON_ARRAY(23, 6), JSON_ARRAY(24, 6), JSON_ARRAY(25, 6), JSON_ARRAY(25, 7), JSON_ARRAY(23, 7)));

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
(1, 1, 57, 11, 'Laboratório 7', 'regular'),
(1, 1, 50, 11, 'Sala dos Professores', 'regular'),
(1, 1, 11, 11, 'Laboratório 6', 'regular'),
(1, 1, 11, 9, 'Laboratório 2', 'regular'),
(1, 1, 8, 11, 'Laboratório de Química', 'regular'),
(1, 1, 8, 9, 'Laboratório de Redes', 'regular');

insert into users (first_name, last_name, nick_name, email, password_hash, user_type, photo_id) values 
('John', 'Doe', 'Dudo', 'johndoe@example.com', 'HASHPASS', 'STUDENT', 'link-photo_1'),
('Jane', 'Smith', 'Jsmith', 'janesmith@example.com', 'HASHPASS', 'TEACHER', 'link-photo_2'),
('Marcos', 'Costa', 'Marcão', 'marcos@example.com', 'HASHPASS', 'ADMINISTRATOR', 'link-photo_3'),
('Albert', 'Einstein', 'Beto', 'albert@example.com', 'HASHPASS', 'STUDENT', 'link-photo_4'),
('Nikola', 'Tesla', 'Nicolas', 'nikolas@example.com', 'HASHPASS', 'STUDENT', 'link-photo_5'),
('José', 'da Silva', 'Zé', 'estudante@gmail.com', 'HASHPASS', 'STUDENT', 'link232'),
('João', 'da Silva', 'Jão', 'professor@gmail.com', 'HASHPASS', 'TEACHER', 'link232'),
('Irineu', 'dos Santos', 'Iri', 'irineu@gmail.com', 'HASHPASS', 'STUDENT', 'link232'),
('Roberto', 'Carlos', 'Betinho', 'robertao@gmail.com', 'HASHPASS', 'STUDENT', 'link232'),
('Valesca', 'Popozuda', 'Valéria', 'valesca@gmail.com', 'HASHPASS', 'STUDENT', 'link232'),
('Rodrigo', 'Faro', 'Gatinho', 'dancagatinho@gmail.com', 'HASHPASS', 'STUDENT', 'link232'),
('Rodolfo', 'Tavares', 'Rolfinho', 'rodolfinho@gmail.com', 'HASHPASS', 'STUDENT', 'link232'),
('Mario', 'Bros', 'Mario', 'mario@gmail.com', 'HASHPASS', 'STUDENT', 'link232'),
('Prof', 'Linguiça', 'Girafales', 'linguicaexample.com', 'HASHPASS', 'TEACHER', 'link-photo_2'),
('Maestro', 'Linguiço', 'Girafales', 'linguico@example.com', 'HASHPASS', 'TEACHER', 'link-photo_2'),
('Pau', 'de Sebo', 'Girafales', 'paudesebo@example.com', 'HASHPASS', 'TEACHER', 'link-photo_2'),
('Mangueira', 'de Bombeiro', 'Girafales', 'bombeira@example.com', 'HASHPASS', 'TEACHER', 'link-photo_2'),
('Espaguete', 'Cru', 'Girafales', 'espaguetao@example.com', 'HASHPASS', 'TEACHER', 'link-photo_2'),
('Padastro', 'do Kiko', 'Girafales', 'paidoano@example.com', 'HASHPASS', 'TEACHER', 'link-photo_2'),
('Marie', 'Curie', 'MarieC', 'mariecurie@example.com', 'HASHPASS', 'STUDENT', 'link-photo_6'),
('Leonardo', 'da Vinci', 'Leo', 'leonardo@example.com', 'HASHPASS', 'STUDENT', 'link-photo_7'),
('Galileo', 'Galilei', 'Gal', 'galileo@example.com', 'HASHPASS', 'STUDENT', 'link-photo_8'),
('Ada', 'Lovelace', 'Ada', 'adalovelace@example.com', 'HASHPASS', 'STUDENT', 'link-photo_9'),
('Isaac', 'Newton', 'Newt', 'isaacnewton@example.com', 'HASHPASS', 'STUDENT', 'link-photo_10'),
('Rosa', 'Parks', 'Rosa', 'rosaparks@example.com', 'HASHPASS', 'STUDENT', 'link-photo_11'),
('Mahatma', 'Gandhi', 'Mahatma', 'gandhi@example.com', 'HASHPASS', 'STUDENT', 'link-photo_12'),
('Nelson', 'Mandela', 'Nelson', 'nelsonmandela@example.com', 'HASHPASS', 'STUDENT', 'link-photo_13'),
('Joan', 'of Arc', 'Joan', 'joanofarc@example.com', 'HASHPASS', 'STUDENT', 'link-photo_14'),
('Florence', 'Nightingale', 'Flo', 'florence@example.com', 'HASHPASS', 'STUDENT', 'link-photo_15');

insert into courses (course_name, coordinator_id) values 
('Desenvolvimento de sistemas', 3),
('Administração', 7),
('Eletroeletrônica', 2);

insert into modules (course_id, module_number, module_name) values 
(1, 1, 'M1'),
(1, 2, 'M2'),
(1, 3, 'M3'),
(2, 4, 'M1'),
(2, 5, 'M2'),
(2, 6, 'M3'),
(3, 7, 'M1'),
(3, 8, 'M2'),
(3, 9, 'M3');

insert into subjects (subject_name, course_id) values 
('Programação Web', 1),
('Algoritmos', 1),
('Design', 1),
('Logistica Empresárial', 2),
('Matemática Financeira', 2),
('Sistemas Embarcados', 3),
('Desenho Técnico', 3);

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
(1, 3, 1, 3, 1, 1, 2, 'class/1/1/1729607863992'),
(4, 1, 2, 14, 2, 1, 2, 'class/4/2/1731950417734'),
(5, 1, 2, 15, 2, 1, 2, 'class/4/2/1731950579937'),
(6, 1, 2, 15, 3, 1, 2, 'class/6/2/1731950682513'),
(7, 1, 2, 16, 3, 1, 2, 'class/7/2/1731950750611');

insert into students (course_id, user_id, module_id) values 
(1, 1, 1), -- John Doe
(1, 4, 2), -- Albert Einstein
(1, 20, 3), -- Marie Curie
(1, 21, 1), -- Leonardo da Vinci
(1, 22, 2), -- Galileo Galilei
(1, 23, 3), -- Ada Lovelace

(2, 5, 4), -- Nikola Tesla
(2, 26, 5), -- Isaac Newton
(2, 27, 6), -- Rosa Parks
(2, 28, 5), -- Mahatma Gandhi
(2, 27, 4), -- Nelson Mandela
(2, 28, 6), -- Joan of Arc

(3, 15, 7), -- Florence Nightingale
(3, 4, 8),  -- Albert Einstein (repetido)
(3, 20, 9),  -- Marie Curie (repetido)
(3, 22, 7),  -- Galileo Galilei (repetido)
(3, 27, 8), -- Nelson Mandela (repetido)
(3, 29, 9),  -- Ada Lovelace (repetido)

(1, 6, 2); -- Usuário teste (estudante@gmail.com)

insert into verification_codes (code, user_id) values 
('ABC123SP', 1),
('DEF456SP', 1),
('GHI789SP', 1);
