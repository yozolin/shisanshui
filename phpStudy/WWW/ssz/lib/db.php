<?php
/**
 * lib/db.php
 * 数据库连接文件
 */

# 连接数据库服务器
@mysql_connect($host,$user,$pwd) or die('数据库连接失败'.mysql_error());

# 选择数据库
mysql_select_db($db_name);

# 设置编码
mysql_query('SET NAMES UTF8');