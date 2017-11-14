<?php require_once('common.php'); ?>

<?php 
/**
 * admin/user_info.php
 * @since  2016-12-30
 */
# 页面标题
$web_title = '用户信息';
// ********* 分页 *********
$limit = ADMIN_LIMIT;
$page = isset($_GET['page']) ? $_GET['page'] : 1; # 当前页码 : 安全过滤
$page = intval($page);
$page = $page ? $page : 1;
$start = ($page-1)*$limit;  # 当前页的 起点 
// ********* 分页end ********* 
$table_name = 'users'; # 数据表名

$uid = isset($_GET['uid']) ? $_GET['uid'] :false;
$pid = isset($_GET['pid']) ? $_GET['pid'] :false;
/*-----------------------------搜索start-----------------------------*/ 
$action = isset($_POST['action'])?$_POST['action'] : false;
if($action){
    $uid = $_POST['id'];
    $inviteCode = select_inviteCode($uid,"users");
    if((!$inviteCode || $inviteCode != $_SESSION['inviteCode'])&& $_SESSION['type']!="admin") {
        alert_go("该用户不在您的名下","user_lists.php");exit;
    }
}
/*-----------------------------搜索end-----------------------------*/ 

if($uid){           //大局数据
    $table_name ="big_records";
    $query = "SELECT * FROM $table_name WHERE users like '%{$uid}%' limit {$start},{$limit}";
    $result = mysql_query($query);
    $data = array();
    while ( $row = mysql_fetch_assoc($result) ) {
        $data[] = $row;
    }
    if($pid){       //小局数据
        $data = array();
        $table_name ="records";
        $query = "SELECT * FROM $table_name WHERE userId='{$uid}' AND parentId ='{$pid}' ORDER BY creatAt DESC";
        //var_dump($query);exit;
        $result = mysql_query($query);
        while ( $row = mysql_fetch_assoc($result) ) {
            $data[] = $row;
        }
        $scores = 0;
        for($i=0; $i<count($data);$i++){
            $scores += $data[$i]['score'];
        }
    }
}else{
    if( !$_SESSION['inviteCode'] ){
        $query = "SELECT * FROM {$table_name} ORDER BY id desc limit {$start},{$limit}";
    }else{
        $inviteCode = $_SESSION['inviteCode'];
        $query = "SELECT * FROM {$table_name} WHERE inviteCode = '{$inviteCode}' ORDER BY id desc limit {$start},{$limit}";
    }
   
    $result = mysql_query($query);
    $data = array();
    while ( $row = mysql_fetch_assoc($result) ) {
        $data[] = $row;
    }
}
# 查询出 数据表中有多少条记录？
$total = 0;
$query = "SELECT count(*) as nums FROM {$table_name}";
if($_SESSION['type'] !="admin"){
    $inviteCode = $_SESSION['inviteCode'];
    $query = "SELECT count(*) as nums FROM {$table_name} WHERE inviteCode ='{$inviteCode}'";
}
if($uid){
    //$table_name = 'big_records';
    $query = "SELECT count(*) as nums FROM {$table_name} WHERE users like '%{$uid}%'";
}
if($pid){
    $query = "SELECT count(*) as nums FROM {$table_name} WHERE parentId = '{$pid}' AND userId ='{$uid}'";
}
//var_dump($query);exit;
$result = mysql_query($query);
$row = mysql_fetch_assoc($result);
$total = intval( $row['nums'] );
$total_pages = ceil($total/$limit);
    // var_dump($total_pages);
?>	
<?php require_once('common-header.php');?>	
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
        <form class="select-userInfo" action="user_info.php" method="post">
            <div class="" style="position: relative;height:50px;">
              <input type="text" class="form-control"  placeholder="用户ID" style="height:50px;" name="id">
              <input type="hidden" name="action" value="1">
              <input type="submit" class="btn btn-info input-group-addon user-form" value="搜索">
            </div>
        </form>
        <?php if($pid){ ?>
        <div class="user-info">
            <?php echo "玩家id:".$uid;echo " 总比分:".$scores; ?>
        </div>
        <?php } ?>
            <!-- 表格 -->
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-title">
                            <?php if($uid && !$pid){ ?>
                                <h5>比牌结果 <span class="back"> 返回</span></h5>
                            <?php }else if($uid && $pid){ ?>
                                <h5>比牌详情 <span class="back"> 返回</span></h5>
                            <?php }else{ ?>
                                <h5>用户统计</h5>
                            <?php } ?>
                                <div class="col-md-4">
                                </div>
                                <div class="ibox-tools">
                                </div>
                            </div>
        <script>
            $('.ibox-title h5 span').click(function(){
                history.back();
            })
        </script>
                            <div class="ibox-content">
                                
                                <div class="table-responsive">
<!-- 表格数据 end -->
<table class="table table-striped table-bordered table-hover dataTables-example dataTable">
    <thead>
        <tr>
        <?php if(!$uid && !$pid){?>   
            <th width="">用户ID</th>
            <th width="">用户呢称</th>
            <th width="">性别</th>
            <th width="">房卡数</th>
            <th width="">ip地址</th>
            <th width="">上次登录时间</th>
            <th width="">注册时间</th>
            <th width="">操作</th>
        <?php }else if($uid){ ?>
            <th width="">房间号</th>
            <th width="">局数</th>
            <?php if(!$pid){ ?>
            <th width="">人数</th>
            <th width="">模式</th>
            <th width="">房主</th>
            <th width="">玩家ID</th>
            <th width="">总成绩</th>
            <?php }else{?>
            <th width="">比分</th>
            <?php }?>
            <th width="">玩家昵称</th>
            <th width="">创建时间</th>
            <?php if(!$pid){?>
            <th width="">操作</th>
        <?php }} ?>
        </tr>
    </thead>
    <tbody>
    <?php if(!$uid && !$pid){ foreach($data as $key=>$value){ ?>
        <tr>
            <td><?php echo $value['id'];?></td>
            <td><?php echo $value['nickname']?></td>
            <td><?php if($value['sex']==1){
                echo "男" ;
                }else{echo "女" ;}?></td>
            <td><?php echo $value['cardNumber']?></td>
            <td><?php echo ($value['ipAddress'])?></td>
            <td><?php echo $value['lastLoginTime']?></td>
            <td><?php echo $value['createAt']?></td>
            <td><a href="user_info.php?uid=<?php echo $value['id'] ?>">查看</a></td>
        </tr>
    <?php }}else if($uid ){foreach($data as $key=>$value){  ?>
        <tr>
        <!-- 大局数据 -->
        <?php if(!$pid){?>
            <td><?php echo $value['roomId'];?></td>
            <td><?php switch($value['setting1']) {
                case 2:echo "10局";break;case 3:echo "20局";break;case 4:echo "30局";break;}?></td>

            <td><?php switch ($value['setting2']) {
                case 0:echo 4;break;case 1:echo 3;break;case 2:echo 2;break;}?></td>

            <td><?php switch($value['setting3']) {
                case 0:echo "三道";break;case 1:echo "六道";break;case 2:echo "庄家";break;case 3:echo "轮庄";break;
                }?></td>

            <td><?php echo $value['createUserId']?></td>
            <td><?php echo $value['users']?></td>
            <td><?php echo $value['playersInfo']?></td>
            <td><?php echo $value['scores']?></td>
            <td><?php echo $value['createAt']?></td>
            <td><a href="user_info.php?uid=<?php echo $uid?>&pid=<?php echo $value['id'] ?>">查看</a></td>
        <!-- 大局数据end -->
        <!-- 小局数据 -->
        <?php }else{?>
            <td><?php echo $value['info'];?></td>
            <td><?php echo "第".$value['gameIndex']."局"?></td>
            <td><?php echo $value['score']?></td>
            <td><?php echo $value['info1']?></td>
            <td><?php echo $value['creatAt']?></td>
        <?php } ?>
        <!-- 小局数据end -->
        </tr>
    <?php }}?>
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
                <a class="btn btn-white" href="user_info.php?page=<?php echo $i;if($uid){
                    echo "&uid=".$uid;if($pid){ echo "&pid=".$pid;}
                    }?>">
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
