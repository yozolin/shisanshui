<?php
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-06-28 08:50:16
 * @version $Id$
 */
require_once( '../lib/config.php' );

/*---------------------------折线统计图--------------------------------*/ 
$time = isset($_POST['time']) ? $_POST['time'] : false;
if($time){
	$timeArr = [];
	$data = [];
	$month = date("m",time());  //获取这个月
	$day = date("d",time());  //获取今天
	for ($i=7; $i>=1; $i--) { 
		if($day-$i<=0){
			if($month-1 ==0){
				$time = date("Y-m-d",strtotime("0 month".-$i."day") );
			}else{
				$time = date("Y-m-d",strtotime("0 month".-$i."day") );
			}
		}else{
			$time = date("Y-m-d",strtotime("-".$i." day") );
		}
		$timeArr[] = $time;
		$data[] = select_orders($time);
	}
	
	//echo $day;
	// echo $time;
	echo json_encode($data);
}


/*---------------------------条形统计图--------------------------------*/ 
$bar = isset($_POST['bar'])?$_POST['bar']:false;
if($bar){
	$order = select_Yesterday();
	echo json_encode($order);
}

/*---------------------------扇形统计图--------------------------------*/ 
$gauge = isset($_POST['gauge'])?$_POST['gauge']:false;
if($gauge){
	$time = date("Y-m-d",strtotime("0 day") );
	//$time = date("Y-m-d",time());
	$today = select_orders($time);
	//echo $time;
	echo json_encode($today);
}

/*-------------------------------检查校验码------------------------------*/ 
$checkCode = isset($_POST['checkCode'])? $_POST['checkCode']:false;
if($checkCode){
	$data = [];
	$type = $_SESSION['type'];
	$id = $_SESSION['id'];
	$select = "SELECT checkCode,lastLoginTime,ipAddress from $type where id =".$id;
	$query = mysql_query($select);
	$result = mysql_fetch_assoc($query);
	if($_SESSION['checkCode'] != $result['checkCode']){
		session_unset();
		$data['ipAddress'] = ($result['ipAddress']);
		$data['lastLoginTime'] = $result['lastLoginTime'];
		$data['result'] = 1;
	}else{
		$data['result'] =0;
	}
	echo json_encode($data);
}
/*---------------------------充值房卡--------------------------------*/ 
$addCardData = isset($_POST['addCard']) ? $_POST['addCard'] : false;
if($addCardData){
	$time = date("Y-m-d H:i:s",time());

	$data = [];
	$data['result'] = '';   	#结果集 
	$data['noUserId'] = 0;		#表示没有该id的用户
	$data['noEnonghCard'] = 0;	#表示房卡不足
	$data['userCardNum'] = '';	#用户原有房卡
	$data['noHasUse'] = '';		#用户不归属该登录人
	$data['cardNum'] = 0;		#充值量
    $data['time'] = $time;		#处理的时间

	$id = $addCardData['id']; 				# 用户ID
	$cardNum = $addCardData['cardNum'];		# 用户房卡
	$typeInfo = $addCardData['typeInfo'];	# 类型
	$count = $cardNum;						# 价格
	$time = date("Y-m-d H:i:s",time());  	# 获取时间 

	$data['cardNum'] = $cardNum;
    $data['userId'] = $id;
    if($_SESSION['type']!="admin"){   		# 如果不是管理员则去判断房卡是否充足
        if( select_cardNum($_SESSION['id'],$_SESSION['type']) < $cardNum){
        	$data['noEnonghCard'] = 1;
        	echo json_encode($data);exit;
        }
    }
   

    $query = "SELECT * FROM $typeInfo WHERE id=".$id; 	#查询是否有此用户 如果有则去处理该用户的房卡
    $result = mysql_query($query);
    $exit_user = mysql_fetch_assoc($result);
    if($exit_user){     # 更新充值对象房卡
        $userCardNum = select_cardNum($id,$typeInfo);    #用户的房卡
        $data['userCardNum'] = $userCardNum;
        if($_SESSION['type']!="admin"){ 				#处理代理房卡
            $inviteCode = $exit_user['inviteCode'];     #代理邀请码
            if(!$inviteCode || $inviteCode != $_SESSION['inviteCode']){
            	$data['noHasUse'] = 1;
            }else{
            	//$result = commit("agent",$typeInfo,$id,$cardNum,$count);
            	$data['result'] = commit("agent",$typeInfo,$id,$cardNum,$count);
            }
        }else{ 		#处理管理房卡
        	//$result = commit("admin",$typeInfo,$id,$cardNum,$count);
        	$data['result'] = commit("admin",$typeInfo,$id,$cardNum,$count);
        }  
        //$data['result'] = $result;  	#结果
    }else{
    	$data['noUserId'] = 1;
    }
    echo json_encode($data);
}
//代理权限控制
$agId = isset($_POST['agId']) ? $_POST['agId'] :false;
if($agId){
	$table = 'agent';
	$permission = $_POST['quanxian'];
	if($permission==0){
		$sql = "UPDATE {$table} SET  permission=1 WHERE id=".$agId;
	}else{
		$sql = "UPDATE {$table} SET  permission=0 WHERE id=".$agId;
	}
	
	$result = mysql_query($sql);
	$data = mysql_affected_rows();
	if($data ){
		echo 1;
	}else{
		echo 2;
	}
}

//管理员权限控制
$adId = isset($_POST['adId']) ? $_POST['adId'] :false;
if($adId){
	$table = 'admin';
	$permission = $_POST['quanxians'];

	if($permission==1){
		$sql = "UPDATE {$table} SET  permission=0 WHERE id=".$adId;
	}else{
		$sql = "UPDATE {$table} SET  permission=1 WHERE id=".$adId;
	}
	
	$result = mysql_query($sql);
	$data = mysql_affected_rows();
	if($data ){
		echo 1;
	}else{
		echo 2;
	}
}
