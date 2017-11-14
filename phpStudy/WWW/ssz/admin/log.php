<?php require_once('common.php'); ?>

<?php 
/**
 * admin/admin_log.php
 * 操作日志表 
 */

#判断是否是管理员登录
if($_SESSION['type']!="admin"){
    $ip = get_real_ip();
     updata_log( "代理:".$_SESSION['nickname'].",账户:".$_SESSION['username']."尝试进入后台管理员系统,时间".date("Y-m-d H:i:s",time()) );
    alert_go("兄台！你想干什么","index.php");exit;
}
$web_title = '操作日志'; # 页面标题
$table_name = 'log'; # 数据表名

$query = "SELECT * FROM {$table_name} ORDER by login DESC";
$result = mysql_query($query);
$data = [];
while ( $row = mysql_fetch_assoc($result) ) {
    $data[] = $row;
}
/*--------------------------------搜索-------------------------------*/ 
$action = isset($_POST['action'])?$_POST['action'] :false;
if($action){
    $data = [];
    $username = $_POST['username'];
    $query = "SELECT * FROM {$table_name} where username = '{$username}' ORDER by login DESC";
    $result = mysql_query($query);
    while ( $row = mysql_fetch_assoc($result) ) {
        $data[] = $row;
    }  
}
/*--------------------------------搜索-------------------------------*/ 
?>
<?php require_once('common-header.php'); ?>
		<!-- 内容区域 -->
			
		<div id="page-wrapper" class="gray-bg dashbard-1">
            <!-- 面包屑 -->
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>操作日志</h2>
                    <ol class="breadcrumb">
                    </ol>
                </div>
            </div> 
            <h6 style="height:15px"></h6>
            <form class="log-form" action="" method="post" style="">
                <div class="" style="position: relative;height:50px;">
                  <input type="text" class="form-control"  placeholder="请输入需要查询的账户" style="height:50px;" name="username">
                  <input type="hidden" name="action" value="1">
                  <!-- <span class="btn btn-primary nput-group-addon user-form" id="submit-btn">确定</span> -->
                  <input type="submit" class="btn btn-info input-group-addon user-form" value="搜索">
                </div>
                
            </form>
            <!-- 表格 -->
            <div class="wrapper wrapper-content animated fadeInRight">

                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            
                            <div class="ibox-title">
                                <h5>操作日志</h5>
                                <div class="col-md-4">
                                </div>
                                <div class="ibox-tools">
                                     
                                </div>
                            </div>

                            <div class="ibox-content">
                                
                                <div class="table-responsive">


<!-- 表格数据 end -->
<table class="table table-striped table-bordered table-hover dataTables-example dataTable">
    <thead>
        <tr>
            
            <th width="40px">ID</th>
            <th width="50px">帐号</th>
            <th width="80px">昵称</th>
            <th width="90px">登录时间</th>
            <th width="90px">退出时间</th>
            <th width="">操作内容</th>
            <th width="90px">ip地址</th>
        </tr>
    </thead>
    <tbody>
    
        <?php foreach($data as $key=>$value){ ?>
        <tr>
            <td > <?php echo $value['id'];?> </td>
            <td > <?php echo $value['username'];?> </td>
            <td > <?php echo $value['nickname'];?> </td>
            <td > <?php echo $value['login'];?> </td>
            <?php if(!$value['logout']){?>
            <td width=""></td>  
            <?php }else{?> 
            <td ><?php echo $value['logout']; ?></td>
            <?php } ?>
            <td ><?php if($value['content']){echo $value['content'];}else{echo "什么也没干";} ?></td>     
            <td> <?php echo ($value['ipAddress']);?> </td>
        </tr>
        <?php }?>
    </tbody>
</table>
<!-- 表格数据 end -->
        <div class="btn-group pull-left">
        </div> 
        <div class="btn-group pull-right">
        </div>
                                </div>
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