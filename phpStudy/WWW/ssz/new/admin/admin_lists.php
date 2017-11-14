<?php require_once('common.php'); ?>

<?php 
/**
 * admin/admin_lists.php
 * 管理员列表
 */
#判断是否是管理员登录
if($_SESSION['type']!="admin"){
    $ip = get_real_ip();
    updata_log( "代理:".$_SESSION['nickname'].",账户:".$_SESSION['username']."尝试进入后台管理员系统,时间".date("Y-m-d H:i:s",time()) );
    alert_go("兄台！你想干什么","index.php");exit;
}
# 页面标题
$web_title = '管理员列表';

# 数据表名
$table_name = 'admin';
# 构建查询语句
$query = "SELECT * FROM {$table_name}";
// var_dump( $query );
$result = mysql_query($query);
# 从结果集中读取数据
$data = array();
while ( $row = mysql_fetch_assoc($result) ) {
    $data[] = $row;
}
// print_r( $data );exit;

?>
		
<?php require_once('common-header.php'); ?>
		<!-- 内容区域 -->
			
		<div id="page-wrapper" class="gray-bg dashbard-1">
            <!-- 面包屑 -->
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>管理员列表</h2>
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
                                <h5>管理员列表</h5>
                                <div class="col-md-4">
                                    <a href="admin_add.php" class="btn btn-xs btn-info ">
                                      添加
                                    </a>
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
            
            <th >序号</th>
            <th>名称</th>
            <th>帐号</th>
            <th >房卡</th>
            <th width="120px;" >操作</th>
        </tr>
    </thead>
    <tbody>
    
        <?php foreach($data as $key=>$value){ ?>
        <tr>
            <td> <?php echo $key+1;?> </td>
            <td> <?php echo $value['nickname'];?> </td>
            <td> <?php echo $value['username'];?> </td>
            <td> <?php echo $value['cardNumber'];?> </td>
            <?php if($value['level'] != 127){ ?>
            <td>
                <a href="admin_edit.php?id=<?php echo $value['id'];?>" class="btn btn-xs btn-outline btn-success">编辑</a>
                <a href="admin_del.php?id=<?php echo $value['id'];?>&action=1" class="btn btn-xs btn-outline btn-success">删除</a>
            </td>
            <?php }else{ ?>
                 <td>不能操作</td>
            <?php } ?>
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