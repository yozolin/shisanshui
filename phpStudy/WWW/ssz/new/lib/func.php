<?php
/**
 * lib/func.php
 * 公共函数文件
 */

/**
 * 弹出消息框
 * $message 弹出的消息
 * $url ，可选参数，跳转地址
 */
function alert_go( $message,$url=''){
	echo "<script>";
	echo "alert('{$message}');";
    	if( $url ){
    		echo "location.href='{$url}'";
    	}else{
    		echo "history.back()";
    	}
	echo "</script>";
}
#监听浏览器是否关闭
function check_abort(){
    #connection_aborted() 函数检查是否断开客户机
    #如果已终止链接 则返回1 否则返回0
    if(connection_aborted()){
        $type = $_SESSION['type'];
        $update = "UPDATE $type SET state = 0 where id=".$_SESSION['id'];
        // var_dump($update);exit;
        mysql_query($update);
    }
}
/**
 * 从数据库中读取 config 配置信息
 * $config_mark 字符串： 配置的标识
 */
function get_config($config_mark){
	$table_name = 'hia_config';
	$query = "SELECT * FROM {$table_name} WHERE config_mark='{$config_mark}'";
	$result = mysql_query($query);
	$row = mysql_fetch_assoc($result);
	$config_content = isset($row['config_content']) ? $row['config_content'] : null;
	return $config_content;
}
/**
 * 更新网站配置
 */
function update_config($value,$mark){
	$time = time(); # 更新时间
    $update = "UPDATE hia_config SET config_content='{$value}',config_updatetime={$time} WHERE config_mark='{$mark}';";
    mysql_query($update);  
    # 返回影响的记录行数
    return mysql_affected_rows();
}

/**
 * 生成随机字符串
 * $length 生成的字符串的长度
 */
function rand_string( $length=6 ){
    $str = null;
    $strPol = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $strPol .= "0123456789";
    $strPol .= "abcdefghijklmnopqrstuvwxyz";
    $max = strlen($strPol)-1;
    for($i=0; $i<$length; $i++){
        //rand($min,$max)生成介于min和max两个数之间的一个随机整数
        $str.=$strPol[ rand(0,$max) ];
    }
    return $str;
}

/**
 * 生成密码
 * $pwd 原密码
 * $crypt 加密因子 
 * 一次md5加密，拼接上加密因子，二次加密，截取20位 
 */
function create_pwd( $pwd , $crypt ){
 
    $str = md5($pwd);    # 第一次加密： md5 
    $str .= $crypt;      # 拼接上 加密因子 
    $str = sha1($str);   # 第二次加密： sha1  
    $str = substr($str,10,20);   # 截取字符串：截取中间的20位长度，从下标10开始算起
    return $str;
}



/**
 * 获取真实IP地址
 */
function get_real_ip() {
    $defalut_ip = '0.0.0.0';
    if (getenv("HTTP_CLIENT_IP") && strcasecmp( getenv("HTTP_CLIENT_IP"), "unknown")){
        $ip = getenv("HTTP_CLIENT_IP"); 
    } else{ 
        if (getenv("HTTP_X_FORWARDED_FOR") && strcasecmp(getenv("HTTP_X_FORWARDED_FOR"), "unknown")) {
            $ip = getenv("HTTP_X_FORWARDED_FOR"); 
        }else {
            if (getenv("REMOTE_ADDR") && strcasecmp(getenv("REMOTE_ADDR"), "unknown")) {
                $ip = getenv("REMOTE_ADDR"); 
            }else {
                if (isset ($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] && strcasecmp($_SERVER['REMOTE_ADDR'], "unknown")) {
                    $ip = $_SERVER['REMOTE_ADDR']; 
                }else {
                    $ip = $defalut_ip; 
                }
            }
        }
    }
    if($ip=='::1'){
        $ip = '127.0.0.1';
    }
    return ($ip); 
}

/**
 * 文件上传函数
 * $name_value 表单元素中的name属性的值
 * $path  文件的保存路径 
 * $db_path  文件的保存路径,存储到数据库中的路径
 */
function file_uploads( $name_value,$path='uploads',$db_path='uploads' ){
    $product_thumb = '';
    ######### 处理文件上传 #########
    $file_data = $_FILES[ $name_value ];
    # ********** 处理 存储目录 ********** #
    # 上传后的文件的存储位置
    if( !file_exists($path) ){
        mkdir($path);
    }
    # 当前日期，作为 存储文件的 子目录
    $today = date('Y-m-d');
    $path = rtrim($path,'/').'/';
    $path .= $today;
    if( !file_exists($path) ){
        mkdir($path);
    }
    $file_save_path = $path;
    # ********** 处理 存储目录 end ********** #
    
    # ********** 处理 数据库里的存储目录 ********** #
    # 上传后的文件的存储位置
    if( !file_exists($db_path) ){
        mkdir($db_path);
    }
    # 当前日期，作为 存储文件的 子目录
    $today = date('Y-m-d');
    $db_path = rtrim($db_path,'/').'/';
    $db_path .= $today;
    if( !file_exists($db_path) ){
        mkdir($db_path);
    }
    # ********** 处理 数据库里的存储目录 end ********** #

    # 判断文件上传的 错误状态
    if( $file_data && ( !$file_data['error']) ){
        # 文件上传成功
        // var_dump($file_data);

        # 新的文件名
        $new_file_name = 'pic_';
        $new_file_name .= date('Y_m_d_H_i_s');
        # 新的文件的存储路径（带有文件名）
        $file_save_path = rtrim($file_save_path,'/').'/';
        $new_file_name .= '.jpg';
        $new_file_path = $file_save_path.$new_file_name;

        # 存储到数据库中的路径 : 之所以要添加 / 是因为 目录与文件中间必须要有斜杠进行分割 
        $path = rtrim($path,'/').'/';
        $db_path = rtrim($db_path,'/').'/';
        $db_path = $db_path.$new_file_name;

        # 文件信息
        $file_type = $file_data['type'];
        $file_size = $file_data['size'];
        $file_tmp_name = $file_data['tmp_name'];

        # 从 服务器上临时存储位置，将文件复制到 我们指定存储位置
        $res = move_uploaded_file($file_tmp_name, $new_file_path);
        if($res){
            $product_thumb = $db_path;
        }

    }else if( $file_data['error'] ==4 ){
        # error 错误代码 等于4，表示没有选择文件进行上传

    }else{
        # 上传失败
        alert_go('文件上传失败：网络错误，请稍后重试');
        exit; 
    }

    return $product_thumb;
    ######### 处理文件上传 end #########
}
function updata_ewm(){
    $file = $_FILES['file'];    //得到传输的数据
    
    $name = $file['name'];//得到文件名称
    $type = strtolower(substr($name,strrpos($name,'.')+1)); //得到文件类型，并且都转化成小写
    $allow_type = array('jpg','jpeg','gif','png');  //定义允许上传的类型
    //判断文件类型是否被允许上传
    if(!in_array($type, $allow_type)){
      //如果不被允许，则直接停止程序运行
      return ;
    }
    //判断是否是通过HTTP POST上传的
    if(!is_uploaded_file($file['tmp_name'])){
      return ;//如果不是通过HTTP POST上传的
    }
    $upload_path = "./statics/h5add/images/"; //上传文件的存放路径
    //开始移动文件到相应的文件夹
    if(move_uploaded_file($file['tmp_name'],$upload_path.$file['name'])){
        //echo "Successfully!";
        return $upload_path.$file['name'];
        //alert_go("上传成功","package.php");
    }else{
        return '';
        //alert_go("又失败","package.php");
      //echo "Failed!";
    }
    ######### 处理文件上传 end #########
}

/**
 * 防 伪造跨站脚本 请求 : 生成一个 口令
 */
function create_crsf(){
    # 开启session 会话
    if( !session_id() ){
        session_start();
    }
    # 防跨站攻击
    $crsf = rand_string(18);
    $_SESSION['crsf'] = $crsf;
    echo "<input type='hidden' name='crsf' value='{$crsf}'>";
}

/**
 * 校验 crsf 是否正确
 */
function check_crsf(){
    # 防 crsf 跨站攻击 : Cross-site request forgery跨站请求伪造
    $crsf = isset($_POST['crsf']) ? $_POST['crsf'] : false;
    $session_crsf = isset($_SESSION['crsf']) ? $_SESSION['crsf'] : false;
    # 调试一下 ，是否有 session数据 或 session数据中是否有crsf这个索引，或者是否接收到 $_POST['crsf]
    $res = !$session_crsf || ($crsf != $session_crsf);
    return $res;

}

/**
 * 自定义的 用于打印输出数组的函数
 */
function print_r_mine($arr){
    echo "<pre>";
    print_r($arr);
    echo "</pre>";
}


/**
 * 两个参数查询对象是否存在
 * 一个参数查询对象数据
 */
 function select_user($table="users",$id=''){
    $where = '';
    if($id){
        $where = " where id ='{$id}'";
    }
    $select = "SELECT * FROM ".$table.$where;
    // var_dump($select);exit;
    $result = mysql_query($select);
    $user = mysql_fetch_assoc($result);
    return $user;
 }

 /**
 * 查询在线总数
 */
 function total_state($table="agent"){
    $select = "SELECT count(*) as nums FROM ".$table." WHERE state = 1";
    // var_dump($select);exit;
    $result = mysql_query($select);
    $user = mysql_fetch_assoc($result);
    return $user;
 }
/**
 * 更新用户房卡数量
 */
function update_user_cardNum($id,$cardNum){
    $select = "SELECT cardNumber FROM users WHERE id =".$id;
    $query = mysql_query( $select );
    $row = mysql_fetch_assoc($query);
    $totalCardNum = $row['cardNumber']+$cardNum;
    
    $update = "UPDATE users SET cardNumber={$totalCardNum} WHERE id=".$id;
    $query = mysql_query( $update );
    if($query){
        return true;
    }else{
        return false;
    }
   
}
/**
 * 更新代理房卡数量
 */
function update_agent_cardNum($id,$cardNum){
    $update = "UPDATE agent SET cardNumber=cardNumber-$cardNum WHERE id=".$id;
    // var_dump($update);exit;
    $query = mysql_query( $update );
    $result = mysql_affected_rows();
    if($result){
        return true;
    }else{
        return false;
    }
}
/**
 * 更新被充值人房卡数量
 */
function update_cardNumObj($id,$cardNum,$tableObj){
    $inviteCode = $_SESSION['inviteCode'];
    $update = "UPDATE $tableObj SET beforeAddNum = cardNumber,afterAddNum =$cardNum, cardNumber = cardNumber+$cardNum WHERE id=".$id;
    //var_dump($update);exit;
    if($_SESSION['type'] != "admin"){
        if(!$row['inviteCode']){
            $update = "UPDATE $tableObj SET beforeAddNum = cardNumber,afterAddNum =$cardNum,cardNumber=cardNumber+$cardNum,inviteCode ='{$inviteCode}'WHERE id=".$id;      
        }else if($row['inviteCode'] != $inviteCode ){
            alert_go("该用户不归属您的名下");exit;
        }
    }
    $query = mysql_query( $update );
    $affected = mysql_affected_rows();
    if($affected){
         return true;
    }else{
        return false;
    }
}
/**
 * ---插入订单信息---
 * ------------------   id:对象id          
 * ------------------   ipAddress: 充值人IP地址     
 * ------------------   cardNumber:房卡数量      
 * ------------------   t_price:总额             
 * ------------------   discount:折扣            
 * ------------------   orders_type:充值对象     
 * ------------------   inviteCode:验证码              
 */
function insert_orders($id,$cardNum,$t_price,$discount,$orders_type="user",$inviteCode=""){
    $ip = get_real_ip();
    $time = date("Y-m-d H:i:s",time());
    $chargerid = $_SESSION['id'];
    $chargername = $_SESSION['nickname'];
    $chargeruser = $_SESSION['username'];
    $level ='管理员';
    if($_SESSION['type']!="admin"){
        $level = $_SESSION['level'];
    }else{
        //$price =select_package($cardNum);
        //echo(json_encode($price));
    }
    $insert = "INSERT INTO orders(userId,ipAddress,cardNumber,price,createAt,updateAt,t_price,discount,chargerid,chargeruser,chargername,inviteCode,level,type)
            VALUES('{$id}','{$ip}','{$cardNum}','1.0','{$time}','{$time}','{$t_price}','{$discount}','{$chargerid}','{$chargeruser}','{$chargername}','{$inviteCode}','{$level}','{$orders_type}');";
            // var_dump($insert);exit;
    $query = mysql_query($insert);
    return $query;
}

function select_package($num){
    $select = "SELECT price FROM package WHERE num = $num";
    $query = mysql_query($select);
    $price = mysql_fetch_assoc( $query );
    return $price['price'];
}

/**
 * 向日志插入退出时间
 */
function update_log_logout(){
    if($_SESSION['login']){
        $time = $_SESSION['login'];
        $logoutAt = date("Y-m-d H:i:s",time());
        $update = "UPDATE log SET logout='{$logoutAt}' WHERE login ='{$time}'";
        mysql_query($update);
        // var_dump($update);exit;
    }
}

/**
 * 向日志插入登录时间
 */
function insert_log_login($time){   
    $login= $time;
    $id = $_SESSION['id'];
    $username = $_SESSION['username'];
    $nickname = $_SESSION['nickname'];
    $ip = get_real_ip();

    $insert = "INSERT INTO log (id,username,nickname,login,ipAddress ) VALUES ('{$id}','{$username}','{$nickname}','{$login}','{$ip}') ";
    // var_dump($insert);
    mysql_query($insert);  
}

/**
 *更新日志订单信息
 *content_msg :操作内容
 */
function updata_log($content_msg=''){
    $id = $_SESSION['id'];
    $username = $_SESSION['username'];
    $loginAt = $_SESSION['login'];
    $time = date("H:i:s",time());
    if($loginAt){
        $select = "SELECT content FROM log WHERE login = '{$loginAt}'";
        $result = mysql_query($select);
        $single = mysql_fetch_assoc($result);
    }
    $content = date("H:i:s",time()).$content_msg;
    if($single['content']){
        $content = $single['content'].','.$content;
    }
    $update = "UPDATE log SET content='{$content}' WHERE login ='{$loginAt}'";
    mysql_query($update);
    // exit;
}

/**
 * 查询等级
 */
function select_level(){

    if($_SESSION['level']>=3 && $_SESSION['level']!=127){
        return;
    }else{
        if($_SESSION['type']!="admin"){
            $select = "select level from agent where id =".$_SESSION['id'];
            $query = mysql_query($select);
            $level = mysql_fetch_assoc($query);
            $level = ($level['level']+1);
        }else{
            $level = 1;
        }
    }
    
    // var_dump($level);
    return $level;
}

/**
 * 查询总数
 */
function total_num($table,$online=0){
    $select = "SELECT count(*) as nums FROM $table";
    if($online){
        $select = "SELECT count(*) as nums FROM $table where onlineStatus = $online";
    }

    if($_SESSION['inviteCode']){
        $inviteCode = $_SESSION['inviteCode'];
        $select = "SELECT count(*) as nums FROM $table WHERE inviteCode ='{$inviteCode}'";
        if($online){
            $select = "SELECT count(*) as nums FROM $table WHERE inviteCode ='{$inviteCode}' AND onlineStatus = $online";
        }
    }
    $result = mysql_query($select);
    $row = mysql_fetch_assoc($result);
    $total = intval( $row['nums'] );
    return $total;
}
/**
 * 查询总金额
 */
function total_amount(){
    $select = "SELECT t_price FROM orders";
    if($_SESSION['inviteCode']){
        $inviteCode = $_SESSION['inviteCode'];
        $select = "SELECT t_price FROM orders WHERE inviteCode = '{$inviteCode}'";
    }
    $result = mysql_query($select);
    $data = [];
    $total_price ="";
    while ($row = mysql_fetch_assoc($result) ) {
        $data[] = $row;
    }
    for($i=0;$i<count($data);$i++){
        $total_price += $data[$i]['t_price'];
    }
    // var_dump($total_price);
    return $total_price;
}
/**
 * 查询总金额
 */
function select_count(){
    $count =0;
    $type = $_SESSION['type'];
    $id = $_SESSION['id'];
    $select = "SELECT count FROM $type ";
    $query = mysql_query($select);
    $data =[];
    while ($row = mysql_fetch_assoc($query)['count'] ) {
        $data[] = $row;
    }
    for($i=0;$i<count($data);$i++){
        $count += $data[$i];
    }
    //var_dump($count);exit;
    return $count;
}
/**
 * 验证码
 */
function create_inviteCode($start=0){
    $inviteCode = rand(100000,999999);
    $select = "SELECT inviteCode FROM agent where inviteCode ='{$inviteCode}'";
    $query = mysql_query($select);
    $result = mysql_fetch_assoc($query);
    if( $result ){
       create_inviteCode(++$start);
    }else{
        return $inviteCode;
    }
}
/**
 * 查询登录人的验证码
 */
function select_inviteCode($id,$table){
    $select = "SELECT inviteCode FROM $table WHERE id=".$id;
    $query = mysql_query($select);
    $result = mysql_fetch_assoc($query)['inviteCode'];
    return $result;
}

/**
 * 查询房卡数
 */
function select_cardNum($id='',$table="agent"){
    if($id){
        $select ="SELECT cardNumber FROM $table WHERE id = ".$id;
        $query = mysql_query($select);
        $result = mysql_fetch_assoc($query);
        return $result['cardNumber'];
    }else{
        $select ="SELECT cardNumber FROM $table";
        $query = mysql_query($select);
        $data = [];
        while ($row = mysql_fetch_assoc($query)['cardNumber'] ) {
            $data[] = $row;
        }
        $cardNum =0;
        for($i=0;$i<count($data);$i++){
            $cardNum += $data[$i];
        }
        //echo $cardNum;
        return $cardNum;
    }
}
/**
 * 查询房卡总充值量.
 * $limit -> 限制查询
 * $table -> 默认查询表user_recharge
 * $orderBy-> 排序，升序？降序
 */
function select_totalCardNum($table="user_recharge",$limit="",$orderBy=""){
    $where = '';
    if($_SESSION['type']!="admin"){
        $inviteCode = $_SESSION['inviteCode'];
        $where = " where inviteCode = '{$inviteCode}' ";
    }
    $lmt = '';
    if($limit){
        $lmt = " limit 0,{$limit} ";
    }
    $order = '';
    if($orderBy){
        $order = " ORDER BY totalNum {$orderBy} ";
    }
    $select = "SELECT * FROM {$table} {$where} {$order} {$lmt}";
    // var_dump($select);exit;
    $query = mysql_query($select);
    $data = [];
    while ($row = mysql_fetch_assoc($query)) {
        $data[] = $row;
    }
    return $data;
}


/**
 * 更新房卡总充值量
 * $id -> 充值对象的id
 * $cardNum -> 充值数量
 * $table -> 数据表
 */
function update_totalCardNum($table="user_recharge",$id,$cardNum,$count){
    $select = "SELECT * FROM {$table} WHERE id=".$id;  // 查询是否有记录
    $query = mysql_query($select);
    $result = mysql_fetch_assoc($query);
    if( !$result ){      #如果有则更新记录，无则插入记录
        if($table=="agent_recharge"){
            $userInfo = select_user("agent",$id);
        }else{
            $userInfo = select_user("users",$id);
        }    
        $nickname = $userInfo['nickname'];
        $sex = $userInfo['sex'];
        $inviteCode = $userInfo['inviteCode'];
        $createAt = $userInfo['createAt'];

        $insert = "INSERT INTO {$table}(id,nickname,sex,inviteCode,totalNum,count,createAt)
                VALUES($id,'{$nickname}','{$sex}','{$inviteCode}','{$cardNum}','{$count}','{$createAt}')";
        $query = mysql_query($insert);
    }else{
        $update = "UPDATE $table SET totalNum=totalNum+$cardNum,count=count+$count where id=".$id;
        $query = mysql_query($update);
    }
    return $query;
}
/**
 * 查询代理商房卡总充值量
 */
function select_agent_recharge(){
    $select = "SELECT * FROM user_recharge "; 
    $query = mysql_query($select);
    $data = [];
    while ($row = mysql_fetch_assoc($query)){
       $data[] = $row;
    }
    return $data;
}
/**
 * 查询公告信息
 */
function select_weibsite(){
     $select = "SELECT * FROM website "; 
     $query = mysql_query($select);
     $row = mysql_fetch_assoc($query);
     return $row['broadcast'];
}
/**
 * 查询解绑次数
 */
function select_unbundNum($id){
    $select = "SELECT unbundNum FROM users WHERE id =".$id; 
    $query = mysql_query($select);
    $row = mysql_fetch_assoc($query);
    return $row['unbundNum'];
}
/**
 * 从用户中删除代理邀请码
 */
function update_inviteCode($id){
    $update = "UPDATE users SET inviteCode = 0 WHERE inviteCode=(SELECT inviteCode FROM agent where id='{$id}')";
    $query = mysql_query($update);
    $affected = mysql_affected_rows();
    if($affected){
        $single = 1;        
    }else{
        $single = -1;
    }
    return $single;
}
/**
 * 查询一周内销量
 */
function select_orders($time){
    $select = "SELECT * FROM orders WHERE createAt LIKE '%{$time}%' AND type='user'";
    //var_dump($select);exit;
    $query = mysql_query($select);
    $data =[] ;
    $num = 0;
    while ($row =mysql_fetch_assoc($query)['cardNumber']) {
       $num += $row;
    }
    if ($num) {
       return $num;    
    }else{
        return '';
    }
}
/*
 * 查询代理销量
 */
function select_Yesterday(){
    $time = date( "Y-m-d",strtotime("-1 day") );
    // echo $time;
    $select ="SELECT inviteCode from agent";
    $query = mysql_query($select);
    $data = [];
    $orders = [];
    while ($row = mysql_fetch_assoc($query)) {
        $data[] = $row['inviteCode'];
        //var_dump($row['inviteCode']);
    }
    for($i=0;$i<count($data);$i++){
        $result = total_order($time,$data[$i]);
        if($result){
            $orders[] = $result;
        }
    }
    //if( $orders ){
        return $orders;
    //}
}

function total_order($time,$inviteCode){
    $select = "SELECT * FROM orders WHERE createAt LIKE '%{$time}%' AND inviteCode='{$inviteCode}'";
    $query = mysql_query($select);
    $data = [];
    $cardNumber = 0;
    while ($row = mysql_fetch_assoc($query)) {
        $data['inviteCode'] = $inviteCode = $row['inviteCode'];
        $data['cardNumber'] = $cardNumber += $row['cardNumber'];
        $data['count'] = $count = $row['t_price'];
        $data['username'] = $username = $row['chargername'];
    }
    if($data){
        update_sellMax($data['cardNumber'], $data['inviteCode']);
        return $data;
    }
}
/**
 * 更新最大日销售量
 */
function update_sellMax($max,$inviteCode){
    $update = "UPDATE agent SET sellMax = '{$max}' WHERE sellMax<'{$max}' AND inviteCode = '{$inviteCode}'";
    $query = mysql_query( $update );
}

/**
 * commit()  mysql事务
 * myTable 充值人表
 * objTable 被充值人表
 * cardNum 房卡
 * t_price 总价
 * id 对象ID
 */
function commit($myTable="agent",$objTable="users",$id,$cardNum,$count){
    $data =[];
    if($objTable == "users"){
        $type = "user";
    }else{
        $type = "agent";
    }
    mysql_query("SET AUTOCOMMIT=0");    #不自动提交
    mysql_query("START TRANSACTION");   #开始事务

    $update_agent = "UPDATE $myTable set cardNumber = cardNumber-$cardNum,count = count+$count where id=".$_SESSION['id'];
    if($myTable =="admin"){             #统计管理员充值量
        $update_agent = "UPDATE $myTable set cardNumber = cardNumber+$cardNum,count = count+$count where id=".$_SESSION['id'];
    }

    $update_users = "UPDATE $objTable set cardNumber = cardNumber+$cardNum where id=".$id;
    $result_agent = mysql_query($update_agent);     #
    $result_users = mysql_query($update_users);     #

    if($_SESSION['type']!="admin"){
        $agent_total = update_totalCardNum("agent_recharge",$_SESSION['id'],$cardNum,$count);
    }else{
        $agent_total = true;
    }
    $user_total = update_totalCardNum("user_recharge",$id,$cardNum,$count);
    $orders = insert_orders($id,$cardNum,$count,"10折",$type,$_SESSION['inviteCode']);

    if($result_agent && $result_users && $agent_total && $user_total && $orders){
        mysql_query("COMMIT");      #提交成功
        updata_log('成功给ID：'.$id.'充值房卡'.$cardNum.'张');
        $data['nowCardNum'] = select_cardNum($id,$objTable);  #充值后的房卡
        $data['result'] = 1;
    }else{
        mysql_query("ROLLBACK");    #事件回滚
        $data['result'] = -1;
    }
    mysql_query("END");
    mysql_query("SET AUTOCOMMIT=1"); 
    $data['userId'] = $id;
    return  $data;
}


function change_ip($ip){
    if( strpos($ip,'::ffff:')!==false ){
        $ip = explode("::ffff:", $ip)[1];
        //var_dump($ip);exit;
    }
    $ipInfos = convertip($ip);
    return $ipInfos;
}

/**
 * 转IP地址为实际位置
 * 
 */
function convertip($ip) {
    $ipAddr2 = '';
    $ipAddr1 = '';
    $ip1num ='';
    $ip2num ='';
    //IP数据文件路径
    $dat_path = '../admin/statics/QQWry.Dat';
    //检查IP地址
    //if(!preg_match("/^d{1,3}.d{1,3}.d{1,3}.d{1,3}$/", $ip)) {
    //    return 'IP Address Error';
    //}
    //打开IP数据文件
    if(!$fd = @fopen($dat_path, 'rb')){
        return 'IP date file not exists or access denied';
    }
    //分解IP进行运算，得出整形数
    $ip = explode('.', $ip);
    $ipNum = $ip[0] * 16777216 + $ip[1] * 65536 + $ip[2] * 256 + $ip[3];
    //echo  $ipNum;
    //获取IP数据索引开始和结束位置
    $DataBegin = fread($fd, 4);
    $DataEnd = fread($fd, 4);
    $ipbegin = implode('', unpack('L', $DataBegin));
    if($ipbegin < 0) $ipbegin += pow(2, 32);
    $ipend = implode('', unpack('L', $DataEnd));
    if($ipend < 0) $ipend += pow(2, 32);
    $ipAllNum = ($ipend - $ipbegin) / 7 + 1;
    $BeginNum = 0;
    $EndNum = $ipAllNum;
    //使用二分查找法从索引记录中搜索匹配的IP记录
    while($ip1num>$ipNum || $ip2num<$ipNum) {
        $Middle= intval(($EndNum + $BeginNum) / 2);
        //偏移指针到索引位置读取4个字节
        fseek($fd, $ipbegin + 7 * $Middle);
        $ipData1 = fread($fd, 4);
        if(strlen($ipData1) < 4) {
            fclose($fd);
            return 'System Error';
        }
        //提取出来的数据转换成长整形，如果数据是负数则加上2的32次幂
        $ip1num = implode('', unpack('L', $ipData1));
        if($ip1num < 0) $ip1num += pow(2, 32);
        //提取的长整型数大于我们IP地址则修改结束位置进行下一次循环
        if($ip1num > $ipNum) {
            $EndNum = $Middle;
            continue;
        }
        //取完上一个索引后取下一个索引
        $DataSeek = fread($fd, 3);
        if(strlen($DataSeek) < 3) {
            fclose($fd);
            return 'System Error';
        }
        $DataSeek = implode('', unpack('L', $DataSeek.chr(0)));
        fseek($fd, $DataSeek);
        $ipData2 = fread($fd, 4);
        if(strlen($ipData2) < 4) {
            fclose($fd);
            return 'System Error';
        }
        $ip2num = implode('', unpack('L', $ipData2));
        if($ip2num < 0) $ip2num += pow(2, 32);
        //没找到提示未知
        if($ip2num < $ipNum) {
            if($Middle == $BeginNum) {
                fclose($fd);
                return 'Unknown';
            }
            $BeginNum = $Middle;
        }
    }
    $ipFlag = fread($fd, 1);
    if($ipFlag == chr(1)) {
        $ipSeek = fread($fd, 3);
        if(strlen($ipSeek) < 3) {
            fclose($fd);
            return 'System Error';
        }
        $ipSeek = implode('', unpack('L', $ipSeek.chr(0)));
        fseek($fd, $ipSeek);
        $ipFlag = fread($fd, 1);
    }
    if($ipFlag == chr(2)) {
        $AddrSeek = fread($fd, 3);
        if(strlen($AddrSeek) < 3) {
            fclose($fd);
            return 'System Error';
        }
        $ipFlag = fread($fd, 1);
        if($ipFlag == chr(2)) {
            $AddrSeek2 = fread($fd, 3);
            if(strlen($AddrSeek2) < 3) {
                fclose($fd);
                return 'System Error';
            }
            $AddrSeek2 = implode('', unpack('L', $AddrSeek2.chr(0)));
            fseek($fd, $AddrSeek2);
        } else {
            fseek($fd, -1, SEEK_CUR);
        }
        while(($char = fread($fd, 1)) != chr(0))
            $ipAddr2 .= $char;
        $AddrSeek = implode('', unpack('L', $AddrSeek.chr(0)));
        fseek($fd, $AddrSeek);
        while(($char = fread($fd, 1)) != chr(0))
            $ipAddr1 .= $char;
    } else {
        fseek($fd, -1, SEEK_CUR);
        while(($char = fread($fd, 1)) != chr(0))
            $ipAddr1 .= $char;
        $ipFlag = fread($fd, 1);
        if($ipFlag == chr(2)) {
            $AddrSeek2 = fread($fd, 3);
            if(strlen($AddrSeek2) < 3) {
                fclose($fd);
                return 'System Error';
            }
            $AddrSeek2 = implode('', unpack('L', $AddrSeek2.chr(0)));
            fseek($fd, $AddrSeek2);
        } else {
            fseek($fd, -1, SEEK_CUR);
        }
        while(($char = fread($fd, 1)) != chr(0)){
            $ipAddr2 .= $char;
        }
    }
    fclose($fd);
    //最后做相应的替换操作后返回结果
    if(preg_match('/http/i', $ipAddr2)) {
        $ipAddr2 = '';
    }
    $ipaddr = "$ipAddr1 $ipAddr2";
    $ipaddr = preg_replace('/CZ88.Net/is', '', $ipaddr);
    $ipaddr = preg_replace('/^s*/is', '', $ipaddr);
    $ipaddr = preg_replace('/s*$/is', '', $ipaddr);
    if(preg_match('/http/i', $ipaddr) || $ipaddr == '') {
        $ipaddr = 'Unknown';
    }
 $ipaddr = iconv('gbk', 'utf-8//IGNORE', $ipaddr); //转换编码，如果网页的gbk可以删除此行
    return $ipaddr;
}

function get_card($price){
    $select = "SELECT num FROM package WHERE price = $price";
    $query = mysql_query($select);
    $num = mysql_fetch_assoc( $query );
    $cardNum = $num['num'];
    return $cardNum;
}