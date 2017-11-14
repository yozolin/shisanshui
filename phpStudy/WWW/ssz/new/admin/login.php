<?php require_once( '../lib/config.php' ) ?>

<?php 
/**
 * admin/login.php
 * 登录界面
 */
# 判断 管理员 的登录状态 ,如果有登录，就跳转到 后台首页admin/index.php 
$login_status = isset($_SESSION['is_login']) ? $_SESSION['is_login'] : false;
if( $login_status ){
    alert_go( '你已经登录过了','index.php' );
    // header('Location: index.php');
    exit;
}
$action = isset($_POST['action']) ? true : false;
if($action){
  $type = $_POST['type'];   # 登录类型  管理？代理
  # 接收表单数据: 用户名 密码
  $username = trim( $_POST['username'] );
  $password = $_POST['password'];

  # 过滤数据
  if( !$username ){
    alert_go('必须要输入用户名');
    exit;
  }
  if( !$password ){
    alert_go('必须要输入密码');
    exit;
  }
  # 1 查询是否存在 $username 账户，存在则返回该用户的 加密因子和密码 用户id
  $query = "SELECT * FROM ".$type." WHERE username='{$username}';";
  $result = mysql_query($query);
  $single = mysql_fetch_assoc($result);
  // var_dump($query); exit;
  
  if( !$single ){
    alert_go('你输入的用户不存在','login.php');
    exit;
  }else{
    $crypt = $single['crypt'];                # 读取加密因子
    $user_pwd = $single['password'];          # 读取密码
    $id = $single['id'];                      # 读取用户id
    $pwd = create_pwd( $password ,$crypt);    # 加密 

    if( $pwd != $user_pwd ){
        alert_go('登录失败：密码错误','login.php');
        exit;
    }else{
        $checkCode= rand_string(15);#校验码
        $ip = get_real_ip();
        # 记录会话信息   
        $time = date("Y-m-d H:i:s",time());
        $_SESSION['is_login'] = 1;        
        $_SESSION['username'] = $username;     
        $_SESSION['nickname'] = $single['nickname'];     
        $_SESSION['id'] = $id; 
        $_SESSION['level'] = $single['level'];  #记录代理级别
        $_SESSION['type'] = $type;              #记录登录人是管理员还是代理
        $_SESSION['login'] = $time ;            #记录登录时间
        $_SESSION['inviteCode'] ='';
        $_SESSION['expiretime']= time() + 3600;
        $_SESSION['checkCode'] = $checkCode;    #校验码
        $_SESSION['out_trade_no'] = '';
        if($type!="admin"){
            $_SESSION['inviteCode']= select_inviteCode($id,$type);
        }
        $update = "UPDATE $type SET lastLoginTime='{$time}',state=1,checkCode = '{$checkCode}',ipAddress = '{$ip}' WHERE id=".$id;
        //var_dump(  $update );exit;
        mysql_query($update);
        insert_log_login($time);   # 向日志插入登录时间
        // var_dump( $update );exit;
        alert_go('登录成功','index.php');  # 跳转到后台首页
    }

  }
  # 阻止往下执行
  exit;
}else{
  # 显示页面
}
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>登录</title>
  <meta name="description" content="" />
  <meta name="keywords" content="" />
  <meta name="author" content="" />

  <!-- 适配 -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

  <!-- Plugins:semantic -->
  <link rel="stylesheet" href="statics/h5add/css/semantic.min.css">
  <link rel="stylesheet" href="statics/h5add/css/form.min.css">
  <link rel="stylesheet" href="statics/h5add/css/login.css">
  <link rel="stylesheet" href="statics/h5add/css/transition.min.css">
  <script src="statics/h5add/js/jquery-2.1.1.min.js" ></script>
</head>

<body class="carrot">
    
    <div class="ui middle aligned center aligned grid">
  <div class="column login-box">
    <div class="row">
      <h2 class="ui teal image header">
        <div class="content border_red" id="admin-btn">
          管理登录  
        </div>
        &nbsp;&nbsp;
        <div class="content" id="agent-btn">
          代理登录 
        </div>
      </h2>
      <!-- 管理员登录表单 -->
      <form class="ui large form" action="" method="post" id="admin-form">
        <div class="ui stacked segment">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" name="username" value="" placeholder="管理员账户名" autocomplete="off">
            </div>
          </div>
          
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="password" name="password" value="" placeholder="管理员密码" autocomplete="off">
            </div>
          </div>


          <!-- <div class="field">
              <div class="ui left icon input">
                  <div class="eight wide field">
                      <input type="text" name="inviteCode" value="" placeholder="验证码">
                  </div>
                  <div class="eight wide field inviteCode-img-box">
                      <img src="" class="img-width100 image-inviteCode-link cursor-pointer" alt="">
                  </div>
              </div>
          </div> -->
          
          <input type="hidden" name="action" value="1">
          <input type="hidden" name="type" value="admin">
          <input class="ui fluid large green submit button" type="submit" value="登录">
        </div>

        <div class="ui error message"></div>
      </form>


      <!-- 代理登录表单 -->
      <form class="ui large form" action="" method="post" style="display:none;" id="agent-form">
        <div class="ui stacked segment">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" name="username" value="" placeholder="代理员账户名" autocomplete="off">
            </div>
          </div>
          
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="password" name="password" value="" placeholder="代理员密码" autocomplete="off">
            </div>
          </div>


          <!-- <div class="field">
              <div class="ui left icon input">
                  <div class="eight wide field">
                      <input type="text" name="inviteCode" value="" placeholder="验证码">
                  </div>
                  <div class="eight wide field inviteCode-img-box">
                      <img src="" class="img-width100 image-inviteCode-link cursor-pointer" alt="">
                  </div>
              </div>
          </div> -->
          
          <input type="hidden" name="action" value="1">
          <input type="hidden" name="type" value="agent">
          <input class="ui fluid large green submit button" type="submit" value="登录">
        </div>

        <div class="ui error message"></div>
      </form>
    </div>

  </div>
</div>
<script>
    // var num = 1;
    $("#admin-btn").click(function(){
        $(this).addClass("border_red");
        $("#agent-btn").removeClass("border_red");
        $("#agent-form").stop().animate({width:"0"},500).css({display:"none"});
        $("#admin-form").stop().animate({width:"100%"},500).css({display:"block"});
    });
    $("#agent-btn").click(function(){
        $(this).addClass("border_red");
        $("#admin-btn").removeClass("border_red");
        $("#admin-form").stop().animate({width:"0"},500).css({display:"none"});
        $("#agent-form").stop().animate({width:"100%"},500).css({display:"block"});
    });


</script>

</body>
</html>