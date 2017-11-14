<?php require_once('common.php'); ?>

<?php 
/**
 * admin/user_lists.php
 */
$web_title = '购买房卡';    # 页面标题
$table_name = '';      # 数据表名
header("Content-type: text/html; charset=utf-8");


require_once dirname ( __FILE__ ).DIRECTORY_SEPARATOR.'./../alipay/wappay/service/AlipayTradeService.php';
require_once dirname ( __FILE__ ).DIRECTORY_SEPARATOR.'./../alipay/wappay/buildermodel/AlipayTradeWapPayContentBuilder.php';
require dirname ( __FILE__ ).DIRECTORY_SEPARATOR.'./../alipay/config.php';


// var_dump($_POST);exit;
$ready_buy_card = isset($_POST['ready_buy_card']) ? true :false;

if($ready_buy_card){
     $WIDtotal_amount = $_POST['WIDtotal_amount'];  
}

$action = isset($_POST['action']) ? true :false;
if($action){
    if (!empty($_POST['WIDout_trade_no'])&& trim($_POST['WIDout_trade_no'])!=""){
        $out_trade_no = $_POST['WIDout_trade_no'];  #商户订单号，商户网站订单系统中唯一订单号，必填
        $subject = $_POST['WIDsubject'];            #订单名称，必填
        $total_amount = $_POST['WIDtotal_amount'];  #付款金额，必填
        $body = $_POST['WIDbody'];                  #商品描述，可空
        $timeout_express="1m";                      #超时时间

        $payRequestBuilder = new AlipayTradeWapPayContentBuilder();
        $payRequestBuilder->setBody($body);
        $payRequestBuilder->setSubject($subject);
        $payRequestBuilder->setOutTradeNo($out_trade_no);
        $payRequestBuilder->setTotalAmount($total_amount);
        $payRequestBuilder->setTimeExpress($timeout_express);

        $payResponse = new AlipayTradeService($config);
        $result=$payResponse->wapPay($payRequestBuilder,$config['return_url'],$config['notify_url']);
        return ;
    }
}

$get = isset($_GET['out_trade_no']) ? true : false;
if( $get ){
    # 公共参数：
    $timestamp = $_GET['timestamp'];        # 前台回跳的时间，格式"yyyy-MM-dd HH:mm:ss"
    $sign = $_GET['sign'];                  # 支付宝对本次支付结果的签名，开发者必须使用支付宝公钥验证签名
    $sign_type = $_GET['sign_type'];        # 商户生成签名字符串所使用的签名算法类型，目前支持RSA2和RSA，推荐使用RSA2
    $charset = $_GET['charset'];            # 请求使用的编码格式，如utf-8,gbk,gb2312等
    $method = $_GET['method'];              # 接口名称  
    $app_id = $_GET['app_id'];              # 支付宝分配给开发者的应用ID
    $version = $_GET['version'];            # 调用的接口版本，固定为：1.0 
    $auth_app_id = $_GET['auth_app_id'];    # 

    # 业务参数：
    $out_trade_no = $_GET['out_trade_no'];  # 商户网站唯一订单号
    $trade_no = $_GET['trade_no'];          # 该交易在支付宝系统中的交易流水号。最长64位。
    $total_amount = $_GET['total_amount'];  # 订单总金额，单位为元，精确到小数点后两位，取值范围[0.01,100000000]
    $seller_id = $_GET['seller_id'];        # 收款支付宝账号对应的支付宝唯一用户号。 以2088开头的纯16位数字

    $num = 0;
    $cardNum = get_card($total_amount);

    if( $cardNum ){
        $num = $cardNum;
    }else{
        $num = $total_amount; 
    }
    //$num = 1;#测试
    if( $_SESSION['out_trade_no'] != $out_trade_no ){
        $insert = "INSERT INTO alipay(timestamp,out_trade_no,trade_no,total_amount,seller_id) VALUES('{$timestamp}','{$out_trade_no }','{$trade_no }',$total_amount,'{$seller_id}')";
        $qurey = mysql_query( $insert );
        $newId = mysql_insert_id();
        $_SESSION['out_trade_no'] = $out_trade_no;
        $id = $_SESSION['id'];
        $update = "UPDATE agent set cardNumber = cardNumber + $num where id = ".$id;
        $qurey = mysql_query( $update );

    }else{
        # 防止重复刷新！！！
        header("Location:index.php");
    }
}
?>	
<?php require_once('common-header.php'); ?>	
		<!-- 内容区域 -->
<style>
    *{
        margin:0;
        padding:0;
    }
    ul,ol{
        list-style:none;
    }
    body{
        font-family: "Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif;
    }
    .hidden{
        display:none;
    }
    .new-btn-login-sp{
        padding: 1px;
        display: inline-block;
        width: 75%;
    }
    .new-btn-login {
        background-color: #02aaf1;
        color: #FFFFFF;
        font-weight: bold;
        border: none;
        width: 100%;
        height: 30px;
        border-radius: 5px;
        font-size: 16px;
    }
    #main{
        width:100%;
        margin:0 auto;
        font-size:14px;
    }
    .red-star{
        color:#f00;
        width:10px;
        display:inline-block;
    }
    .null-star{
        color:#fff;
    }
    .content{
        margin-top:5px;
    }
    .content dt{
        width:100px;
        display:inline-block;
        float: left;
        margin-left: 20px;
        color: #666;
        font-size: 13px;
        margin-top: 8px;
    }
    .content dd{
        margin-left:120px;
        margin-bottom:5px;
    }
    .content dd input {
        width: 85%;
        height: 28px;
        border: 0;
        -webkit-border-radius: 0;
        -webkit-appearance: none;
        background: #f3f3f4;
    }
    .content dd span{
        margin-top: 8px; 
        height: 28px;
        /*line-height: 28px;*/
        border: 0;
        -webkit-border-radius: 0;
        -webkit-appearance: none;
        display: inline-block;  
    }
    #foot{
        margin-top:10px;
        position: absolute;
        bottom: 15px;
        width: 100%;
    }
    .foot-ul{
        width: 100%;
    }
    .foot-ul li {
        width: 100%;
        text-align:center;
        color: #666;
    }
    .note-help {
        color: #999999;
        font-size: 12px;
        line-height: 130%;
        margin-top: 5px;
        width: 100%;
        display: block;
    }
    #btn-dd{
        margin: 20px;
        text-align: center;
    }
    .foot-ul{
        width: 100%;
    }
    .one_line{
        display: block;
        height: 1px;
        border: 0;
        border-top: 1px solid #eeeeee;
        width: 100%;
        margin-left: 20px;
    }
    .am-header {
        display: -webkit-box;
        display: -ms-flexbox;
        display: box;
        width: 100%;
        position: relative;
        padding: 7px 0;
        -webkit-box-sizing: border-box;
        -ms-box-sizing: border-box;
        box-sizing: border-box;
        background: #1D222D;
        height: 50px;
        text-align: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        box-pack: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        box-align: center;
    }
    .am-header h1 {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        box-flex: 1;
        line-height: 18px;
        text-align: center;
        font-size: 18px;
        font-weight: 300;
        color: #fff;
    }
    hr{
        margin: 0px;
        padding: 0px;
    }
</style>
		<div id="page-wrapper" class="gray-bg dashbard-1">
	        <!-- 面包屑 -->
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-sm-10">
                    <h2>购买房卡</h2>
                    <ol class="breadcrumb">
                 
                    </ol>
                </div>
            </div>
            <!-- 表格 -->
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-sm-12 col-xs-12">
                        <div class="ibox float-e-margins">
                            <?php if(!$get){?>
                            <form method="post" class="form-horizontal" enctype="multipart/form-data" action="" style="padding:0 10px;">
                                <!-- <div class="form-group " id="shop" style="display:">
                                    <label class="col-sm-2 control-label">购买房卡：</label>
                                    <div class="col-sm-5">
                                        <input type="text" name="money" id="money" class="form-control" placeholder="请输入要购买的金额" value="">
                                        <p id="notice"></p>
                                    </div>
                                    <span class="btn btn-primary" id="submit" style="margin-top:10px;margin-left:15px;">确定</span>
                                </div> -->
                                <div  class="form-group " style="display:" id="shopInfo">
                                    <span class="btn btn-info" id="back" style="margin-left:15px;">返回</span>
                                    <dl class="content">
                                         <dt>商户订单号：</dt>
                                        <dd>
                                            <input id="WIDout_trade_no" name="WIDout_trade_no" value="" readonly="">
                                        </dd>
                                        <hr class="one_line">
                                        <dt>订单名称：</dt>
                                        <dd>
                                            <input id="WIDsubject" name="WIDsubject" value="" readonly="">
                                        </dd>
                                        <hr class="one_line">
                                        <dt>付款金额 ：</dt>
                                        <dd>
                                            <input id="WIDtotal_amount" name="WIDtotal_amount" value="<?php echo $WIDtotal_amount ?>" readonly="">
                                        </dd>
                                        <hr class="one_line">
                                        <dt>商品描述：</dt>
                                        <dd>
                                            <input id="WIDbody" name="WIDbody" value="" readonly="">
                                        </dd>
                                        <hr class="one_line">
                                        <p></p>
                                        <dd id="btn-dd">
                                            <span class="new-btn-login-sp">
                                                <input type="hidden" name="action" value="1">
                                                <button class="new-btn-login" type="submit" style="text-align:center;">确 认</button>
                                            </span>
                                        </dd>
                                    </dl>
                                </div>
                            </form>
                            <script>

                                // $("#money").change(function() {
                                //     var notice = document.getElementById('notice');
                                //     var money = document.getElementById('money').value;
                                //     if (money == ""){
                                //         notice.innerHTML = "请输入要购买的金额";
                                //         return false;
                                //     }if (!(/(^[1-9]\d*$)/.test(money))){
                                //         notice.innerHTML = "您输入的数量有误，请从新输入";
                                //         return false;
                                //     }
                                     
                                // });
                                // document.getElementById('submit').onclick = function(){
                                //     var money = document.getElementById('money').value;
                                //     var money = $("input[name=money]").val();   // 需要充值数量
                                //     if (money == ""){
                                //         alert("请输入购买数量");
                                //         return false;
                                //     }if (!(/(^[1-9]\d*$)/.test(money))){
                                //         alert("您输入的数量有误，请从新输入");
                                //         return false;
                                //     }
                                //     document.getElementById('shop').style.display= "none";
                                //     document.getElementById('shopInfo').style.display= "block";

                                //     var vNow = new Date();
                                //     var sNow = "";
                                //     sNow += String(vNow.getFullYear());
                                //     sNow += String(vNow.getMonth() + 1);
                                //     sNow += String(vNow.getDate());
                                //     sNow += String(vNow.getHours());
                                //     sNow += String(vNow.getMinutes());
                                //     sNow += String(vNow.getSeconds());
                                //     sNow += String(vNow.getMilliseconds());

                                //     document.getElementById("WIDout_trade_no").value =  sNow;
                                //     document.getElementById("WIDsubject").value = "房卡";
                                //     document.getElementById("WIDtotal_amount").value = "0.1";
                                //     document.getElementById("WIDbody").value = "房卡，一元一张";
                                // } 
                                // 以上是测试用的

                                window.onload = function(){
                                    var vNow = new Date();
                                    var sNow = "";
                                    sNow += String(vNow.getFullYear());
                                    sNow += String(vNow.getMonth() + 1);
                                    sNow += String(vNow.getDate());
                                    sNow += String(vNow.getHours());
                                    sNow += String(vNow.getMinutes());
                                    sNow += String(vNow.getSeconds());
                                    sNow += String(vNow.getMilliseconds());
                                    document.getElementById("WIDout_trade_no").value =  sNow;
                                    document.getElementById("WIDsubject").value = "商品";
                                    var money =document.getElementById("WIDtotal_amount").value;
                                    document.getElementById("WIDbody").value = "商品";
                                    $.ajax({
                                        type:"post",
                                        url:"common_ajax.php",
                                        data:{getcard:money},
                                        success:function(data){
                                            var data = JSON.parse(data);         
                                            var num = data.cardNum;
                                            document.getElementById("WIDbody").value = "商品数量"+num;
                                        }
                                    });
                                }
                                document.getElementById('back').onclick = function(){
                                    history.back();
                                }

                               
                                
                            </script>
                        <?php }if($get){ ?>
                            <div class="form-horizontal" style="padding:0 10px">
                                <div class="form-group " >
                                    <div style="text-align:center" class="col-sm-5 "><h2 style="text-align:center">交易成功</h2></div>
                                </div>
                               
                                <div class="form-group " >
                                    <label class="col-sm-2 control-label">时间：</label>
                                    <div class="col-sm-5">
                                        <span  class="form-control" > <?php echo $timestamp  ?></span>
                                    </div>
                                </div>
                                <div class="form-group " >
                                    <label class="col-sm-2 control-label">订单号：</label>
                                    <div class="col-sm-5">
                                        <span  class="form-control" > <?php echo $out_trade_no  ?></span>
                                    </div>
                                </div>
                                <div class="form-group " >
                                    <label class="col-sm-2 control-label">流水账号：</label>
                                    <div class="col-sm-5">
                                        <span  class="form-control" > <?php echo $trade_no  ?></span>
                                    </div>
                                </div>
                                <div class="form-group " >
                                    <label class="col-sm-2 control-label">总额：</label>
                                    <div class="col-sm-5">
                                        <span  class="form-control" > <?php echo $total_amount  ?></span>
                                    </div>
                                </div>
                                <div class="form-group " >
                                    <label class="col-sm-2 control-label">官方支付宝：</label>
                                    <div class="col-sm-5">
                                        <span  class="form-control" > <?php echo $seller_id  ?></span>
                                    </div>
                                </div>
                                <div class="form-group " >
                                    <div style="text-align:center" class="col-sm-5 "> <span class="btn btn-info" id="sure">确定</span> </div>
                                </div>
                            </div>

                            <script>
                                 document.getElementById('sure').onclick = function(){
                                    window.location.href = "buy_card.php";
                                }
                            </script>

                            <?php } ?>
                            

                        </div>
                    </div>
                </div>
            </div>
            <!-- 表格end -->
        </div>
		<!-- 内容区域end -->
    </div>

<?php require_once('common-footer.php'); ?>
