<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title>
    <?php echo isset($web_title) ? $web_title : '';?>
    </title>
	<meta name="description" content="" />
	<meta name="keywords" content="" />
	<meta name="author" content="" />

	<!-- 适配 -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <link href="statics/h5add/css/bootstrap.min.css" rel="stylesheet">
    <link href="statics/h5add/font-awesome/css/font-awesome.css" rel="stylesheet">

    <!-- Morris -->
    <link href="statics/h5add/css/plugins/morris/morris-0.4.3.min.css" rel="stylesheet">

    <!-- Gritter -->
    <link href="statics/h5add/js/plugins/gritter/jquery.gritter.css" rel="stylesheet">

    <link href="statics/h5add/css/animate.css" rel="stylesheet">
    <link href="statics/h5add/css/style.css" rel="stylesheet">
    <script src="statics/h5add/js/jquery-2.1.1.min.js" ></script>

</head>

<body class="fixed-sidebar">
    <div id="wrapper">
    
		<nav class="navbar-default navbar-static-side " role="navigation" style="display: block;">
            <div class="sidebar-collapse">
                <ul class="nav " id="side-menu">
                    <li class="nav-header">

                        <div class="dropdown profile-element"> 
                            <a data-toggle="dropdown" class="dropdown-toggle" href="index.php#" >
                                <span class="clear"> 
                                    <span class="block m-t-xs">
                                         <strong class="font-bold">
<?php
    # 输出当前已登录的管理员的名称
    echo isset($_SESSION['nickname']) ? $_SESSION['nickname'] : '无名氏';

?>

                                         </strong>
                                        <b class="caret"></b>
                                    </span> 
                                </span>
                            </a>
                            <ul class="dropdown-menu animated fadeInRight m-t-xs">
                                <li>
                                    <a href="change_password.php">修改密码</a>
                                </li>
                                <li>
                                    <a href="profile.php" >我的信息</a>
                                </li>
                                <li class="divider"></li>
                                <li>
                                    <a href="loginout.php" >安全退出</a>
                                </li>
                            </ul>
                        </div>
                        
                    </li>

                    <li class="col-xs-3 col-sm-12">
                        <h3><a href="index.php" ><span class="nav-label">后台主页</span></a></h3>
                    </li>
                    <li class="col-xs-3 col-sm-12">
                        <h3 class="nav-btn" style="cursor:pointer">游戏用户&nbsp;&nbsp;&nbsp;&nbsp;
                            <span class="glyphicon glyphicon-tasks">
                        </h3>
                        <div class="nav-child">
                            <a href="user_lists.php" ><span class="nav-label">用户管理</span></a>
                            <a href="user_addCardNum.php" ><span class="nav-label">充值房卡</span></a>
                            <a href="user_info.php" ><span class="nav-label">比牌记录</span></a>
                            <a href="user_recharge.php" ><span class="nav-label">充值记录</span></a>
                            <a href="user_ranking.php" ><span class="nav-label">充值排行</span></a>
                            <a href="room.php" style="display:none"><span class="nav-label">在线房间</span></a>
                        </div>
                    </li>
                    <?php if($_SESSION['level']<3 || $_SESSION['type']=="admin"){ ?>
                    <li class="col-xs-3 col-sm-12">
                        <h3 class="nav-btn"  style="cursor:pointer">代理管理&nbsp;&nbsp;&nbsp;&nbsp;
                            <span class="glyphicon glyphicon-tasks">
                        </h3>
                        <div class="nav-child">
                            <a href="agent_lists.php" ><span class="nav-label">所有代理</span></a>
                            
                            <a href="buy_card.php" ><span class="nav-label">购买房卡</span></a>
                           
                            <?php if($_SESSION['type']=="admin"){ ?>
                            <a href="agent_add.php" ><span class="nav-label">添加代理</span></a>
                            <a href="agentAppley.php" ><span class="nav-label">代理申请</span></a>
                            <?php } ?>
                            <a href="agent_recharge.php" ><span class="nav-label">充值记录</span></a>
                            <?php if($_SESSION['type']=="admin"){ ?>
                            <a href="agent_ranking.php" ><span class="nav-label">充值排行</span></a>
                            <?php } ?>
                        </div>
                        
                    </li>
                    <?php }if($_SESSION['type']=="admin"){ ?>
                    <li class="col-xs-3 col-sm-12">
                        <h3 class="nav-btn" style="cursor:pointer">后台系统&nbsp;&nbsp;&nbsp;&nbsp;
                            <span class="glyphicon glyphicon-tasks"></span>
                        </h3>
                        <div class="nav-child">
                            <a href="admin_lists.php" ><span class="nav-label">管理员列表</span></a>
                            <a href="package.php" ><span class="nav-label">套餐设置</span></a>
                            <a href="log.php" ><span class="nav-label">安全日志</span></a>
                            <a href="website.php" ><span class="nav-label">系统消息</span></a>
                            <a href=""  style="display:none"><span class="nav-label">系统设置</span></a>
                            <a href="notice.php" ><span class="nav-label">公告设置</span></a>
                        </div>
                    </li>
                    <?php }?>
                </ul>

            </div>
        </nav>
    <script>
        var state = 1;
        $('.nav-btn').click(function(){
            $(this).siblings(".nav-child").stop().slideToggle();
        });
    </script>