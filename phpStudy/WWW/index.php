<?php 
error_reporting(0);
require_once "./jssdk.php";
$jssdk = new JSSDK("wx1bf6bb2db2d1cd3f", "b34e15e37d783ba857a212d89ef0fe82");
$signPackage = $jssdk->GetSignPackage();
 ?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">

  <title></title>

  <!--http://www.html5rocks.com/en/mobile/mobifying/-->
  <meta name="viewport"
        content="width=device-width,user-scalable=no,initial-scale=1, minimum-scale=1,maximum-scale=1"/>

  <!--https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html-->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="format-detection" content="telephone=no">

  <!-- force webkit on 360 -->
  <meta name="renderer" content="webkit"/>
  <meta name="force-rendering" content="webkit"/>
  <!-- force edge on IE -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
  <meta name="msapplication-tap-highlight" content="no">

  <!-- force full screen on some browser -->
  <meta name="full-screen" content="yes"/>
  <meta name="x5-fullscreen" content="true"/>
  <meta name="360-fullscreen" content="true"/>
  
  <!-- force screen orientation on some browser -->
  <meta name="screen-orientation" content="portrait"/>
  <meta name="x5-orientation" content="portrait">

  <!--fix fireball/issues/3568 -->
  <!--<meta name="browsermode" content="application">-->
  <meta name="x5-page-mode" content="app">

  <!--<link rel="apple-touch-icon" href=".png" />-->
  <!--<link rel="apple-touch-icon-precomposed" href=".png" />-->

  <link rel="stylesheet" type="text/css" href="style-mobile.css"/>
  <link rel="stylesheet" type="text/css" href="loading.css"/>

</head>
<body>
  <canvas id="GameCanvas" oncontextmenu="event.preventDefault()" tabindex="0"></canvas>
  <div id="splash">
    <div class="container">
      <ul id="progress">
        <li><div id="layer1" class="ball"></div><div id="layer7" class="pulse"></div></li>
        <li><div id="layer2" class="ball"></div><div id="layer8" class="pulse"></div></li>
        <li><div id="layer3" class="ball"></div><div id="layer9" class="pulse"></div></li>
        <li><div id="layer4" class="ball"></div><div id="layer10" class="pulse"></div></li>
        <li><div id="layer5" class="ball"></div><div id="layer11" class="pulse"></div></li>
      </ul>
    <div style="clear:both;text-align:center;color:#fff;">加载中</div>
    </div>
    <div class="progress-bar stripes">
      <span style="width: 100%"></span>
    </div>
  </div>
<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script src="src/settings.js" charset="utf-8"></script>
<script src="main.js" charset="utf-8"></script>
<script src="jquery.js" type="text/javascript"></script>

<script>
  $('#progress').removeClass('running');   
    $('#progress').removeClass('running').delay(10).queue(function(next){
      $(this).addClass('running');
        next();
  });
    

  wx.config({
    debug: false,
    appId: '<?php echo $signPackage["appId"];?>',
    timestamp: <?php echo $signPackage["timestamp"];?>,
    nonceStr: '<?php echo $signPackage["nonceStr"];?>',
    signature: '<?php echo $signPackage["signature"];?>',
    jsApiList: [
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'startRecord',
      'stopRecord',
      'onVoiceRecordEnd',
      'playVoice',
      'pauseVoice',
      'stopVoice',
      'onVoicePlayEnd',
      'uploadVoice',
      'downloadVoice'
    ]
  });
  var shareTitle = '开房玩[大众十三水]';    
  var shareDesc = '开好房了，就等你们一起来[大众十三水]啦！晚了位置就没了哟~'; 
  // 正式链接地址
  //var link = 'http://127.0.0.1/sszWeb/index.php';  
  // 测试链接地址
  var link = 'http://127.0.0.1/test/index.php';  

  var imgUrl = 'http://127.0.0.1/sszWeb/icon.jpg';    
  var iconUrl = 'http://127.0.0.1/sszWeb/icon.jpg';    
  var inviteUrl = 'http://127.0.0.1/sszWeb/invite.jpg';    

    wx.ready(function () {
        window.shareToTimeLine = function() {
            //console.log(localStorage);
            // 分享到朋友圈
            wx.onMenuShareTimeline({
                title:get_title(),
                link: get_link(),
                imgUrl: get_imgurl(),
                success: function () {
                },
                cancel: function () {
                }
            });
        }
        window.shareToSession = function() {
            // 分享到好友
            wx.onMenuShareAppMessage({
                  title: get_title(),
                  desc: get_desc(),
                  link: get_link(),
                  imgUrl: get_imgurl(),
                  type: '',
                  dataUrl: '',
                  success: function () {
                  },
                  cancel: function () {
                  }
            });
        }
    });



  function get_title(){
      return localStorage.getItem('shareTitle') ? localStorage.getItem('shareTitle'):shareTitle;
  } 
  function get_desc(){
      return localStorage.getItem('desc') ? localStorage.getItem('desc'):shareDesc;
  }
  function get_link(){
      var roomId = localStorage.getItem('roomId');
      var recordId = localStorage.getItem('recordId');
      if(recordId){
        return recordId?(link+"?recordId="+recordId):link;
      }
      else if(roomId){
        return roomId?(link+"?roomId="+roomId):link;
      }
  }
  function get_imgurl(){
      var roomId = localStorage.getItem('roomId');
      return roomId ? inviteUrl:iconUrl;
  }
</script>
</body>
</html>
