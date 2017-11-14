<?php
header("content-type:text/html;charset=utf-8;");
require_once('lib/config.php');
# 设置编码
$agentapply = isset($_POST['agentapply']) ? $_POST['agentapply'] : false;
if($agentapply){
	$date = [];
    //$agentapply['introMethod'];

	$username = $agentapply['username'];
	$nickname = $agentapply['nickname'];

	$password = $agentapply['password'];
	$crypt = rand_string();
	$pwd = create_pwd($password,$crypt);

	$wechat =  $agentapply['wechat'];
	$phone =$agentapply['phone'];
	$qq = $agentapply['qq'];
	$area = $agentapply['area'];
	$inviteCode = isset($_POST['inviteCode'])?$_POST['inviteCode']:'';
	$introMethod = isset($_POST['introMethod'])?$_POST['introMethod']:'';

	$sql = "INSERT INTO agentapply(username,nickname,password,crypt,wechat,qq,phone,area,inviteCode,introMethod)VALUES('{$username}','{$nickname}','{$pwd}','{$crypt}','{$wechat}','{$phone}','{$qq}','{$area}','{$inviteCode}','{$introMethod}')";
	$result = mysql_query($sql);
	$affected = mysql_insert_id();
	if($affected){
		echo $date['result'] = 1;
		alert_go('提交成功，请耐心等候审批回复！','index.html');
	}else{
		echo $date['result'] = 0;
		alert_go('网络出错，提交失败！请稍后再试！');
	}	
}
