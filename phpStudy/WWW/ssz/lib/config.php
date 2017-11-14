<?php
session_start();
/**
 * lib/config.php
 * 公共配置文件
 */
error_reporting(E_ALL ^ E_NOTICE);
//error_reporting(E_ERROR | E_WARNING | E_PARSE);
header( 'Content-type:text/html;charset=utf-8' );# 设置头部编码
date_default_timezone_set('PRC');	# 设置时区

# 开启错误报告 : 开发的时候
//error_reporting( -1 ); 
# 开启 session 会话


######### ******  自定义配置信息  #########

# 数据库配置
$host = 'localhost';	# 主机名
$user = 'root';				# 用户名
$pwd = '_root_';			# 密码
$db_name = 'ssz';		# 数据库名

# 分页配置
# 后台列表页面的分页限定数目
define( 'ADMIN_LIMIT' , 50 );

# 前台列表页面的分页限定数目
define( 'FRONT_LIMIT' , 12 );
######### ******  自定义配置信息end  #########
# 数据库连接文件
require_once('db.php');
# 公共函数
require_once('func.php');

 
