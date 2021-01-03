DROP DATABASE IF EXISTS `sql_derech_haketzev`;
CREATE DATABASE `sql_derech_haketzev`; 
USE `sql_derech_haketzev`;

SET NAMES utf8;
SET character_set_client = utf8mb4;

CREATE TABLE `locations` (
  `loc_id` tinyint UNSIGNED NOT NULL AUTO_INCREMENT,
  `loc_name` varchar(50) NOT NULL,
  `loc_address` varchar(100) NOT NULL,
  PRIMARY KEY (`loc_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `locations`
VALUES
  (1,'בית המתופפים','הזמיר, קריית אונו'),
  (2,'אולם סופרט עלומים','הכפר 1, קריית אונו'),
  (3,'בי"ס ורשה','נחל גמלא 10, קריית אונו'),
  (4,'בי"ס שז"ר','הנוטרים 11, הרצליה'),
  (5,'בהופעה','משתנה'),
  (6,'חוץ','משתנה');

CREATE TABLE `equipment_types` (
  `eqt_id` tinyint UNSIGNED NOT NULL AUTO_INCREMENT,
  `eqt_name` varchar(50) NOT NULL,
  `eqt_matterial` varchar(50),
  PRIMARY KEY (`eqt_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `equipment_types`
VALUES
  (1,'פחים','פלסטיק'),
  (2,'פחי מתכת','מתכת'),
  (3,'מקלות','עץ'),
  (4,'תופים אפריקאים','משתנה'),
  (5,'תופים שונים','משתנה'),
  (6,'פקקים','פלסטיק'),
  (7,'שונות','משתנה');

CREATE TABLE `equipment` (
  `equ_id` tinyint UNSIGNED NOT NULL AUTO_INCREMENT,
  `equ_name` varchar(50) NOT NULL,
  `equ_type` tinyint UNSIGNED,
  `equ_colors` set('לבן','שחור','כחול','אדום','צהוב','ירוק','אפור','ורוד','תכלת','כתום','זהב','עץ'),
  `equ_specs` varchar(100),
  `equ_notes` tinytext,
  PRIMARY KEY (`equ_id`),
  FOREIGN KEY (`equ_type`) REFERENCES `equipment_types` (`eqt_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `equipment`
VALUES
  (1,'פח 18 לבן',1,'לבן','36.3 h * 30.4 d',null),
  (2,'תוף מרים גדול',5,'עץ,לבן','6 h * 28.5 d',null),
  (3,'אמבטיה קטנה',7,'לבן,תכלת','87 l * 55 w',null),
  (4,'דרבוקה קטנה',4,'שחור,אפור',null,null),
  (5,'צינור דק ארוך',7,'אפור',null,null);

CREATE TABLE `costumes_types` (
  `cot_id` tinyint UNSIGNED NOT NULL AUTO_INCREMENT,
  `cot_name` varchar(50) NOT NULL,
  PRIMARY KEY (`cot_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `costumes_types`
VALUES
  (1,'מכנסיים'),
  (2,'חולצה'),
  (3,'טוניקה'),
  (4,'גלביה'),
  (5,'אובראול'),
  (6,'חצאית'),
  (7,'אביזר'),
  (8,'שונות');

CREATE TABLE `costumes` (
  `cos_id` tinyint UNSIGNED NOT NULL AUTO_INCREMENT,
  `cos_name` varchar(50) NOT NULL,
  `cos_type` tinyint UNSIGNED NOT NULL,
  `cos_sizes` set('2','4-6','8','8-10','10','12','12-14','14','16','16-18','18','y','xxs','xs','s','s-m','m','l','l-xl','xl','xxl','one size'),
  `cos_colors` set('לבן','שחור','אפור','אפור בהיר','בורדו','אדום','כתום','צהוב','צהוב זוהר','ירוק זוהר','ירוק בהיר','ירוק כהה','כחול','תכלת','ורוד','ורוד זוהר','סגול בהיר','סגול','מנומר','זהב','גוף'),
  `cos_gender` enum('בנים','בנות','כולם'),
  `cos_notes` tinytext,
  PRIMARY KEY (`cos_id`),
  FOREIGN KEY (`cos_type`) REFERENCES `costumes_types` (`cot_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `costumes`
VALUES
  (1,'גלביה מנומרת',4,'one size','מנומר','כולם',null),
  (2,'♥LA',2,'s,m','לבן','בנות',null),
  (3,'דגמ"ח',1,null,'אפור','כולם',null),
  (4,'מעיל גשם',7,'one size','תכלת,ורוד,צהוב,ירוק בהיר','כולם',null),
  (5,'טוטו',6,'one size','אדום,סגול,ורוד,לבן','בנות',null);

CREATE TABLE `equipment_in_locations` (
  `eil_location_id` tinyint UNSIGNED NOT NULL,
  `eil_equipment_id` tinyint UNSIGNED NOT NULL,
  `eil_quantity` smallint UNSIGNED NOT NULL,
  `eil_notes` tinytext,
  PRIMARY KEY (`eil_location_id`, `eil_equipment_id`),
  FOREIGN KEY (`eil_location_id`) REFERENCES `locations` (`loc_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (`eil_equipment_id`) REFERENCES `equipment` (`equ_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `equipment_in_locations`
VALUES
  (1,1,64,null),
  (1,4,27,null),
  (1,5,14,null),
  (3,1,42,null),
  (3,5,10,null),
  (1,3,20,null),
  (1,2,7,null);

CREATE TABLE `costumes_in_locations` (
  `eil_location_id` tinyint UNSIGNED NOT NULL,
  `eil_costume_id` tinyint UNSIGNED NOT NULL,
  `eil_quantity` smallint UNSIGNED NOT NULL,
  `eil_notes` tinytext,
  PRIMARY KEY (`eil_location_id`, `eil_costume_id`),
  FOREIGN KEY (`eil_location_id`) REFERENCES `locations` (`loc_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (`eil_costume_id`) REFERENCES `costumes` (`cos_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `costumes_in_locations`
VALUES
  (1,1,26,null),
  (1,4,20,null),
  (1,5,19,null),
  (1,3,22,null),
  (1,2,11,null);

CREATE TABLE `transportations` (
  `tra_id` smallint UNSIGNED NOT NULL AUTO_INCREMENT,
  `tra_date` date NOT NULL,
  `tra_equipment` tinyint UNSIGNED,
  `tra_costume` tinyint UNSIGNED,
  `tra_quantity` smallint UNSIGNED NOT NULL,
  `tra_type` set('העברת ציוד','חלוקת ציוד','ציוד שבור','זריקת ציוד','השאלת ציוד') NOT NULL,
  `tra_from` tinyint UNSIGNED NOT NULL,
  `tra_to` tinyint UNSIGNED,
  `tra_notes` tinytext,
  PRIMARY KEY (`tra_id`),
  FOREIGN KEY (`tra_equipment`) REFERENCES `equipment` (`equ_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (`tra_costume`) REFERENCES `costumes` (`cos_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (`tra_from`) REFERENCES `locations` (`loc_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (`tra_to`) REFERENCES `locations` (`loc_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `transportations`
VALUES
  (1,DATE '2020-12-08',1,null,20,'העברת ציוד',1,3,null),
  (2,DATE '2020-12-10',2,null,30,'העברת ציוד',1,5,'מרים הנביאה בירוק תוסס'),
  (3,DATE '2020-12-11',null,5,2,'השאלת ציוד',1,6,'תלבושות לקטע של שחר, יוצרים צעירים'),
  (4,DATE '2020-12-11',1,null,2,'חלוקת ציוד',1,null,'צביעה לקינטו 3 עלומים'),
  (5,DATE '2020-12-11',1,null,2,'חלוקת ציוד',1,null,'צביעה לקינטו 3 ורשה');
  
CREATE TABLE `groups` (
  `gro_id` tinyint UNSIGNED NOT NULL AUTO_INCREMENT,
  `gro_name` varchar(50) NOT NULL,
  `gro_age` set("גן","א'","ב'","ג'","ד'","ה'","ו'","חטיבה","ז'","ח'","ט'","תיכון","י'","י''א","י''ב","צבא","אחרי צבא","מבוגרים","18+","30+") NOT NULL,
  `gro_main_studio` tinyint UNSIGNED NOT NULL,
  PRIMARY KEY (`gro_id`),
  FOREIGN KEY (`gro_main_studio`) REFERENCES `locations` (`loc_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `groups`
VALUES
  (1,"טומבה בוגרת","צבא,אחרי צבא",1),
  (2,"טומבה בוגרת","י''ב,צבא",1),
  (3,"טומבה צעירה","י',י''א",1),
  (4,"קונגה בוגרת","ט'",1),
  (5,"קונגה צעירה ח'","ח'",1),
  (6,"קונגה צעירה ז' 1","ז'",1),
  (7,"קונגה צעירה ז' 2","ז'",1),
  (8,"קונגה צעירה ו'","ו'",1),
  (9,"קונגה צעירה ה' עלומים","ה'",1),
  (10,"קונגה צעירה ה' ורשה","ה'",1),
  (11,"קינטו 2 עלומים","ד'",2),
  (12,"קינטו 2 ורשה","ד'",3),
  (13,"קינטו 1 עלומים א'","ג'",2),
  (14,"קינטו 1 עלומים ב'","ג'",2),
  (15,"קינטו 1 ורשה","ג'",3),
  (16,"קינטו 3 עלומים","ב'",2),
  (17,"קינטו 3 ורשה","ב'",3),
  (18,"טרום להקה א'","א'",1),
  (19,"טרום להקה ב'","א'",1),
  (20,"קינטו בוגרת","ג',ד',ה'",4),
  (21,"קינטו צעירה","א',ב'",4),
  (22,"מבוגרים","מבוגרים",1);

CREATE TABLE `drummers` (
  `dru_id` smallint UNSIGNED NOT NULL,
  `dru_name` varchar(50) NOT NULL,
  `dru_group` tinyint UNSIGNED NOT NULL,
  `dru_birth_date` date,
  `dru_address` varchar(100),
  `dru_mobile` char(11),
  `dru_email` varchar(50),
  `dru_parent1_name` varchar(50),
  `dru_parent1_mobile` char(11),
  `dru_parent1_email` varchar(50),
  `dru_parent2_name` varchar(50),
  `dru_parent2_mobile` char(11),
  `dru_parent2_email` varchar(50),
  PRIMARY KEY (`dru_id`),
  FOREIGN KEY (`dru_group`) REFERENCES `groups` (`gro_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `drummers`
VALUES
  (1,'יובל וייסמן',1,DATE '1998-10-04','נהר הירדן 25, קריית אונו','054-8816729','yuvalwais@gmail.com','ענת','054-6566168','tut2312@gmail.com','גבי','054-4736358','gabistuta@gmail.com'),
  (2,'עמית ליכט פטרן',1,DATE '1998-08-05','דביר 13, גני תקווה','054-6873688','rsardlp@gmail.com',null,null,null,null,null,null),
  (3,'שירה קיבק',3,null,null,null,null,null,null,null,null,null,null),
  (4,'יובל בן שושן',6,null,null,null,null,null,null,null,null,null,null),
  (5,'עלמה עמיגא',16,null,null,null,null,null,null,null,null,null,null);

CREATE TABLE `numbers` (
  `num_id` tinyint UNSIGNED NOT NULL AUTO_INCREMENT,
  `num_name` varchar(50) NOT NULL,
  `num_length` time,
  `num_equipment` set('פחים','מקלות','צינורות','דרבוקות',"דג'מבאים",'קחונים','פחי שמן','תופי מרים','תופים סיניים','בקבוקים','אמבטיות','שונות'),
  `num_notes` tinytext,
  PRIMARY KEY (`num_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `numbers`
VALUES
  (1,'אהבה','00:04:24',null,null),
  (2,'שורק בחושך','00:03:06','צינורות',null),
  (3,'מרים הנביאה','00:03:24','תופי מרים',null),
  (4,'המקלחת של סוף היום','00:03:06','אמבטיות',null),
  (5,'מהפכה של שמחה','00:03:32','פחים,מקלות',null);

CREATE TABLE `numbers_by_group` (
  `nbg_number_id` tinyint UNSIGNED NOT NULL,
  `nbg_group_id` tinyint UNSIGNED NOT NULL,
  `ngb_in_repertoire` boolean,
  PRIMARY KEY (`nbg_number_id`,`nbg_group_id`),
  FOREIGN KEY (`nbg_number_id`) REFERENCES `numbers` (`num_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (`nbg_group_id`) REFERENCES `groups` (`gro_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `numbers_by_group`
VALUES
  (1,1,1),
  (1,2,1),
  (2,3,1),
  (3,4,0),
  (3,5,1),
  (4,4,0),
  (4,6,1),
  (4,7,1),
  (5,6,1),
  (5,7,1);

CREATE TABLE `users` (
  `use_id` smallint UNSIGNED NOT NULL AUTO_INCREMENT,
  `use_name` varchar(50) NOT NULL,
  `use_email` varchar(100) NOT NULL,
  `use_password` varchar(50) NOT NULL,
  `use_drummer_id` smallint UNSIGNED,
  PRIMARY KEY (`use_id`), 
  FOREIGN KEY (`use_drummer_id`) REFERENCES `drummers` (`dru_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `users`
VALUES
  (1,'יובל וייסמן','yuvalwais@gmail.com',1234567890,1),
  (2,'ניר פיינשטיין','nirfainshtein@gmail.com‬','0987654321',null);

CREATE TABLE `schedules` (
  `sch_id` tinyint UNSIGNED NOT NULL AUTO_INCREMENT,
  `sch_title` varchar(50) NOT NULL,
  `sch_start_date` date NOT NULL,
  `sch_day` enum('0','1','2','3','4','5') NOT NULL,
  `sch_hour` time NOT NULL,
  `sch_duration` tinyint UNSIGNED NOT NULL,
  `sch_end_date` date,
  `sch_group` tinyint UNSIGNED,
  PRIMARY KEY (`sch_id`),
  FOREIGN KEY (`sch_group`) REFERENCES `groups` (`gro_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `schedules`
VALUES
  (1,'טומבה בוגרת','2020-12-03',4,'20:30:00',3,'2021-07-31',1),
  (2,'טומבה בוגרת','2020-12-04',5,'13:00:00',3,'2021-07-31',1),
  (3,"קונגה צעירה ח'",'2020-12-06',0,'18:00:00',3,'2021-07-31',5),
  (4,'קינטו 3 ורשה','2020-12-07',1,'13:00:00',2,'2021-07-31',17),
  (5,"קינטו 1 עלומים א'",'2020-12-08',2,'14:00:00',2,'2021-07-31',13);

CREATE TABLE `booking` (
  `boo_id` tinyint UNSIGNED NOT NULL AUTO_INCREMENT,
  `boo_title` varchar(50) NOT NULL,
  `boo_date` date NOT NULL,
  `boo_hour` time NOT NULL,
  `boo_duration` tinyint UNSIGNED NOT NULL,
  `boo_is_open` boolean NOT NULL,
  `boo_open_to` varchar(50),
  `boo_booked_by` smallint UNSIGNED,
  `boo_notes` tinytext,
  PRIMARY KEY (`boo_id`),
  FOREIGN KEY (`boo_booked_by`) REFERENCES `drummers` (`dru_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `booking`
VALUES
  (1,'יוצרים צעירים - עמית ליכט','2020-12-17','10:00:00',2,0,null,1,null),
  (2,'זמן אימון קונגה בוגרת','2020-12-07','17:00:00',2,0,null,1,null);
