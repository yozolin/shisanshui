<?php require_once('common.php'); ?>

<?php 
/**
 * admin/product_lists.php
 * 产品列表 
 */
# 页面标题
$web_title = '用户充值记录';

# 数据表名
$table_name = 'orders';


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
$where = "where type = 'user'";
if($_SESSION['type'] != "admin"){
    $inviteCode = $_SESSION['inviteCode'] ;
    $where .= " and inviteCode = '{$inviteCode}'";
}
$query = "SELECT * FROM {$table_name} $where  ORDER BY id desc limit {$start},{$limit} ";
$result = mysql_query($query);
// var_dump($result); die();
# 从结果集中读取数据
$data = array();
while ( $row = mysql_fetch_assoc($result) ) {
    $data[] = $row;
}
######## 分页
# 查询出 数据表中有多少条记录？
$total = 0;
$query = "SELECT count(*) as nums FROM {$table_name} $where";
$result = mysql_query($query);
 //var_dump($query);exit;
$row = mysql_fetch_assoc($result);
$total = intval( $row['nums'] );
// var_dump($total);
# 计算出，一定要分多少页
$total_pages = ceil($total/$limit); 
// var_dump($total_pages);exit;

######## 分页 end

?>	
<?php require_once('common-header.php'); ?>	
		<!-- 内容区域 -->
			
		<div id="page-wrapper" class="gray-bg dashbard-1">
	        <!-- 面包屑 -->
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-sm-10">
                    <h2>用户充值记录</h2>
                    <ol class="breadcrumb">
                       
                    </ol>
                </div>
            </div>
            <!-- 表格 -->
            <div class="wrapper wrapper-content animated fadeInRight">
                
                <div class="row">
                    <div class="col-sm-12">
                        <div class="ibox float-e-margins">
                            
                            <div class="ibox-title">
                                <h5>充值统计</h5>
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
            
            <th width="">用户ID</th>
            <th width="">数目</th>
            <th width="">单价</th>
            <th width="">折扣</th>
            <th width="">总价</th>
            <th width="">充值时间</th>
            <th width="">充值人</th>
        </tr>
    </thead>
    <tbody>
    
    <?php foreach($data as $key=>$value){ ?>
        <tr>
            <td><?php echo $value['userId'];?></td>
            
            <td><?php echo $value['cardNumber'];?></td>
            <td>￥<?php echo $value['price'];?></td>
            <td><?php echo $value['discount'];?>折</td>

            <td>￥<?php echo $value['t_price']?></td>

            <td><?php echo $value['createAt']?></td>

            <td><?php echo $value['chargername']?></td>
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
                <a class="btn btn-white" href="user_recharge.php?page=<?php echo $i;?>">
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
