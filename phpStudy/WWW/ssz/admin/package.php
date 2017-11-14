<?php require_once('common.php'); ?>
<?php 
/**
 * admin/user_addCardNum.php
 * 添加房卡
 */
# 页面标题
$web_title = '套餐信息';
if($_SESSION['type']!="admin"){
    $ip = get_real_ip();
     updata_log( "代理:".$_SESSION['nickname'].",账户:".$_SESSION['username']."尝试进入添加管理系统,时间".date("Y-m-d H:i:s",time()) );
    alert_go("兄台！你想干什么","index.php");exit;
}
# 判断当前操作是 显示页面 还是 处理表单页面
$action = isset($_POST['action']) ? true : false;
if( $action ){
    #防crsf攻击
    // if( check_crsf() ){
    //     alert_go("兄台，你要干什么？","index.php");exit;
    // }
    $time = time(); 
    $id = $_POST['id'];                    
    $title = $_POST['title'];                    
    $num = $_POST['num'];   
    $price = $_POST['price'];    
    // var_dump($num);                
    // var_dump($price);exit;                 
    $path = updata_ewm();
    $update = "UPDATE package set title ='{$title}',num ='{$num}',price ='{$price}' WHERE id=".$id;
    if($path){
        $update = "UPDATE package set title ='{$title}',num ='{$num}',price ='{$price}',img ='{$path}' WHERE id=".$id;
    }
    $query = mysql_query($update);

    $affected = mysql_affected_rows();
    if( $affected ){
        alert_go("更新套餐成功","package.php");
    }else{
        alert_go("更新失败！网络出错，请稍后再试！");
    }
    exit;
}
$select = "SELECT * FROM package";
$query = mysql_query($select);
$date = [];
while ( $row = mysql_fetch_assoc($query) ) {
     $date[] = $row;
}


?>
<?php require_once('common-header.php'); ?> 
        <!-- 内容区域 -->
            
        <div id="page-wrapper" class="gray-bg dashbard-1">
            <!-- 面包屑 -->
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>套餐信息</h2>
                    <ol class="breadcrumb">
                        <li><a href="index.php">首页</a></li>
                        <li><a href="user_lists.php">用户管理</a></li>
                        <li><a href="user_addCardNum.php">套餐设置</a></li>
                    </ol>
                </div>
            </div>
            <!-- 表格 -->
            <div class="wrapper wrapper-content animated fadeInRight">
                
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-title">
                                <h5>设置套餐 <small>填写信息</small></h5>
                            </div>
                            <div class="ibox-content">

    <?php foreach ($date as $key => $value) {?>
    <!-- 表单 -->
    <form method="post" class="form-horizontal" action="" enctype="multipart/form-data">
        <h1><?php echo $value['title'] ?>:</h1>
        <!-- 用户ID -->
        <div class="form-group">
            <label class="col-sm-2 control-label">套餐标题</label>
            <div class="col-sm-5">
                <input type="text" class="form-control"  name="title" value="<?php echo $value['title'] ?>" > 
            </div>
        </div>
        <div class="hr-line-dashed"></div>
        <!-- 数量 -->
        <div class="form-group">
            <label class="col-sm-2 control-label">套餐价格</label>
            <div class="col-sm-2" style="position:relative">
                <p style="position:absolute;top:0;left:15px;line-height:34px;font-size:18px;background:transparent;padding:0 5px;">￥</p>
                <input type="text" name="price" class="form-control" value="<?php echo $value['price']; ?>" style="padding-left:28px;">
            </div>
            <div class="col-sm-2" style="position:relative">
                <p style="position:absolute;top:0;right:-15px;line-height:34px;font-size:18px;background:transparent;padding:0 5px;">张</p>
                <input type="text" name="num" class="form-control" value="<?php echo $value['num'] ?>">
            </div>
        </div>
        <div class="hr-line-dashed"></div>
        <!--  -->
        <div class="form-group" style="display:none">
            <label class="col-sm-2 control-label">数量</label>
            <div class="col-sm-5">
                <input type="text" name="num1" class="form-control" value="<?php echo $value['num'] ?>">
            </div>
        </div>
        <div class="hr-line-dashed" style="display:none"></div>

        <div class="form-group">
            <label class="col-sm-2 control-label">联系方式</label>
            <div class="col-sm-3">
                <input type="text" name="comment" class="form-control" value="<?php echo $value['comment'] ?>">
            </div>
            <div class="col-sm-2">
                <input type="file" name="file" id="file" style="height:25px">
                <?php if($value['img']){ ?>
                <img src="<?php echo $value['img'] ?>" alt="" width="150">
                <?php } ?>
            </div>
        </div>
        <div class="hr-line-dashed"></div>
        <div class="form-group">
            <div class="col-sm-4 col-sm-offset-2">
                <!-- crsf口令 -->
                <?php create_crsf() ?>
                <input type="hidden" name="action" value="1">
                <input type="hidden" name="id" value="<?php echo $value['id'] ?>">
                <!-- <span class="btn btn-primary" id="submit-btn">确定</span> -->
                <button class="btn btn-primary" type="submit">确定</button>
            </div>
        </div>
    </form>
     <div class="hr-line-dashed"></div>
    <?php } ?>

<script>
    $('.form-horizontal').change(function(){
        var price = $(this).find("input[name=price]").val();    // 金额
        var num = $(this).find("input[name=num]").val();        // 数量
        
        if (!(/(^[0-9]\d*$)/.test(num))){
            alert("您输入的数量有误，请从新输入");
            return false;
        }
        if (!(/(^[0-9]\d*$)/.test(price))){
            alert("您输入的金额有误，请从新输入");
            return false;
        }
    })
</script>
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

<?php require_once('common-footer.php'); ?>
