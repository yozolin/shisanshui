<?php require_once('common.php'); ?>
<?php 
/**
 * admin/add.php
 * 添加管理员页面 
 */
# 页面标题
$web_title = '添加管理员';
#判断是否是管理员登录
if($_SESSION['type']!="admin"){
    $ip = get_real_ip();
    updata_log( "代理:".$_SESSION['nickname'].",账户:".$_SESSION['username']."尝试进入后台管理员系统,时间".date("Y-m-d H:i:s",time()) );
    alert_go("兄台！你想干什么","index.php");exit;
}
# 判断当前操作是 显示页面 还是 处理表单页面
$action = isset($_POST['action']) ? $_POST['action'] : false;
if($action){
    // var_dump($_POST);
    $nickname = $_POST['nickname'];
    $username = $_POST['username'];
    $password = $_POST['password'];
    $re_password = $_POST['re_password'];

    if( !$nickname ){
        alert_go('名称不能为空');
        exit;
    }
    if( !$username ){
        alert_go('账号不能为空');
        exit;
    }
    if( !$password ){
        alert_go('密码不能为空');
        exit;
    }
    if($password != $re_password){
        alert_go('两次输入的密码不一致，请重新输入');
        exit;
    }
    $select= "select * from admin where username = '{$username}'";
    $query = mysql_query($select);
    $result = mysql_fetch_assoc($query);
    if($result){
        alert_go("账户名已经存在");exit;
    }
   
    $crypt = rand_string();  # 随机字符串
    
    $pwd = create_pwd($password,$crypt);

    $createAt = date('H-m-d H:i:s',time());
    $query = "INSERT INTO admin (nickname,username,password,crypt,createAt)
    VALUES('{$nickname}', '{$username}', '{$pwd}', '{$crypt}', '{$createAt}' );";

    # 发送指令
    mysql_query($query);

    # 判断是否成功插入数据
    $new_id = mysql_insert_id();
    if( $new_id ){
        updata_log("成功添加管理员，昵称：".$nickname.",用户名：".$username);
        alert_go('成功新增管理员','admin_lists.php');
    }else{
        alert_go('新增失败：网络原因，请稍后再试');
    }
    exit;   # 阻止往下执行
}else{
    # 显示页面

}

?>
<?php require_once('common-header.php'); ?>

		<!-- 内容区域 -->
			
		<div id="page-wrapper" class="gray-bg dashbard-1">
	        <!-- 面包屑 -->
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>添加管理员</h2>
                    <ol class="breadcrumb">
                        <li><a href="index.php">首页</a></li>
                        <li><a href="admin_lists.php">管理员列表</a></li>
                    </ol>
                </div>
            </div>

            <!-- 表格 -->
            <div class="wrapper wrapper-content animated fadeInRight">
                
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-title">
                                <h5>添加管理员 <small>填写信息</small></h5>
                            </div>
                            <div class="ibox-content">
    
    <!-- 表单 -->
    <form method="post" class="form-horizontal" action="">
        
        <!-- 名称 -->
        <div class="form-group">
            <label class="col-sm-2 control-label">名称</label>
            <div class="col-sm-5">
                <input type="text" class="form-control" placeholder="输入管理员的名称" name="nickname">
            </div>
        </div>
        <div class="hr-line-dashed"></div>
        
        <!-- 账户 -->
        <div class="form-group">
            <label class="col-sm-2 control-label">账户</label>
            <div class="col-sm-5">
                <input type="text" class="form-control" placeholder="输入管理员的名称" name="username">
            </div>
        </div>
        <div class="hr-line-dashed"></div>
     
        <!-- 密码 -->
        <div class="form-group">
            <label class="col-sm-2 control-label">密码</label>
            <div class="col-sm-5">
                <input type="password" class="form-control" name="password" placeholder="请输入管理员的密码，密码不能少于6位">
            </div>
        </div>
        <div class="hr-line-dashed"></div>
     
        <!-- 再次确认密码 -->
        <div class="form-group">
            <label class="col-sm-2 control-label">再次确认密码</label>
            <div class="col-sm-5">
                <input type="password" class="form-control" name="re_password" placeholder="请再次密码">
            </div>
        </div>
        <div class="hr-line-dashed"></div>

        <div class="form-group">
            <div class="col-sm-4 col-sm-offset-2">
                <input type="hidden" name="action" value="1">
                <button class="btn btn-primary" type="submit">提交表单</button>
            </div>
        </div>
    </form>
    <!-- 表单end -->
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <!-- 表格end -->
            

        </div>
		<!-- 内容区域end -->
		

    </div>
<?php require_once('common-footer.php'); ?>