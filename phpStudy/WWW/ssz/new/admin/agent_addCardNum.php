<?php require_once('common.php'); ?>
<?php 
/**
 * admin/agent_add.php
 * 添加代理
 */
# 页面标题
$web_title = '充值房卡';

# 判断当前操作是 显示页面 还是 处理表单页面
$action = isset($_POST['action']) ? false : false;
// $action = $_POST['action'];

if( $action ){
    #防crsf攻击
    if( check_crsf() ){ 
        alert_go("兄台，你要干什么？","index.php");exit;
    }
    $id = $_POST['id'];                 # ID  
    $cardNum = $_POST['cardNum'];       # 房卡数量 
    //$discount = $_POST['discount'];     # 折扣
    $t_price = $cardNum; # 总价
    if( !$id ){
        alert_go( '代理id不能为空' );
        exit;
    }
    if( !$cardNum ){
        alert_go( '房卡不能为空' );
        exit;
    }
    $my_id = $_SESSION['id']; 
    $time = time(); 
    # 查询是否此用户 如果有则去处理该用户的房卡
    $query = "select * from agent where id=".$id;
    $result = mysql_query($query);
    $rst = mysql_fetch_assoc($result);
    // var_dump($query);exit;
    if($rst){   // 更新被充值人房卡
        /*----------------MySQL事务开始------------------*/
        mysql_query("SET AUTOCOMMIT=0");    #不自动提交
        mysql_query("START TRANSACTION");   #开始事务
        $update= update_cardNumObj($id,$cardNum,"agent");
        $orders = insert_orders($id,$cardNum,$t_price,"10折","agent");
        if($_SESSION['type']!="admin"){
            update_totalCardNum("agent_recharge",$my_id,$cardNum,$t_price);#更新代理销售总量
            $update_agent_result = update_agent_cardNum($_SESSION['id'],$cardNum); // 更新充值人：代理房卡 
        }
        if( $update && $orders ){
            mysql_query("COMMIT");
            alert_go('充值成功','agent_lists.php');
        }else{
            mysql_query("ROLLBACK");
            alert_go('充值失败！网络出错，请稍后再试');
        }
        mysql_query("END");
        mysql_query("SET AUTOCOMMIT=1"); 
            /*----------------MySQL事务结束------------------*/ 
   }else{ alert_go('没有ID为'.$id.'的用户');}
    exit;
}else{
   $id = isset($_GET['id'])?$_GET['id']:''; 
   // var_dump(get_real_ip());
   // $sql = "select * form ";
   // var_dump($_SESSION);exit;
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
                        <li><a href="user_lists.php">用户管理管理</a></li>
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
                                <h5>添加代理 <small>填写信息</small></h5>
                            </div>
                            <div class="ibox-content">
    
    <!-- 表单 -->
    <form method="post" class="form-horizontal" enctype="multipart/form-data" action="">
        <?php if($_SESSION['type']!="admin"){ ?>
        <!-- 我的房卡 -->
        <div class="form-group">
            <label class="col-sm-2 control-label">我的房卡</label>
            <div class="col-sm-5">
                <input type="text" class="form-control"  name="my_cardNum" value="<?php echo $id; ?>" disabled="" > 
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
                <span class="btn btn-primary" id="submit-btn">确定</span>
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
        var cardNum = $("input[name=cardNum]").val();// 需要充值数量
        var discount =$("select[name=discount]").val();// 单价
        var t_price = cardNum; // 总价
        // console.log(t_price);
        $("input[name=t_price]").val(t_price);
    })
    
    $("#submit-btn").click(function(){
        var cardNum = $("input[name=cardNum]").val();   // 需要充值数量
        if (cardNum == ""){
            alert("请输入充值数量");
            return false;
        }if (!(/(^[1-9]\d*$)/.test(cardNum))){
            alert("您输入的数量有误，请从新输入");
            return false;
        }
        $(this).hide();

        var id = $("input[name=id]").val();             //对象id
        var data = {};
        data.id = id;
        data.cardNum = cardNum;
        data.typeInfo = "agent";
        //console.log(data);
        $.ajax({
            type:"post",
            url:"common_ajax.php",
            data:{addCard:data},
            success:function(data){
                //var data = eval(data);
                var data = JSON.parse(data);
                addCardResult(data);
                console.log(data);
            }
        });
    });
</script>
<?php require_once('common-footer.php'); ?>
