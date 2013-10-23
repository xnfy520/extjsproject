# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: localhost (MySQL 5.5.9)
# Database: xnfy520_extjsproject
# Generation Time: 2013-10-23 01:50:49 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table xnfy520_extjsproject_article
# ------------------------------------------------------------

DROP TABLE IF EXISTS `xnfy520_extjsproject_article`;

CREATE TABLE `xnfy520_extjsproject_article` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '',
  `details` text,
  `pid` int(11) unsigned NOT NULL DEFAULT '0',
  `indexing` varchar(255) DEFAULT NULL,
  `views` int(11) unsigned DEFAULT '0',
  `cover` varchar(255) DEFAULT NULL,
  `publish_date` int(11) unsigned DEFAULT NULL,
  `publish` tinyint(1) unsigned DEFAULT '1',
  `create_date` int(11) unsigned DEFAULT NULL,
  `modify_date` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `xnfy520_extjsproject_article` WRITE;
/*!40000 ALTER TABLE `xnfy520_extjsproject_article` DISABLE KEYS */;

INSERT INTO `xnfy520_extjsproject_article` (`id`, `title`, `details`, `pid`, `indexing`, `views`, `cover`, `publish_date`, `publish`, `create_date`, `modify_date`)
VALUES
	(21,'sefsf','<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n\n</body>\n</html>',63,'',0,'upload/source/sweet_girls_on_romance_novel_cover_bi41282.jpg',1382162335,1,1382162335,1382163114),
	(22,'sefsfsffs','<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n\n</body>\n</html>',0,'',0,'upload/source/wp_7_4_4.jpg',1382162366,1,1382162366,1382324014),
	(23,'sefsfsfvs','<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n\n</body>\n</html>',63,'',0,'upload/source/sweet_girls_on_romance_novel_cover_bi41304.jpg',1382162488,1,1382162488,1382164382),
	(24,'sefsfsfvsas','<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n<p><img src=\"upload/source/wp_7_2_4a.jpg\" alt=\"wp_7_2_4a\" /></p>\n</body>\n</html>',63,'',4,'upload/source/wp_7_4_4.jpg',1382162626,1,1382162626,1382335730);

/*!40000 ALTER TABLE `xnfy520_extjsproject_article` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table xnfy520_extjsproject_classify
# ------------------------------------------------------------

DROP TABLE IF EXISTS `xnfy520_extjsproject_classify`;

CREATE TABLE `xnfy520_extjsproject_classify` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '',
  `indexing` varchar(255) NOT NULL DEFAULT '',
  `pid` int(11) unsigned DEFAULT '0',
  `remark` varchar(255) DEFAULT NULL,
  `enabled` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `create_date` int(10) unsigned DEFAULT NULL,
  `modify_date` int(10) unsigned DEFAULT NULL,
  `leaf` tinyint(1) unsigned DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `xnfy520_extjsproject_classify` WRITE;
/*!40000 ALTER TABLE `xnfy520_extjsproject_classify` DISABLE KEYS */;

INSERT INTO `xnfy520_extjsproject_classify` (`id`, `title`, `indexing`, `pid`, `remark`, `enabled`, `create_date`, `modify_date`, `leaf`)
VALUES
	(2,'文章','article',0,'',1,1378274216,1382163675,0),
	(64,'链接','link',0,'',1,1381738990,1381828542,0),
	(62,'行业资讯','',2,'',1,1381201105,1381739330,1),
	(63,'公司新闻','',2,'',1,1381201109,1381739324,1),
	(65,'友情链接','',64,'',1,1381739022,1381739237,1),
	(66,'广告','advert',64,'',1,1381739076,NULL,0),
	(67,'首页导航','',64,'',1,1381739159,NULL,0),
	(68,'首页大Banner','',66,'',1,1381739198,1381739269,1);

/*!40000 ALTER TABLE `xnfy520_extjsproject_classify` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table xnfy520_extjsproject_link
# ------------------------------------------------------------

DROP TABLE IF EXISTS `xnfy520_extjsproject_link`;

CREATE TABLE `xnfy520_extjsproject_link` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '',
  `indexing` varchar(255) NOT NULL DEFAULT '',
  `pid` int(11) unsigned DEFAULT '0',
  `remark` varchar(255) DEFAULT NULL,
  `enabled` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `create_date` int(10) unsigned DEFAULT NULL,
  `modify_date` int(10) unsigned DEFAULT NULL,
  `sort` int(10) unsigned DEFAULT '0',
  `link` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `xnfy520_extjsproject_link` WRITE;
/*!40000 ALTER TABLE `xnfy520_extjsproject_link` DISABLE KEYS */;

INSERT INTO `xnfy520_extjsproject_link` (`id`, `title`, `indexing`, `pid`, `remark`, `enabled`, `create_date`, `modify_date`, `sort`, `link`, `image`)
VALUES
	(14,'sefsf','',0,'',1,1382356876,NULL,99,'',''),
	(12,'sefsfesf','',0,'',1,1382356864,NULL,99,'','upload/source/wp_7_4_4.jpg'),
	(13,'asef','',66,'',1,1382356873,NULL,99,'','upload/source/wp_7_1_4.jpg');

/*!40000 ALTER TABLE `xnfy520_extjsproject_link` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table xnfy520_extjsproject_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `xnfy520_extjsproject_user`;

CREATE TABLE `xnfy520_extjsproject_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `email` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT '',
  `enabled` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `register_date` int(10) unsigned DEFAULT NULL,
  `last_login_date` int(10) unsigned DEFAULT NULL,
  `remark` varchar(255) DEFAULT '',
  `group_id` int(11) unsigned DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `xnfy520_extjsproject_user` WRITE;
/*!40000 ALTER TABLE `xnfy520_extjsproject_user` DISABLE KEYS */;

INSERT INTO `xnfy520_extjsproject_user` (`id`, `username`, `password`, `email`, `avatar`, `enabled`, `register_date`, `last_login_date`, `remark`, `group_id`)
VALUES
	(1,'admin','e10adc3949ba59abbe56e057f20f883e','xnfy520@qq.com','upload/source/wp_7_3_4.jpg',1,1381994689,1382492945,'sefsef',4),
	(2,'xnfy520','96e79218965eb72c92a549dd5a330112','','upload/source/wp_7_1_4.jpg',1,1382089103,NULL,'sef',4),
	(3,'tianyun','96e79218965eb72c92a549dd5a330112','','upload/source/wp_7_4_4.jpg',1,1382089255,NULL,'',5),
	(4,'sefsf','d18f894445cb8d1a5ada6c39efc195d7','','upload/source/wp_7_1_4.jpg',1,1382194814,NULL,'',5);

/*!40000 ALTER TABLE `xnfy520_extjsproject_user` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table xnfy520_extjsproject_user_group
# ------------------------------------------------------------

DROP TABLE IF EXISTS `xnfy520_extjsproject_user_group`;

CREATE TABLE `xnfy520_extjsproject_user_group` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '',
  `indexing` varchar(255) DEFAULT '',
  `remark` varchar(255) DEFAULT '',
  `enabled` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `create_date` int(10) unsigned DEFAULT NULL,
  `modify_date` int(10) unsigned DEFAULT NULL,
  `sort` int(10) unsigned DEFAULT '0',
  `link` varchar(255) DEFAULT '',
  `image` varchar(255) DEFAULT '',
  `leaf` tinyint(1) unsigned DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

LOCK TABLES `xnfy520_extjsproject_user_group` WRITE;
/*!40000 ALTER TABLE `xnfy520_extjsproject_user_group` DISABLE KEYS */;

INSERT INTO `xnfy520_extjsproject_user_group` (`id`, `title`, `indexing`, `remark`, `enabled`, `create_date`, `modify_date`, `sort`, `link`, `image`, `leaf`)
VALUES
	(4,'管理员','admin','',1,1381894439,1382163838,99,'','',1),
	(5,'普通用户','general','',1,1381894496,1381974850,99,'','',1);

/*!40000 ALTER TABLE `xnfy520_extjsproject_user_group` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
