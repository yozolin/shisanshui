<?php require_once('common.php'); ?>

<?php 
/**
 * admin/user_ranking.php
 * 充值排行
 */
# 页面标题
$web_title = '充值排行';

# 数据表名
$table_name = 'user_recharge';

// ********* 分页 *********
# $limit 指的是 每页显示多少条记录 ：偏移量
$limit = ADMIN_LIMIT;
# 当前页码 : 安全过滤
$page = isset($_GET['page']) ? $_GET['page'] : 1;
$page = intval($page);
$page = $page ? $page : 1;
# 当前页的 起点 
$start = ($page-1)*$limit;
// ********* 分页end ********* 

# 构建查询语句
// $where= '';
// if($_SESSION['type']!="admin"){
//     $inviteCode = $_SESSION['inviteCode'];
//     $where = " where inviteCode = '{$inviteCode}' ";
// }
// $query = "SELECT * FROM {$table_name} {$where} ORDER BY totalNum desc limit {$start},{$limit} ";
// # 发送指令。得到一个 结果集 
// // var_dump($result); die();
// $result = mysql_query($query);

// # 从结果集中读取数据
// $data = array();
// while ( $row = mysql_fetch_assoc($result) ) {
//     $data[] = $row;
// }
// print_r( $data );

######## 分页
# 查询出 数据表中有多少条记录？
$where = '';
if($_SESSION['type']!="admin"){
    $inviteCode = $_SESSION['inviteCode'];
    $where = "where inviteCode = '{$inviteCode}'";
}
$total = 0;
$query = "SELECT count(*) as nums FROM {$table_name} {$where}";
//var_dump($query);exit;
$result = mysql_query($query);
// var_dump($result);
$row = mysql_fetch_assoc($result);
$total = intval( $row['nums'] );
//var_dump($total);

$total_pages = ceil($total/$limit);
$user_totalCarNum = select_totalCardNum("user_recharge","20","DESC");
// var_dump($user_totalCarNum);exit;
######## 分页 end

?>	
<?php require_once('common-header.php'); ?>	
		<!-- 内容区域 -->
			
		<div id="page-wrapper" class="gray-bg dashbard-1">
	        <!-- 面包屑 -->
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>充值排行</h2>
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
                                <h5>排行统计</h5>
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
            
            <th width="">排行</th>
            <th width="">充值量</th>
            <th width="">ID</th>
            <th width="">用户帐号</th>
            <th width="">真实姓名</th>
            <th width="">注册时间</th>
            
        </tr>
    </thead>
    <tbody>
    
    <?php foreach($user_totalCarNum as $key=>$value){ ?>
        <tr>
            <td><?php echo $key+$start+1;?></td>    
            <td><?php echo $value['totalNum'];?></td>
            <td><?php echo $value['id'];?></td>
            <td><?php echo $value['nickname'];?></td>
            <td><?php if($value['sex']){echo "男";}else{echo "女";};?></td>
            <td><?php echo $value['createAt'];?></td>
        </tr>
    <?php }?>

    </tbody>
</table>
<!-- 表格数据 end -->

        <div class="btn-group pull-left">
        </div> 

        <div class="btn-group pull-right">
            <!-- <a class="btn btn-white" href="2.html">上一页</a> -->
            <!-- <button class="btn btn-white active">1</button> -->
        
<?php for($i=1; $i<=$total_pages ; $i++ ){?>
            
            <?php if($i != $page){?>
                <a class="btn btn-white" href="user_ranking.php?page=<?php echo $i;?>">
                    <?php echo $i;?>
                </a>
            <?php }else{?>
                <button class="btn btn-white active">
                    <?php echo $i;?>
                </button>
            <?php }?>

<?php }?>

            <!-- <a class="btn btn-white" href="8.html">下一页</a> -->
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
