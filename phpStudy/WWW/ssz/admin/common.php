<?php 
/**
 * admin/common.php
 * 公共文件
 */

# 公共配置文件
require_once( '../lib/config.php' );
header( 'Content-type:text/html;charset=utf-8' );
$session_id = session_id();	# 当前用户 的 session_id 

$login_status = isset($_SESSION['is_login']) ? $_SESSION['is_login'] : false;

if( !$login_status ){
	alert_go( '你还没有登录后台，请先登录','login.php' );
}

#登录超时判断
if( isset($_SESSION['expiretime']) ) {
    if($_SESSION['expiretime'] < time()) {
    	var_dump("???????");
        unset($_SESSION['expiretime']);
        header('Location: loginout.php'); // 退出的登录
        exit;
    } else {
        $_SESSION['expiretime'] = time() + 3600; // 刷新时间戳
    }
}

?>



