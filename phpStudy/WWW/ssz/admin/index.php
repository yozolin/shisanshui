<?php require_once('common.php'); ?>
<?php 
/**
 * admin/index.php
 * 后台首页
 */
# 页面标题
$web_title = '后台首页';

/**
 * select_totalCardNum 查询总数 
 * 第一个参数为数据库，
 * 第二个参数为限制限制条件,
 * 第三个参数为排序，升？降
 */
// echo select_count();exit;  
// var_dump($_SESSION['expiretime']);exit;
$yesterday = select_Yesterday();

//var_dump($yesterday);exit;
$user_totalCarNum = select_totalCardNum("user_recharge","10","DESC");
$agent_totalCarNum = select_totalCardNum("agent_recharge","10","DESC");
?>
<?php require_once('common-header.php'); ?>
		<!-- 内容区域 -->
		<div id="page-wrapper" class="gray-bg dashbard-1">
	        <div class="row border-bottom">
                <nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0">
                    <ul class="nav navbar-top-links navbar-right">
                        <li>
                            <a href="loginout.php" >
                                <i class="fa fa-sign-out"></i> 退出
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div class="row  border-bottom white-bg dashboard-header">
                <?php if($_SESSION['type']=="admin"){ ?>  
                <!--非管理员不显示环境信息 start：44-->
                <div class="col-md-4 col-xs-12" style="background:#ddd;display:none">
                    <h2>环境信息</h2>
                    <small>以下信息会根据您托管服务器环境的不同而变化</small>
                    <ul class="list-group clear-list m-t">
                        <li class="list-group-item fist-item">
                            <span class="pull-right">
                            	<?php echo PHP_VERSION;?>
                            </span>
                            <span class="label label-success">
                            	1
                            </span> 
                            PHP
                        </li>
                        <li class="list-group-item">
                            <span class="pull-right">
                                <?php echo mysql_get_server_info();?>
                            </span>
                            <span class="label label-info">
                            	2
                            </span>
                            Mysql
                        </li>
                        <li class="list-group-item">
                            <span class="label label-primary">
                                3
                            </span>
                            Web服务器
                            <span class="pull-right">
                               
                            </span>
                            <div class="clear"></div>
                        </li>
                        <li class="list-group-item">
                            <span class="label label-default">
                                4
                            </span>
                            系统时间
                            <span class="pull-right">
                                    <?php echo date('Y-m-d H:i:s');?>
                            </span>
                        </li>
                    </ul>
                </div>
                <!--非管理员不显示环境信息 end：44-->
                <?php }?> 
                <div class="col-sm-8 col-xs-12">
                    <div class="container">
                        <div class="col-sm-4 ">
                            <div class="total" style="border-bottom:2px solid red;">
                                <h1>总额：￥<?php if($_SESSION['type']=="admin"){echo total_amount();}else{
                                    echo total_amount();}; ?></h1>       
                            </div>
                        </div>
                        <?php if($_SESSION['type']=="admin"){ ?>
                        <div class="col-sm-4 ">
                            <div class="total" style="border-bottom: 2px solid red;">
                                <h1>总量： <?php echo select_cardNum('',"admin");?></h1>       
                            </div>
                        </div>
                        <div class="col-sm-4 ">
                            <div class="total" style="border-bottom: 2px solid red;">
                                <h1>在线代理：<?php if(total_state()['nums']){echo total_state()['nums'];}else{echo 0;}?></h1>       
                            </div>
                        </div>
                         <?php } ?>
                    </div>
                    
                    <div style="padding-top:10px;padding-bottom:10px;">
                        <div class="col-sm-4 <?php if($_SESSION['type']=="admin"){echo 'col-xs-4';}else{echo "col-xs-6";} ?>">
                            <div class="total-box" style="background-color: #99FFCC;">
                                <h2><a href="user_lists.php">所有用户</a> &nbsp;<?php echo total_num("users"); ?></h2>
                                <hr>
                                <h2 class="total-num">在线用户：<?php echo total_num("users",1); ?></h2>
                            </div>
                        </div>
                        <?php if($_SESSION['type']=="admin"){ ?>
                        <div class="col-sm-4 col-xs-4 ">
                            <div class="total-box" style="background-color: #33CCFF;">
                                <h2><a href="agent_lists.php">所有代理</a></h2>
                                <hr>
                                <h1 class="total-num"><?php echo total_num("agent"); ?></h1>
                            </div>
                        </div>
                       
                        <div class="col-sm-4 col-xs-4">
                            <div class="total-box" style="background-color: #FFCC99;">
                                <h2><a href="admin_lists.php">管理员</a></h2>
                                <hr>
                                <h1 class="total-num"><?php echo total_num("admin"); ?></h1>
                            </div>
                        </div>
                         <?php }else{?>
                            <div class="col-sm-4 col-xs-6">
                            <div class="total-box" style="background-color: #FFCC99;">
                                <h2><a href="profile.php">我的房卡</a></h2>
                                <hr>
                                <h1 class="total-num"><?php echo select_cardNum($_SESSION['id']); ?></h1>
                            </div>
                        </div>
                         <?php } ?>
                         <div class="clear"></div>
                    </div>
                </div>
                <div class="col-sm-4 col-xs-12">
                    <div width="" class="chart-gauge" id="chart-gauge">
                        <span class="min" id="min"></span>
                        <p class="nowNum" id="nowNum"></p> 
                        <span class="max" id="max"></span>
                    </div>
<script src='statics/h5add/js/index.js'></script>
<script src='statics/h5add/js/d3.min.js'></script>

                </div>
            </div>
<?php if($_SESSION['type']=="admin"){ ?>
            <div class="row  border-bottom white-bg dashboard-header">
                <div class="col-sm-6 col-xs-12" >
                    <h1>7天销量</h1>
                    <div style=" " id="lineChart" >
                      <canvas id="canvas" width="800" height="500"></canvas>
                    </div>
                </div>
                <div class="col-sm-6 col-xs-12">
                    <!-- <canvas class="process" id="process"  width="800" height="500">什么情况</canvas> -->
                    <h1>昨天代理销售统计</h1>
                    <!-- 条形图 -->

                    <div style="" id="barChart-box">
                      <canvas id="barChart" width="800" height="500"></canvas>
                    </div>

                    <!-- 条形图 -->

                </div>
            </div>  
<script src="statics/h5add/js/style.js" ></script>
<?php } ?>
            <!-- 优惠套餐 -->
            <div class="row  border-bottom white-bg dashboard-header">
           
                 
            </div>  
            <div class="row  border-bottom white-bg dashboard-header">
                <div class="col-sm-6 col-xs-12">
                    <div class="user-rank">
                        <h2>用户充值排行</h2>
                        <table class="table  table-hover">
                            <thead>
                                <tr>
                                    <th width="50px;">排名</th>
                                    <th>总充值量</th>
                                    <th>用户id</th>
                                    <th>昵称</th>
                                    <th>性别</th>  
                                    <th>注册时间</th>
                                </tr>
                            </thead>
                            <tbody>
                            <?php foreach ($user_totalCarNum as $key => $value) { ?>
                                <tr>
                                    <td><?php echo $key+1 ?></td>
                                    <td><?php echo $value['totalNum'] ?></td>
                                    <td><?php echo $value['id'] ?></td>
                                    <td><?php echo $value['nickname'] ?></td>
                                    <td><?php  switch($value['sex']){case 2:$sex ="不详";break;case 1:$sex ="男";break;case 0:$sex ="女";break;} echo $sex ?></td>
                                    <td><?php echo $value['createAt'] ?></td>
                                </tr>
                                <?php } ?>
                                
                            </tbody>

                        </table>

                    </div>

                </div>
                <?php if($_SESSION['type']=="admin"){ ?>
                <div class="col-sm-6 col-xs-12">
                    <div class="agent-rank ">
                        <h2>代理销售排行</h2>
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>排名</th>
                                    <th>总销售量</th>
                                    <th>代理id</th>
                                    <th>昵称</th>
                                    <th>性别</th>
                                    <th>注册时间</th>       
                                </tr>
                            </thead>
                            <tbody>
                            <?php foreach ($agent_totalCarNum as $key => $value) { ?>
                                <tr>
                                    <td><?php echo $key+1 ?></td>
                                    <td><?php echo $value['totalNum'] ?></td>
                                    <td><?php echo $value['id'] ?></td>
                                    <td><?php echo $value['nickname'] ?></td>
                                    <td><?php  switch($value['sex']){case 2:$sex ="不详";break;case 1:$sex ="男";break;case 0:$sex ="女";break;} echo $sex ?></td>
                                    <td><?php echo $value['createAt'] ?></td>
                                </tr>
                            <?php } ?>
                            </tbody>
                        </table>
                    </div>
                </div>
                <?php } ?>
                <div class="col-sm-4"></div>
            </div>

        </div>
		<!-- 内容区域end -->
		

    </div>

<?php require_once('common-footer.php'); ?>
