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
$table_name = 'rooms'; # 数据表名

$total = 0;
$query = "SELECT count(*) as nums FROM {$table_name} where status = 1";

$result = mysql_query($query);
$row = mysql_fetch_assoc($result);
$total = intval( $row['nums'] );
$total_pages = ceil($total/$limit);
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
        <h6 style="height:15px;" style="display:none"></h6>
        <form class="select-userInfo" action="user_info.php" method="post" style="display:none">
            <div class="" style="position: relative;height:50px;">
              <input type="text" class="form-control"  placeholder="用户ID" style="height:50px;" name="id">
              <input type="hidden" name="action" value="1">
              <input type="submit" class="btn btn-info input-group-addon user-form" value="搜索">
            </div>
        </form>
      
            <!-- 表格 -->
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-title">
                                <h5>在线房间</h5>
                                <div class="col-md-4">
                                </div>
                                <div class="ibox-tools">
                                </div>
                            </div>
                            <div class="ibox-content">
                                <div class="table-responsive">
                                    <div class="room col-sm-3 col-xs-12" style="background:#ccc;padding:10px 15px;">
                                        <div class="title">
                                            <p>房号：123456</p>
                                            <p>开房时间：2017-07-27</p>
                                            <p>局数：20</p>
                                            <p>人数：4</p>
                                        </div>
                                        <div class="content container-fluid">
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>昵称</th>
                                                    <th>性别</th>
                                                    <th>比分</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>100010</td>
                                                    <td>100011</td>
                                                    <td>100012</td>
                                                    <td>100013</td>
                                                </tr>
                                                <tr>
                                                    <td>张三丰</td>
                                                    <td>张无忌</td>
                                                    <td>灭绝师太</td>
                                                    <td>周芷若</td>
                                                </tr>
                                                <tr>
                                                    <td>男</td>
                                                    <td>男</td>
                                                    <td>女</td>
                                                    <td>女</td>
                                                </tr>
                                                    <td>10</td>
                                                    <td>20</td>
                                                    <td>-40</td>
                                                    <td>10</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                            <!-- <p>ID：100010&nbsp;&nbsp;100011&nbsp;&nbsp;100012&nbsp;&nbsp;100013</p>
                                            <p>昵称：张三丰&nbsp;&nbsp;张无忌&nbsp;&nbsp;灭绝师太&nbsp;&nbsp;周芷若</p>
                                            <p>性别：男&nbsp;&nbsp;男&nbsp;&nbsp;女&nbsp;&nbsp;女</p>
                                            <p>比分：10&nbsp;&nbsp;10&nbsp;&nbsp;-30&nbsp;&nbsp;10</p>
 -->                                        </div>
                                    </div>


<div class="btn-group pull-left">
</div> 
<div class="btn-group pull-right">
    <?php for($i=1; $i<=$total_pages ; $i++ ){ if($i != $page){?>
    <a class="btn btn-white" href="user_info.php?page=<?php echo $i;if($uid){echo "&uid=".$uid;if($pid){ echo "&pid=".$pid;}}?>"><?php echo $i;?></a>
    <?php }else{?>
    <button class="btn btn-white active"><?php echo $i;?></button>
    <?php }}?>
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
