<?php require_once('common.php'); ?>
<?php 
/**
 * admin/user_addCardNum.php
 * 添加房卡
 */

if($_SESSION['type']!="admin"){
    $ip = get_real_ip();
     updata_log( "代理:".$_SESSION['nickname'].",账户:".$_SESSION['username']."尝试进入后台管理员系统,时间".date("Y-m-d H:i:s",time()) );
    alert_go("兄台！你想干什么","index.php");exit;
}
# 页面标题
$web_title = '公告设置';
$action = isset($_POST['action']) ? true : false;

 $table_name = 'hall';       # 表名
$url = "admin_Maphack.php";        # 单页的标识

if( $action ){
   
  #字段
    $info = $_POST['clarity'];     # 处理表单页面
    if($info<0||$info>250){
         alert_go('请输入0-250之间的数字',$url);
         exit;
    }
    $id = $_POST['id'];
    $time = time(); # 更新时间
    $query = "UPDATE {$table_name} SET info1='{$info}' WHERE id='{$id}' ";   # 构建sql查询语句： update语句
    //var_dump($query);exit;
    mysql_query($query);     # 发送指令
    
    $logs = mysql_affected_rows();          # 是否更新成功
    if($logs){
        alert_go('设置成功',$url);
    }else{
        alert_go('设置失败，网络原因，请稍后再试');
    }
    # 阻止往下执行：不需要显示页面
    exit;
}else{
    $query = "SELECT * FROM {$table_name}";         # 构建sql语句
    $result = mysql_query($query);                  # 发送指令
    $single = mysql_fetch_assoc($result);            # 从结果集中读取数据
    // var_dump($single);
}
?>
<?php require_once('common-header.php'); ?>	
		<!-- 内容区域 -->
			
		<div id="page-wrapper" class="gray-bg dashbard-1">
	        <!-- 面包屑 -->
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>设置透明度</h2>
                    <ol class="breadcrumb">
                        <li><a href="index.php">首页</a></li>
                        <li><a href="user_lists.php">用户管理</a></li>
                        <li><a href="user_haopai.php">设置透明度</a></li>
                    </ol>
                </div>
            </div>
            <!-- 表格 -->
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-title">
                                <h5>设置透明度 <small>填写信息</small></h5>
                            </div>
                            <div class="ibox-content">
    <!-- 表单 -->
    <form method="post" class="form-horizontal" action="">
        
        <!-- 用户ID -->
       
        <!-- 充值对象 -->
        <div class="hr-line-dashed"></div>
        <div class="form-group">
            <label class="col-sm-2 control-label">当前透明度</label>
            <div class="col-sm-5">
                <input type="text" class="form-control"  name="info1" value=" <?php echo $single['info1']?>" disabled=""> 
                           
            </div>
        </div>
        <div class="hr-line-dashed"></div>
        <!--  -->
        <div class="form-group">
            <label class="col-sm-2 control-label">设置透明度</label>
            <div class="col-sm-5">
                <input type="text" name="clarity" id="claritys" class="form-control" value="" placeholder="请输入0-250之间的数字" >
                <span style="color:red">0表示不透明，数字越大透明度越高，250表示完全透明</span>
            </div>
        </div>
        <div class="hr-line-dashed"></div>
        <!--  -->
       
        <div class="hr-line-dashed"></div>
        <div class="form-group">
            <div class="col-sm-4 col-sm-offset-2">
                <!-- crsf口令 -->
                <?php create_crsf() ?>
               <input type="hidden" name="id" value="<?php echo $single['id']; ?>">
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
  

</script>
<?php require_once('common-footer.php'); ?>
