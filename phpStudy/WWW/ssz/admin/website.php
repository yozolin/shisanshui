<?php require_once('common.php'); ?>
<?php 

/**
 * admin/webmsg.php
 */

#判断是否是管理员登录
if($_SESSION['type']!="admin"){
    $ip = get_real_ip();
     updata_log( "代理:".$_SESSION['nickname'].",账户:".$_SESSION['username']."尝试进入后台管理员系统,时间".date("Y-m-d H:i:s",time()) );
    alert_go("兄台！你想干什么","index.php");exit;
}
# 页面标题
$web_title = '系统消息';

# 判断当前操作是 显示页面 还是 处理表单页面
$action = isset($_POST['action']) ? true : false;

# 表名
$table_name = 'website';
# 单页的标识
$url = "website.php";

if( $action ){
    
    $broadcast = $_POST['broadcast']; # 处理表单页面
    $id = $_POST['id'];  
    $time = time();     # 更新时间
    $query = "UPDATE {$table_name} SET broadcast='{$broadcast}' WHERE id='{$id}'";
    // var_dump($query);exit;
    mysql_query($query);
    # 是否更新成功
    $logs = mysql_affected_rows();
    if($logs){
        alert_go('系统消息更新成功',$url);
    }else{
        alert_go('系统消息更新失败，网络原因，请稍后再试');
    }
    # 阻止往下执行：不需要显示页面
    exit;
}else{

    $query = "SELECT * FROM {$table_name}";
    $result = mysql_query($query);
    $single = mysql_fetch_assoc($result);
}

?>
<?php require_once('common-header.php'); ?>
        
        <!-- 内容区域 -->
            
        <div id="page-wrapper" class="gray-bg dashbard-1">
            <!-- 面包屑 -->
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2><?php echo $single['info']; ?></h2>
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
                                <h5><?php echo $single['info']; ?> <small>更新信息</small></h5>
                            </div>
                            <div class="ibox-content">
    
    <!-- 表单 -->
    <form method="post" class="form-horizontal" enctype="multipart/form-data" action="">
     
        <!-- 内容 -->
        <div class="form-group">
            <label class="col-sm-2 control-label">内容</label>
            <div class="col-sm-10">
                <textarea name="broadcast" id="editor" class="form-control heightAuto" ><?php echo $single['broadcast']; ?></textarea>
            </div>
        </div>
        <div class="hr-line-dashed"></div>

        <div class="form-group">
            <div class="col-sm-4 col-sm-offset-2">
                <input type="hidden" name="action" value="1">
                <input type="hidden" name="id" value="<?php echo $single['id']; ?>">
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