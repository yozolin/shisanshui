<?php require_once('common.php'); ?>
<?php 
/**
 * admin/agent_add.php
 * 添加代理
 */
# 页面标题
#判断是否是管理员登录
if($_SESSION['type']!="admin"){
    $ip = get_real_ip();
     updata_log( "代理:".$_SESSION['nickname'].",账户:".$_SESSION['username']."尝试进入添加管理系统,时间".date("Y-m-d H:i:s",time()) );
    alert_go("兄台！你想干什么","index.php");exit;
}
$web_title = '添加代理';
$action = isset($_POST['action']) ? true : false;
if( $action ){
    # 代理信息
    $agent_name = $_POST['agent_name'];
    $agent_user = $_POST['agent_user'];
    $agent_password = $_POST['agent_password'];
    $agent_repass = $_POST['agent_repass'];
    $agent_phone = $_POST['agent_phone'];
    $agent_level =intval(select_level());

    if( $_SESSION['level']>=3 && $_SESSION['level'] !=127){
        alert_go('三级代理不能添加代理',"user_lists.php");
        exit;
    }else{
        if($_SESSION['type'] != "admin"){ 
            if( ($agent_level-1)!=0 ){
                $result = select_user($_SESSION['type'],$_SESSION['id']);
                $nickname = $result['nickname'];
                $superior = $nickname ;
            }
        }else{
            $result = select_user("agent");
            $superior = "无上级代理";
        }
        if($agent_user==$result['username']){
             alert_go('该代理用户已经存在');
             exit;
        }
    }
    // var_dump($superior);exit;
    if(strlen($agent_password)<6){
        alert_go('密码长度不能少于6位');
        exit;
    }
    if( !$agent_user ){
        alert_go( '代理用户名不能为空');
        exit;
    }
    if( !$agent_password ||  !$agent_repass){
        alert_go( '代理密码不能为空' );
        exit;
    }
    if( $agent_password != $agent_repass){
        alert_go( '两次密码不相同' );
        exit;
    }
    if($_SESSION['type']!="amin"){
        // $select = "select ";
        $pid = $_SESSION['inviteCode'];
    }else{
        $pid = $_SESSION['id'];
    }
    $crypt = rand_string();
    $pwd = create_pwd($agent_password,$crypt);
    # 获取时间 
    $time = date("Y-m-d H:i:s",time()); 
    $inviteCode = create_inviteCode(0);
    $query = "INSERT INTO agent ( nickname,username,password,crypt,superior,pid,phone,level,inviteCode,createAt) 
            VALUES('{$agent_name}','{$agent_user}','{$pwd}','{$crypt}','{$superior}','{$pid}','{$agent_phone}','{$agent_level}','{$inviteCode}','{$time}')";
    // var_dump($query);exit;
    mysql_query($query);
    # 判断是否成功执行
    $new_id = mysql_insert_id();
    if($new_id){
        // 更新日志
        updata_log('成功添加代理，代理名：'.$agent_user.'，真实姓名：'.$agent_name.'，电话:'.$agent_phone);
        alert_go('添加成功','agent_lists.php');
    }else{
        alert_go('添加失败！网络问题，请稍后重试');
    }
    exit;
}else{
    # 显示页面
// var_dump($_SESSION['level']);exit;
}

?>
<?php require_once('common-header.php'); ?> 
        <!-- 内容区域 -->
            
        <div id="page-wrapper" class="gray-bg dashbard-1">
            <!-- 面包屑 -->
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>添加代理</h2>
                    <ol class="breadcrumb">
                        <li><a href="index.php">首页</a></li>
                        <li><a href="agent_lists.php">代理管理</a></li>
                        <li><a href="agent_add.php">添加代理</a></li>
                    </ol>
                </div>
            </div>

            <!-- 表格 -->
            <div class="wrapper wrapper-content animated fadeInRight">
                
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-title">
                                <h5>添加代理 <small>填写信息</small></h5>
                            </div>
                            <div class="ibox-content">
    
    <!-- 表单 -->
    <form method="post" class="form-horizontal" enctype="multipart/form-data" action="">
        <p>温馨提示：带<span class="glyphicon glyphicon-star"></span>是必填项</p>
        <div class="hr-line-dashed"></div>
        <!-- 昵称 -->
        <div class="form-group">
            <label class="col-sm-2 control-label">昵称</label>
            <div class="col-sm-5">
                <input type="text" name="agent_name" class="form-control" placeholder="请输入真实姓名">
            </div>
        </div>
        <div class="hr-line-dashed"></div>

        <div class="form-group">
            <label class="col-sm-2 control-label">手机号</label>
            <div class="col-sm-5">
                 <input type="text" name="agent_phone" class="form-control" placeholder="请输入手机号">
            </div>
        </div>
        <div class="hr-line-dashed"></div>

        <!-- 名称 -->
        <div class="form-group">
            <label class="col-sm-2 control-label"><span class="glyphicon glyphicon-star"></span>用户名</label>
            <div class="col-sm-5">
                <input type="text" class="form-control"  name="agent_user" value="" placeholder="请输入用户名">
            </div>
        </div>
        <div class="hr-line-dashed"></div>
     
        <!--  -->
        <div class="form-group">
            <label class="col-sm-2 control-label"><span class="glyphicon glyphicon-star"></span>密码</label>
            <div class="col-sm-5">
                <input type="password" name="agent_password" class="form-control" placeholder="请输入密码">
            </div>
        </div>
        <div class="hr-line-dashed"></div>

        <div class="form-group">
            <label class="col-sm-2 control-label"><span class="glyphicon glyphicon-star"></span>确认密码</label>
            <div class="col-sm-5">
                 <input type="password" name="agent_repass" class="form-control" placeholder="请确认密码">
            </div>
        </div>
        <div class="hr-line-dashed"></div>
     
        <div class="form-group">
            <label class="col-sm-2 control-label">会员级别</label>
            <div class="col-sm-5">
                 <input type="text" name="agent_level" class="form-control" placeholder="" value="<?php if( $_SESSION['level']>=3 && $_SESSION['type']!="admin"){echo "不能添加代理";}else{ echo select_level(); } ?>" disabled="">
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
