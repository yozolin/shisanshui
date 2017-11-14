<?php require_once('common.php'); ?>
<?php 
/**
 * admin/user_addCardNum.php
 * 添加房卡
 */

# 页面标题
$web_title = '充值房卡';


# 判断当前操作是 显示页面 还是 处理表单页面
$action = isset($_POST['action']) ? true : false;
// var_dump( select_user() );exit;
if( $action ){
    #防crsf攻击
    if( check_crsf() ){
        alert_go("兄台，你要干什么？","index.php");exit;
    }

    $id = $_POST['id'];                     # ID
    $cardNum = $_POST['cardNum'];           # 房卡数量
    $discount = $_POST['discount'];         # 折扣
    $t_price = 2*$cardNum*$discount/10;     # 总价
    $typeInfo =  $_POST['typeInfo'];        #充值对象
    // var_dump($t_price);exit;
    if( !$typeInfo ){
        alert_go( '充值对象不能为空' );
        exit;
    }
    if( !$id ){
        alert_go( '用户id不能为空' );
        exit;
    }
    if( !$cardNum ){
        alert_go( '房卡数不能为空' );
        exit;
    }
    # 当前管理员id
    # 获取时间 
    $time = time(); 
    # 如果不是管理员则去判断房卡是否充足
     if($_SESSION['type']!="admin"){
        if( select_cardNum($_SESSION['id'],$_SESSION['type']) < $cardNum){
            alert_go('房卡不足');exit;
        }
    }
    # 查询是否有此用户 如果有则去处理该用户的房卡
    $query = "SELECT * FROM ".$typeInfo." WHERE id=".$id;
    # var_dump( $query);exit;
    $result = mysql_query($query);
    $exit_user = mysql_fetch_assoc($result);
    if($exit_user){
        # 更新充值对象房卡
        if($_SESSION['type']!="admin"){
            $inviteCode = $exit_user['inviteCode'];     #代理邀请码
            if(!$inviteCode || $inviteCode != $_SESSION['inviteCode']){
                alert_go("该用户不归属你的名下","user_lists.php");exit;
            }
            update_cardNumObj($id,$cardNum,$typeInfo);
            # 更新代理商销售总额：update_totalCardNum()
            # 传四个参数，1表名，2对象id，3房卡数量，4总额
            $agent_id = $_SESSION['id'];
            update_totalCardNum("agent_recharge",$agent_id,$cardNum,$t_price);
            // exit;
            # 更新代理房卡
            $update_agent_result=update_agent_cardNum($_SESSION['id'],$cardNum);
            if($update_agent_result){ $flag =1; }
            else{ $flag =-1; }
        
        }else{ # 不是代理商则不需要对充值人的房卡更新
            update_cardNumObj($id,$cardNum,$typeInfo);
            $flag =1; 
        }  
    }else{
        alert_go('没有ID为'.$id.'的用户');$flag=0;
    }
     # 判断是否成功执行
    $orders_type="user";
    if($flag==1){
        if($_SESSION['type']!="admin"){ #更新用户充值的总量
            update_totalCardNum("user_recharge",$id,$cardNum,$t_price);
            // exit;
        }
        # insert_orders：插入订单信息
        $result = insert_orders($id,$cardNum,$t_price,$discount,$orders_type,$_SESSION['inviteCode']);
        # var_dump( $result ) ;exit;
        if ($result==-1) {
            updata_log('插入订单失败');
        }else if($result==1){ 
            updata_log('成功给ID：'.$id.'充值房卡'.$cardNum.'张');
        }
        # exit;
        alert_go('充值成功','user_lists.php');
    }else if($flag==-1){
        alert_go('充值失败！网络出错，请稍后再试');
    }
    # 阻止往下执行：不需要显示页面
    exit;
}else{
    $id = isset($_GET['id'])?$_GET['id']:''; 
    $addCard = isset($_GET['addCard'])?$_GET['addCard']:''; 
    $cardNum = select_cardNum($_SESSION['id'],$_SESSION['type']);
    // var_dump($cardNum["cardNumber"]);exit;
}

?>
<?php require_once('common-header.php'); ?>	
		<!-- 内容区域 -->
			
		<div id="page-wrapper" class="gray-bg dashbard-1">
	        <!-- 面包屑 -->
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>充值房卡</h2>
                    <ol class="breadcrumb">
                        <li><a href="index.php">首页</a></li>
                        <li><a href="user_lists.php">用户管理</a></li>
                        <li><a href="user_addCardNum.php">充值房卡</a></li>
                    </ol>
                </div>
            </div>
            <!-- 表格 -->
            <div class="wrapper wrapper-content animated fadeInRight">
                
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-title">
                                <h5>充值房卡 <small>填写信息</small></h5>
                            </div>
                            <div class="ibox-content">
    
    <!-- 表单 -->
    <form method="post" class="form-horizontal" action="">
        <?php if($_SESSION['type']!="admin"){ ?>
        <!-- 我的房卡 -->
        <div class="form-group">
            <label class="col-sm-2 control-label">我的房卡</label>
            <div class="col-sm-5">
                <input type="text" class="form-control"  name="my_cardNum" value="<?php echo $cardNum; ?>" disabled="" > 
            </div>
        </div>
        <div class="hr-line-dashed"></div>
        <?php } ?>
        <!-- 用户ID -->
        <div class="form-group">
            <label class="col-sm-2 control-label">用户ID</label>
            <div class="col-sm-5">
                <input type="text" class="form-control"  name="id" value="<?php echo $id; ?>" > 
            </div>
        </div>

        <!-- 充值对象 -->
        <div class="hr-line-dashed"></div>
        <div class="form-group">
            <label class="col-sm-2 control-label">充值对象</label>
            <div class="col-sm-5">
                <input type="radio" value="agent" name="typeInfo" class="radio-inline">
                <label for="" class="control-label"style="font-size:15px;">下级代理</label> &nbsp;&nbsp;&nbsp;&nbsp;

                <input type="radio" value="users" name="typeInfo" class="radio-inline">
                <label for="" class="control-label"style="font-size:15px;">用户</label>
            </div>
        </div>
        <div class="hr-line-dashed"></div>
     
        <!--  -->
        <div class="form-group">
            <label class="col-sm-2 control-label">数量</label>
            <div class="col-sm-5">
                <input type="text" name="cardNum" class="form-control" value="" placeholder="请输入充值数量" >
            </div>
        </div>
        <div class="hr-line-dashed"></div>
     
        <!--  -->
        <div class="form-group">
            <label class="col-sm-2 control-label">单价</label>
            <div class="col-sm-5">
                <input type="text" name="price" class="form-control" disabled="" value="1元">
            </div>
        </div>
        <div class="hr-line-dashed"></div>

        <div class="form-group">
            <label class="col-sm-2 control-label">折扣</label>
            <div class="col-sm-5">
                <select name="discount" id="discount" >
                    <option value="10">10折</option>
                    <option value="9">9折</option>
                    <option value="8">8折</option>
                    <option value="7">7折</option>
                    <option value="6">6折</option>
                    <option value="5">5折</option>
                    <option value="4">4折</option>
                    <option value="3">3折</option>
                    <option value="2">2折</option>
                    <option value="1">1折</option>
                </select>
                
            </div>
        </div>
        <div class="hr-line-dashed"></div>

        <div class="form-group">
            <label class="col-sm-2 control-label">总价</label>
            <div class="col-sm-5">
                 <input type="text" name="t_price" class="form-control" disabled="">
            </div>
        </div>
        <div class="hr-line-dashed"></div>

        <div class="form-group">
            <div class="col-sm-4 col-sm-offset-2">
                <!-- crsf口令 -->
                <?php create_crsf() ?>
                <input type="hidden" name="action" value="1">
                <button class="btn btn-primary" type="submit">确定</button>
            </div>
        </div>
    </form>
    <!-- 表单end -->
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <!-- 表格end -->
            

        </div>
		<!-- 内容区域end -->
		

    </div>
<script>
    $(".form-horizontal").change(function(){
        // 需要充值数量
        var cardNum = $("input[name=cardNum]").val();
        // 单价
        var discount =$("select[name=discount]").val();
        // 总价
        var t_price = 2*cardNum*discount/10;
        // console.log(t_price);
        $("input[name=t_price]").val(t_price);
    });
    var addCard = "<?php echo $addCard ?>";
    $(".form-group input[value="+addCard+"]").attr("checked",'checked');  
</script>
<?php require_once('common-footer.php'); ?>
