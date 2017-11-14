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
$select = "SELECT * FROM package";
$query = mysql_query($select);
$data = [];
while ( $row = mysql_fetch_assoc($query) ) {
     $data[] = $row;
}

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
               
                <div class="col-sm-8 col-xs-12">
                    <div class="">
                        <div class="col-sm-4 ">
                            <div class="total" style="border-bottom:2px solid red;">
                                <h2>总额：￥<?php if($_SESSION['type']=="admin"){echo select_count();}else{
                                    echo total_amount();}; ?></h2>       
                            </div>
                        </div>
                        <?php if($_SESSION['type']=="admin"){ ?>
                        <div class="col-sm-4 ">
                            <div class="total" style="border-bottom: 2px solid red;">
                                <h2>总量： <?php echo select_cardNum('',"admin");?></h2>       
                            </div>
                        </div>
                        <div class="col-sm-4 ">
                            <div class="total" style="border-bottom: 2px solid red;">
                                <h2>在线代理：<?php if(total_state()['nums']){echo total_state()['nums'];}else{echo 0;}?></h2>       
                            </div>
                        </div>
                         <?php } ?>
                    </div>
                    
                    <div style="">
                        <div class="col-sm-4 <?php if($_SESSION['type']=="admin"){echo 'col-xs-4';}else{echo "col-xs-6";} ?>">
                            <div class="total-box" style="border-bottom: 2px solid red;">
                                <h2><a href="user_lists.php">所有用户</a> &nbsp;<?php echo total_num("users");?> &nbsp;在线(<?php echo total_num("users",1); ?>)</h2>
                            </div>
                        </div>
                        <?php if($_SESSION['type']=="admin"){ ?>
                        <div class="col-sm-4 col-xs-4 ">
                            <div class="total-box" style="border-bottom: 2px solid red;">
                                <h2><a href="agent_lists.php">所有代理</a>： <?php echo total_num("agent"); ?></h2>
                                
                            </div>
                        </div>
                       
                        <div class="col-sm-4 col-xs-4">
                            <div class="total-box" style="border-bottom: 2px solid red;">
                                <h2><a href="admin_lists.php">管理员</a>： <?php echo total_num("admin"); ?></h2>
                            </div>
                        </div>
                         <?php }else{?>
                            <div class="col-sm-4 col-xs-6">
                            <div class="total-box" style="border-bottom: 2px solid red;">
                                <h2><a href="admin_lists.php">我的房卡</a>：<?php echo select_cardNum($_SESSION['id']); ?></h2>
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
            <?php foreach ($data as $key => $value) { ?>
                <div class="col-sm-3 col-xs-12 ">
                    <div class="package">
                        <h2 class="package-title"><?php echo $value['title'] ?></h2>

                        <form action="buy_card.php" method="post">
                            <div class="package-content">
                                <h2>￥<strong><?php echo $value['price'] ?></strong></h2>
                                <p class="price">套餐优惠： <?php echo $value['price'] ?>元=<?php echo $value['num'] ?>张 </p>
                                <!-- <p><a href="agent_addCardNum.php?" class="btn btn-info">充值</a></p> -->
                                
                                <input type="hidden" value="<?php echo $value['price'] ?>" name="WIDtotal_amount">
                                <input type="hidden" name="ready_buy_card" value="1">
                                <div class="btn btn-info buy_card">在线购买</div>
                                <p style="padding:15px;">

                                <?php if($value['img']){ ?>
                                    <img src="<?php echo $value['img'] ?>" alt="" class="img-responsive">
                                <?php } ?>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
                <?php } ?>
                 <script>
                   $('.buy_card').click(function(){
                        $(this).parent().parent().submit();
                   })
                </script>
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
