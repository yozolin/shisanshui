<?php require_once('common.php'); ?>
<?php
/**
 * admin/change_password.php
 * 修改密码 的页面
 */
# 页面标题
$web_title = '修改密码';

# 判断当前操作是 显示页面 还是 处理表单页面
$action = isset($_POST['action']) ? true : false;
if( $action ){
    # 处理表单页面
    // var_dump( $_POST );

    # 接收表单数据： 旧密码，新密码，重复密码
    $old_pwd = $_POST['old_pwd'];
    $new_pwd = $_POST['new_pwd'];
    $new_re_pwd = $_POST['new_re_pwd'];

    # 过滤
    if( !$old_pwd ){
        alert_go('旧密码不能为空');
        exit;
    }
    if( !$new_pwd ){
        alert_go('新密码不能为空');
        exit;
    }
    if( $old_pwd == $new_pwd ){
        alert_go('新密码与旧密码不能相同');
        exit;
    }
    if( $new_pwd != $new_re_pwd ){
        alert_go('两次输入的密码，不一致');
        exit;
    }
    
    # 要知道，到底要修改谁的信息？ 
    $id = $_SESSION['id'];

    # 检验一下 旧密码 是否正确
    if($_SESSION['type'] == "admin"){
         $query = "SELECT password,crypt FROM admin WHERE id=".$id;
    }else{
        $query = "SELECT password,crypt FROM agent WHERE id=".$id;
    }
    $result = mysql_query($query);
    $single = mysql_fetch_assoc($result);
    // var_dump($single);

    # 从数据库中读取的密码与加密因子
    $crypt = $single['crypt'];
    $password = $single['password'];

    # 用旧密码，生成旧密码加密后的密码
    $old_pwd = create_pwd( $old_pwd , $crypt );
    if( $old_pwd != $password ){
        alert_go( '你输入的旧密码不正确' );
        exit;
    }else{
        # 当前时间
        $time = date("Y-m-d H:i:s",time());
        # 用新密码，生成新密码加密后的密码
        $new_pwd_crypt = create_pwd( $new_pwd,$crypt );
        # 旧密码，正确的情况
        if($_SESSION['type'] == "admin"){
            $query = "UPDATE admin SET password='{$new_pwd_crypt}', updateAt ='{$time}' WHERE id={$id};";
        }else{
            $query = "UPDATE agent SET password='{$new_pwd_crypt}', updateAt ='{$time}' WHERE id={$id};";
        }
        // var_dump($query);exit;
        mysql_query($query);
        # 判断下是否成功更新
        $logs = mysql_affected_rows();
        if($logs){
            $_SESSION['is_login'] = 0;
            alert_go('成功修改密码，请重新登录','login.php');
            exit;
        }else{
            alert_go('修改失败：网络问题，请稍后重试');
        }
    }

    # 阻止往下执行
    exit;

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
                    <h2>修改密码</h2>
                    <ol class="breadcrumb">
                    </ol>
                </div>
            </div>
            
            <!-- 表格 -->
            <div class="wrapper wrapper-content animated fadeInRight">
                
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-title">
                                <h5>修改密码 <small></small></h5>
                            </div>
                            <div class="ibox-content">
    
    <!-- 表单 -->
    <form method="post" class="form-horizontal" action="">
        
        <!-- 旧密码 -->
        <div class="form-group">
            <label class="col-sm-2 control-label">旧密码</label>
            <div class="col-sm-5">
                <input type="password" class="form-control" placeholder=""  value="" name="old_pwd">
            </div>
        </div>
        <div class="hr-line-dashed"></div>
        
        <!-- 新密码 -->
        <div class="form-group">
            <label class="col-sm-2 control-label">新密码</label>
            <div class="col-sm-5">
                <input type="password" class="form-control" placeholder="" value="" name="new_pwd">
            </div>
        </div>
        <div class="hr-line-dashed"></div>
        
        <!-- 新密码 -->
        <div class="form-group">
            <label class="col-sm-2 control-label">再次输入新密码</label>
            <div class="col-sm-5">
                <input type="password" class="form-control" placeholder="" value="" name="new_re_pwd">
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