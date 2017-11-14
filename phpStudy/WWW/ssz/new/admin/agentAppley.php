<?php require_once('common.php'); ?>
<?php 
/**
 * admin/agent_lists.php
 * 代理列表 
 */
$web_title = '代理列表';    # 页面标题
$table_name = 'agent';      # 数据表名
// ********* 分页 *********
$limit = ADMIN_LIMIT;
$page = isset($_GET['page']) ? $_GET['page'] : 1;
$page = intval($page);
$page = $page ? $page : 1;
$start = ($page-1)*$limit;
// ********* 分页end ********* 
$where= '';
if($_SESSION['type']!="admin"){
    $pid = $_SESSION['inviteCode'];
    $where = " where pid = '{$pid}' ";
}
# 构建查询语句
$query = "SELECT * FROM {$table_name} {$where}  LIMIT {$start},{$limit}";
$result = mysql_query($query);

# 从结果集中读取数据
$data = array();
while ( $row = mysql_fetch_assoc($result) ) {
    $data[] = $row;
}
$action = isset($_POST['action']) ? $_POST['action'] :false;
if($action){
    $id = isset($_POST['id'])? $_POST['id'] : false;
    $single = update_inviteCode($id);
    $query = 'DELETE FROM agent where id='.$id;
    // var_dump($query);exit;
    $result = mysql_query($query);
    $affected = mysql_affected_rows();
    if($affected){
        updata_log("成功删除代理和相关用户邀请码");
    }else{
        updata_log("删除用户邀请码成功，但删除代理失败");
    }
    
    alert_go('删除成功','agent_lists.php');
    if($single ==-1){
        alert_go('删除失败,网路出错,请稍后再试');
    }
} 
######## 分页
$total = 0;
$query = "SELECT count(*) as nums FROM {$table_name} {$where}";
$result = mysql_query($query);
$row = mysql_fetch_assoc($result);
$total = intval( $row['nums'] );
$total_pages = ceil($total/$limit);
######## 分页 end

?>  
<?php require_once('common-header.php'); ?>
		<!-- 内容区域 -->
		<div id="page-wrapper" class="gray-bg dashbard-1">
	        <!-- 面包屑 -->
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>充值记录</h2>
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
                                <h5>充值记录</h5>
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
            <th width="">帐号</th>
            <th width="">姓名</th>
            <?php if( $_SESSION['type']!="admin" && $_SESSION['level']!=1){ ?>
            <th width="">上级</th>
            <?php } ?>
            <th width="">邀请码</th>
            <th width="">房卡</th>
            <th width="">电话</th>
            <th width="">级别</th>
            <th width="">注册时间</th>
            <th width="">上次登录时间</th>
            <th width="">管理</th>
        </tr>
    </thead>
    <tbody>

    <?php foreach($data as $key=>$value){ ?>
        <tr>
            <td><?php echo $value['id'];?></td>
            
            <td><?php echo $value['username']?></td>
            <td><?php echo $value['nickname'];?></td>
            <?php if($_SESSION['type']!="admin" && $_SESSION['level']!=1){ ?>
            <td><?php echo $value['superior'] ?></td>
            <?php } ?>
            <td><?php echo $value['inviteCode'] ?></td>
            <td><?php echo $value['cardNumber'] ?></td>
            <td><?php echo $value['phone'] ?></td>
            <td><?php echo $value['level'] ?></td>
            <td><?php echo $value['createAt'] ?></td>
            <td><?php echo $value['lastLoginTime'] ?></td>
            <td>
                <a href="agent_addCardNum.php?id=<?php echo $value['id']?>">充值房卡</a>
                &nbsp; &nbsp;
                <form action="" method="post" style="display:inline-block" class="delect-agent">
                    <input type="hidden" name="id" value="<?php echo $value['id'] ?>">
                    <input type="hidden" name="action" value="1">
                    <span>删除</span>
                </form>
            </td>
        </tr>
    <?php } ?>
    </tbody>
    <script>
        $('.delect-agent span').click(function(){
            if(confirm('确定要删除该用户吗？')){
                $(this).parent().submit();
            }
        });
    </script>
</table>
<!-- 表格数据 end -->
        <div class="btn-group pull-left">
        </div> 
        <div class="btn-group pull-right">
            <!-- <a class="btn btn-white" href="2.html">上一页</a> -->
            <?php for($i=1; $i<=$total_pages ; $i++ ){?>
            
                <?php if($i != $page){?>
                    <a class="btn btn-white" href="news_lists.php?page=<?php echo $i;?>">
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
