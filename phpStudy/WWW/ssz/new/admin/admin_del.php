<?php require_once('common.php'); ?>
<?php
/**
 * admin/admin_del.php
 * 删除： 管理员
 */
#判断是否是管理员登录
if($_SESSION['type']!="admin"){
    $ip = get_real_ip();
     updata_log( "代理:".$_SESSION['nickname'].",账户:".$_SESSION['username']."尝试进入后台管理员系统,时间".date("Y-m-d H:i:s",time()) );
    alert_go("兄台！你想干什么","index.php");exit;
}
# 配置
$url = 'admin_lists.php'; 	# 跳转页面地址
$table_name = 'admin'; 		# 表名
$primary_id = 'id'; 		# 主键
$message = '管理员'; 		# 提示信息

$action = isset($_GET['action']) ? $_GET['action'] : false;
if( $action ){
	$id = isset($_GET['id']) ? $_GET['id'] : 0; # 获取 id : 过滤数据 
	$id = intval($id);

	$query = "DELETE FROM {$table_name} WHERE {$primary_id}=".$id;
	# 发送指令
	mysql_query($query);

	# 判断是否成功删除
	$logs = mysql_affected_rows();
	if($logs){
		updata_log("成功删除管理员，id：".$id);
		alert_go('成功删除'.$message,$url);
	}else{
		alert_go('删除失败：网络原因，请稍后重试');
	}
	exit;

}else{
	# 非法访问
	alert_go('非法访问',$url);
}

