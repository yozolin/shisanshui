<?php require_once('common.php'); ?>
<?php
/**
 * admin/loginout.php
 * 退出登录 页面
 */

# 清除 成功登录 的状态 的会话信息
# 开启 session 会话
// session_start();

update_log_logout();
$type = $_SESSION['type']; # 登录类型，管理员:代理。 对应着数据表
$update = "UPDATE $type SET state = 0 where id=".$_SESSION['id'];
// var_dump($update);exit;
mysql_query($update);
session_unset();

# 跳转 : 使用 php 的 header() 函数
header('Location: login.php' );