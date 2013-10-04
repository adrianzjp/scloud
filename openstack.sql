/*
Navicat MySQL Data Transfer

Source Server         : 192.168.1.115
Source Server Version : 50529
Source Host           : 192.168.1.115:3306
Source Database       : openstack

Target Server Type    : MYSQL
Target Server Version : 50529
File Encoding         : 65001

Date: 2013-05-13 19:38:00
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `dataobject`
-- ----------------------------
DROP TABLE IF EXISTS `dataobject`;
CREATE TABLE `dataobject` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `m_content_type` varchar(255) NOT NULL,
  `m_parent_id` int(10) unsigned NOT NULL DEFAULT '0',
  `m_name` varchar(255) NOT NULL DEFAULT '',
  `m_storage_name` varchar(255) NOT NULL DEFAULT '',
  `m_tenant_name` varchar(255) NOT NULL DEFAULT '',
  `m_status` varchar(255) NOT NULL DEFAULT '',
  `m_url` varchar(255) NOT NULL DEFAULT '',
  `m_hash` varchar(255) NOT NULL DEFAULT '',
  `m_size` varchar(255) NOT NULL DEFAULT '',
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=133 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;


-- ----------------------------
-- Table structure for `datashare`
-- ----------------------------
DROP TABLE IF EXISTS `datashare`;
CREATE TABLE `datashare` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `m_content_type` varchar(255) NOT NULL,
  `m_user_from` varchar(255) NOT NULL DEFAULT '',
  `m_hash_key` varchar(255) NOT NULL DEFAULT '',
  `m_name` varchar(255) NOT NULL DEFAULT '',
  `m_storage_name` varchar(255) NOT NULL DEFAULT '',
  `m_parent_id` int(10) unsigned NOT NULL DEFAULT '0',
  `m_tenant_name` varchar(255) NOT NULL DEFAULT '',
  `m_user_to` varchar(255) NOT NULL DEFAULT '',
  `m_unique_url` varchar(255) NOT NULL DEFAULT '',
  `m_password` varchar(255) NOT NULL DEFAULT '',
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;


-- ----------------------------
-- Table structure for `useroprs`
-- ----------------------------
DROP TABLE IF EXISTS `useroprs`;
CREATE TABLE `useroprs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `m_opr_type` varchar(255) NOT NULL,
  `m_content_type` varchar(255) NOT NULL,
  `m_storage_name` varchar(255) NOT NULL DEFAULT '',
  `m_user` varchar(255) NOT NULL DEFAULT '',
  `m_tenant_name` varchar(255) NOT NULL DEFAULT '',
  `m_parent_name` varchar(255) NOT NULL DEFAULT '',
  `m_unique_url` varchar(255) NOT NULL DEFAULT '',
  `m_description` varchar(255) NOT NULL DEFAULT '',
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

