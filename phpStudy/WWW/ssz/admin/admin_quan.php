<?php require_once('common.php'); ?>
<?php 
/**
 * admin/admin_edit.php
 * 编辑管理员页面 
 */
#判断是否是管理员登录
if($_SESSION['type']!="admin"){
    $ip = get_real_ip();
     updata_log( "代理:".$_SESSION['nickname'].",账户:".$_SESSION['username']."尝试进入后台管理员系统,时间".date("Y-m-d H:i:s",time()) );
    alert_go("兄台！你想干什么","index.php");exit;
}
# 页面标题
$web_title = '编辑管理员';

# 判断当前操作是 显示页面 还是 处理表单页面
$action = isset($_POST['action']) ? $_POST['action'] : false;
if($action){
    # 提交了表单
    # 测试下 提交了什么数据过来 
    // var_dump($_POST); exit;
    
    # 管理员id
    $admin_id = intval($_POST['id']);

    # 管理员名称 管理员邮箱
    $admin_name = $_POST['admin_name'];
 

    # 密码与重复密码
    $password = $_POST['password'];
    $re_password = $_POST['re_password'];

    # 判断管理员名称是否为空
    if( !$admin_name ){
        alert_go('名称不能为空');
        exit;
    }
    # 判断管理员email是否为空
  
    
    # 更新时间
    $time = time();

    # 判断管理员密码是否有输入，有的话则需要修改密码
    if( $password ){
        # 判断密码 与 重复密码 是否一致
        if($password != $re_password){
            alert_go('两次输入的密码不一致，请重新输入');
            exit;
        }
        # 随机字符串
        $crypt = rand_string();
        // var_dump($crypt);
        
        # 生成密码
        $pwd = create_pwd($password,$crypt);
        // var_dump($pwd);
    
        # 构建sql语句 : update
        $query = "UPDATE admin SET 
            nickname = '{$admin_name}',
            password = '{$pwd}',
            crypt = '{$crypt}',
                updateAt = {$time}
        ";
    }else{

        # 构建sql语句 : update
        $query = "UPDATE admin SET 
            nickname = '{$admin_name}',
                updateAt = {$time}
        ";
    }
    
    $query .= " WHERE id=".$admin_id;
    // var_dump($query); exit;

    # 发送指令
    mysql_query($query);

    # 判断是否成功更新
    $logs = mysql_affected_rows();
    if( $logs ){
        alert_go('成功编辑管理员','admin_lists.php');
    }else{
        alert_go('编辑失败：网络原因，请稍后再试');
    }

    # 阻止往下执行
    exit;
}else{
    # 显示页面

    # 接收 get方式传送过来的 id
    $id = isset($_GET['id']) ? $_GET['id'] : 0 ;
    # 过滤
    
    $id = intval($id);

    if( $id <=0 ){
        alert_go( '管理员id不存在或者非法id','admin_lists.php' );
        exit;
    }

    # 构建sql查询语句 ： select
    $query = "SELECT * FROM admin WHERE id=".$id;
    // var_dump($query);

    # 发送指令 : 资源类型的结果集
    $result = mysql_query($query);

    # 从结果集中读取数据
    $single = mysql_fetch_assoc($result);
    // var_dump($single);

    # 安全的判断过滤：如果管理员不存在，就回到管理员列表
    if( !$single ){
        alert_go('该管理员不存在','admin_lists.php');
    }

}

?>
<?php require_once('common-header.php'); ?>

		<!-- 内容区域 -->
			
		<div id="page-wrapper" class="gray-bg dashbard-1">
	        <!-- 面包屑 -->
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>编辑管理员</h2>
                    <ol class="breadcrumb">
                        <li><a href="index.php">首页</a></li>
                        <li><a href="admin_lists.php">管理员列表</a></li>
                    </ol>
                </div>
            </div>

            <!-- 表格 -->
            <div class="wrapper wrapper-content animated fadeInRight">
                
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-title">
                                <h5>设置管理员权限 <small>填写信息</small></h5>
                            </div>
                            <div class="ibox-content">
    
    <!-- 表单 -->
    <form method="post" class="form-horizontal" action="">
        
        <!-- 名称 -->
        <div class="form-group">
            <label class="col-sm-2 control-label">管理员名称</label>
            <div class="col-sm-5">
                <input type="text" class="form-control"  name="admin_name" value="<?php echo $single['nickname'];?>" disabled="">
            </div>
        </div>
        <div class="hr-line-dashed"></div>
     
        <!-- 密码 -->
        
     
        <!-- 再次确认密码 -->
        <div class="form-group">
            <label class="col-sm-2 control-label">当前权限</label>
            <div class="col-sm-5">
                <input type="text" class="form-control"  value="<?php if($single['permission']==0){echo "无权限" ;}else{echo "权限已给";}?>">
            </div>
        </div>
        <div class="hr-line-dashed"></div>
        <input type="hidden" value="<?php echo $single['id']?>" id="userid" >
        <input type="hidden" value="<?php echo $single['permission']?>" id="quan" >
        <div class="form-group">
            <label class="col-sm-2 control-label">设置权限</label>
            <div class="col-sm-5">
          <?php  if($single['permission']==0){ ?>
               <a href="javascript:void(0)"   onclick="addquan()">上权限</a>  
        <?php }else{?>
                 <a href="javascript:void(0)" onclick="addquan()">下权限</a>
            <?php }?>
            </div>
        </div>
        <div class="hr-line-dashed"></div>
        
        <!-- 邮箱 -->
        <script type="text/javascript">
        function addquan(){
            var aid = $('#userid').val();
            var qua = $('#quan').val();
            $.ajax({
                type:"post",
                url:"common_ajax.php",
                data:{aid:aid,qua:qua},
                success:function(data){
                    var data = eval(data);
                    if(data==1){
                        alert("设置成功");
                        window.location.reload() 
                    }else{
                        alert("设置失败");
                    }
                }
            })
        }
</script>


        
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
	<script type="text/javascript">
    
    </script>	

    </div>
<?php require_once('common-footer.php'); ?>