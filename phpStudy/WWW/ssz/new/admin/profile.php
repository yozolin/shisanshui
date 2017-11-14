<?php require_once('common.php'); ?>
<?php 
/**
 * admin/profile.php
 * 个人信息
 */
# 页面标题
$web_title = '个人信息';
$action = isset($_POST['action']) ? true : false;
if($action){
    $nickname = $_POST['nickname'];         # 昵称
    $wechat = $_POST['wechat'];     # 微信
    $qq = $_POST['qq'];             # QQ
    $phone = $_POST['phone'];       # 电话
    $sex = $_POST['sex'];           # 性别
    //var_dump( $sex );exit;
    if( !$nickname ){
        alert_go('用户名不能为空');
        exit;
    } 
    $time = date("Y-m-d H:i:s",time()); # 当前时间
    $id = $_SESSION['id'];
    $table = $_SESSION['type'];
    $query = "UPDATE $table SET username='{$nickname}',qq='{$qq}',wechat='{$wechat}',phone='{$phone}',sex='{$sex}', updateAt ='{$time}' WHERE id={$id};";
    //var_dump($query);  exit;
    mysql_query($query);
    $affected = mysql_affected_rows(); # 判断下是否成功更新
    if($affected){
        # 成功修改后，需要更新 session
        $_SESSION['nickname'] = $nickname;
        alert_go('成功修改个人信息','profile.php');
        exit;
    }else{
        alert_go('修改失败：网络出错，请稍后重试');
    }
    # 阻止往下执行
    exit;
}else{
    $cardNum = select_cardNum($_SESSION['id'],$_SESSION['type']);
    $result = select_user($_SESSION['type'],$_SESSION['id']);
    //var_dump($result);exit;
}

?>
<?php require_once('common-header.php'); ?>
		<!-- 内容区域 -->
		<div id="page-wrapper" class="gray-bg dashbard-1">
	        <!-- 面包屑 -->
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>修改我的个人信息</h2>
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
                                <h5>修改我的个人信息 <small></small></h5>
                            </div>
                            <div class="ibox-content">
    <!-- 表单 -->
    <form method="post" class="form-horizontal" action="">
        <?php if($_SESSION['type']!="admin"){ ?>
        <!--唯一验证码 -->
        <div class="form-group">
            <label class="col-sm-2 control-label">唯一验证码</label>
            <div class="col-sm-5">
                <input type="text" class="form-control" placeholder="" value="<?php 
                echo isset($_SESSION['inviteCode']) ? $_SESSION['inviteCode'] : '请联系管理员';
                ?>" name="inviteCode" readonly> 
            </div>
        </div>
        <div class="hr-line-dashed"></div>

        <div class="form-group">
            <label class="col-sm-2 control-label">我的房卡</label>
            <div class="col-sm-5">
                <input type="text" class="form-control" placeholder="" value="<?php 
                echo $cardNum ?>" name="cardNum" readonly> 
            </div>
        </div>
        <div class="hr-line-dashed"></div>
        <?php } ?>
        <!-- 姓名 -->
        <div class="form-group">
            <label class="col-sm-2 control-label">昵称</label>
            <div class="col-sm-5">
                <input type="text" class="form-control" placeholder="" value="<?php echo isset($result['nickname']) ? $result['nickname'] : '';?>" name="nickname">
            </div>
        </div>
        <div class="hr-line-dashed"></div>
        <!-- 微信 -->
        <div class="form-group">
            <label class="col-sm-2 control-label">微信</label>
            <div class="col-sm-5">
                <input type="text" class="form-control" placeholder="" value="<?php echo isset($result['wechat']) ? $result['wechat'] : '';?>" name="wechat">
            </div>
        </div>
        <div class="hr-line-dashed"></div>
        <!-- QQ -->
        <div class="form-group">
            <label class="col-sm-2 control-label">QQ</label>
            <div class="col-sm-5">
                <input type="text" class="form-control" placeholder="" value="<?php echo isset($result['qq']) ? $result['qq'] : '';?>" name="qq">
            </div>
        </div>
        <div class="hr-line-dashed"></div>
        <!-- 电话 -->
        <div class="form-group">
            <label class="col-sm-2 control-label">电话</label>
            <div class="col-sm-5">
                <input type="text" class="form-control" placeholder="" value="<?php echo isset($result['phone']) ? $result['phone'] : '';?>" name="phone">
            </div>
        </div>
        <div class="hr-line-dashed"></div>
        <!-- 性别 -->
        <div class="form-group">
            <label class="col-sm-2 control-label">性别</label>
            <div class="col-sm-1">
                <select name="sex" id="sex" class="form-control">
                    <option value="1" <?php if($result["sex"]==1){echo "selected";} ?> >男</option>
                    <option value="0" <?php if($result["sex"]==0){echo "selected";} ?> >女</option>
                    <option value="2" <?php if($result["sex"]==2){echo "selected";} ?> >保密</option>
                </select>
            </div>
        </div>
        <div class="hr-line-dashed"></div>
        <div class="form-group">
            <div class="col-sm-4 col-sm-offset-2">
                <input type="hidden" name="action" value="1">
                <button class="btn btn-primary" type="submit">确定</button>
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
