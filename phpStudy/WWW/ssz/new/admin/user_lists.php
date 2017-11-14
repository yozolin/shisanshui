<?php require_once('common.php'); ?>

<?php 
/**
 * admin/user_lists.php
 */
$web_title = '用户统计';    # 页面标题
$table_name = 'users';      # 数据表名
/*——------------分页--------------——*/
$limit = ADMIN_LIMIT;
$page = isset($_GET['page']) ? $_GET['page'] : 1;   # 当前页码 : 安全过滤
$page = intval($page);
$page = $page ? $page : 1;
$start = ($page-1)*$limit;
/*——------------分页--------------——*/ 

/*-----------------------------解绑start-----------------------------*/ 
if($_SESSION['type'] == "admin"){
    $uid = isset($_GET['uid']) ? $_GET['uid'] : false;
    if($uid){
        $unbundNum = select_unbundNum($uid);
        if($unbundNum >3){
            alert_go("解绑次数已用完，不能解绑","user_lists.php");
        }else{
            $unbundNum++;
            $query = "UPDATE users SET inviteCode = '',unbundNum = '{$unbundNum}' WHERE id=".$uid;
            //var_dump($query);exit;
            $result = mysql_query($query);
            $single = mysql_affected_rows();
            if($single){
                alert_go("解绑成功","user_lists.php");exit;
            }
        }
    }
}
/*-----------------------------解绑end-----------------------------*/ 

if( !$_SESSION['inviteCode'] ){
    $query = "SELECT * FROM {$table_name} ORDER BY id desc limit {$start},{$limit}";
}else{
    $inviteCode = $_SESSION['inviteCode'];
    $query = "SELECT * FROM {$table_name} WHERE inviteCode = '{$inviteCode}' ORDER BY id desc limit {$start},{$limit}";
}
/*-----------------------------搜索start-----------------------------*/ 
$action = isset($_POST['action'])?$_POST['action'] : false;
if($action){
    $id = $_POST['id'];
    if($_SESSION['type'] != "admin"){
        $inviteCode = select_inviteCode($id,"users");
        if(!$inviteCode || $inviteCode != $_SESSION['inviteCode']){
            alert_go("该用户不在您的名下","user_lists.php");exit;
        }
    }
    $query = "SELECT * FROM {$table_name} WHERE id=".$id;
}
/*-----------------------------搜索end-----------------------------*/ 
$result = mysql_query($query);
$data = array();
while ( $row = mysql_fetch_assoc($result) ) {
    $data[] = $row;
}
######## 分页
$total = 0;
$query = "SELECT count(*) as nums FROM {$table_name}";
if($_SESSION['type'] !="admin"){
    $inviteCode = $_SESSION['inviteCode'];
    $query = "SELECT count(*) as nums FROM {$table_name} WHERE inviteCode ='{$inviteCode}'";
}
$result = mysql_query($query);
$row = mysql_fetch_assoc($result);
$total = intval( $row['nums'] );
// var_dump($total);
$total_pages = ceil($total/$limit);
######## 分页 end

?>	
<?php require_once('common-header.php'); ?>	
		<!-- 内容区域 -->

		<div id="page-wrapper" class="gray-bg dashbard-1">
	        <!-- 面包屑 -->
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-sm-10">
                    <h2>游戏用户</h2>
                    <ol class="breadcrumb">
                 
                    </ol>
                </div>
            </div>
        <h6 style="height:15px;"></h6>
        <form class="select-userInfo" method="post" action="user_lists.php">
            <div class="" style="position: relative;height:50px;">
              <input type="text" class="form-control"  placeholder="用户ID" style="height:50px;" name="id">
              <input type="hidden" value="1" name="action">
              <input class="btn btn-info input-group-addon user-form" type="submit" value="搜索">
            </div>
        </form>
            <!-- 表格 -->
            <div class="wrapper wrapper-content animated fadeInRight">
                
                <div class="row">
                    <div class="col-sm-12">
                        <div class="ibox float-e-margins">
                            
                            <div class="ibox-title">
                                <h5>用户统计</h5>
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
            <th width="">用户呢称</th>
            <th width="">性别</th>
            <th width="">房卡数</th>
            <th width="">状态</th>
            <th width="">ip地址</th>
            <th width="">上次登录时间</th>
            <th width="">注册时间</th>
            <th width="200px">操作</th>
        </tr>
    </thead>
    <tbody>
    <?php foreach($data as $key=>$value){ ?>
        <tr>
            <td><?php echo $value['id'];?></td>
            
            <td><?php echo $value['nickname']?></td>
            <td><?php if($value['sex']==1){
                echo "男" ;
                }else{echo "女" ;}?></td>
            <td><?php echo $value['cardNumber']?></td>

            <td><?php if($value['onlineStatus']){echo "在线";}else{echo "离线";}?></td>
            <td><?php echo ($value['ipAddress'])?></td>
            <td><?php echo $value['lastLoginTime']?></td>
            <td><?php echo $value['createAt']?></td>
            <td >
                <a href="user_addCardNum.php?id=<?php echo $value['id'] ?>&addCard=users">充值房卡</a>&nbsp;&nbsp;&nbsp;
                <a href="user_info.php?uid=<?php echo $value['id'] ?>">查看</a>&nbsp;&nbsp;&nbsp;
                <?php if($_SESSION['type'] =="admin"){ if($value['inviteCode']){ ?>
                <a href="javascript:if(confirm('确实要解绑该用户吗?'))location='user_lists.php?uid=<?php echo $value['id'] ?>'">解绑</a>
                <?php }else{ ?>
                <span>无绑定</span>
                <?php }} ?>
                <!-- <a href="user_lists.php">解绑</a> -->
            </td>
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
                <a class="btn btn-white" href="user_lists.php?page=<?php echo $i;?>">
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
