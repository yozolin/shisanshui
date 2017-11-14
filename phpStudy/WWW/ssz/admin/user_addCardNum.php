<?php require_once('common.php'); ?>
<?php 
/**
 * admin/user_addCardNum.php
 * 添加房卡
 */

$web_title = '充值房卡';        # 页面标题
$id = isset($_GET['id'])?$_GET['id']:''; 
$addCard = isset($_GET['addCard'])?$_GET['addCard']:''; 
$cardNum = select_cardNum($_SESSION['id'],$_SESSION['type']);
// var_dump($cardNum["cardNumber"]);exit;

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
                <input type="radio" value="users" name="typeInfo" class="radio-inline" checked="checked">
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
        var cardNum = $("input[name=cardNum]").val();       // 需要充值数量
        var discount = $("select[name=discount]").val();    // 单价
        var t_price = cardNum;      // 总价
        // console.log(t_price);
        $("input[name=t_price]").val(t_price);
    });
    var addCard = "<?php echo $addCard ?>" ? "<?php echo $addCard ?>" : false;
    $(".form-group input[value="+addCard+"]").attr("checked",'checked');

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
        var typeInfo =''; //对象类型
        var radio = document.getElementsByName('typeInfo');
         for(var i=0;i<radio.length;i++){
            if(radio[i].checked==true){
              typeInfo=radio[i].value;
            }
        }
        var data = {};
        data.id = id;
        data.cardNum = cardNum;
        data.typeInfo = typeInfo;
        //console.log(data);
        $.ajax({
            type:"post",
            url:"common_ajax.php",
            data:{addCard:data},
            success:function(data){
                //var data = eval(data);
                var date = JSON.parse(data);
                addCardResult(date);
                //console.log(date);
            }
        });
    });

</script>
<?php require_once('common-footer.php'); ?>
