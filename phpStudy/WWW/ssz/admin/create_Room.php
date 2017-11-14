<?php require_once('common.php'); ?>
<?php 
/**
 * admin/create_room.php
 * 充值房卡
 */
# 页面标题
$web_title = '添加房卡';

# 判断当前操作是 显示页面 还是 处理表单页面
$action = isset($_POST['action']) ? $_POST['action'] : false;
if($action){
    # 提交了表单
    // var_dump($_POST);
    
    # 标题
    $title = $_POST['title'];
    # 关键字
    $keywords = $_POST['keywords'];
    # 描述
    $description = $_POST['description'];
    # 联系人
    $person = $_POST['person'];
    # 电话
    $phone = $_POST['phone'];
    # QQ
    $qq = $_POST['qq'];
    # 版权
    $copyright = $_POST['copyright'];

    # 更新影响的记录行数
    $logs = 0;

    # 更新标题
    if( update_config($title,'title') ){
        $logs++;
    }
    
    # 更新关键字
    if( update_config($keywords,'keywords') ){
        $logs++;
    }
    
    # 更新描述
    if( update_config($description,'description') ){
        $logs++;
    }
    
    # 更新联系人
    if( update_config($person,'person') ){
        $logs++;
    }

    # 更新联系人电话
    if( update_config($phone,'phone') ){
        $logs++;
    }

    # 更新联系人qq
    if( update_config($qq,'qq') ){
        $logs++;
    }

    # 更新版权
    if( update_config($copyright,'copyright') ){
        $logs++;
    }
    // var_dump($logs); exit;

    # 判断是否有更新
    if( $logs ){
        alert_go('成功更新网站配置信息','website_info.php');
    }else{
        alert_go('更新失败：网络原因，请稍后再试');
    }

    # 阻止往下执行
    exit;
}else{
  
}

?>
<?php require_once('common-header.php'); ?>

		
		<!-- 内容区域 -->
			
		<div id="page-wrapper" class="gray-bg dashbard-1">
	        <!-- 面包屑 -->
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>添加房卡</h2>
                    <ol class="breadcrumb">
                    </ol>
                </div>
            </div>
            
            <!-- 表格 -->
            <div class="wrapper wrapper-content animated fadeInRight">
                
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-title">
                                <h5>添加房卡 <small></small></h5>
                            </div>
                            <div class="ibox-content">
    
    <!-- 表单 -->
    <form method="post" class="form-horizontal" action="">
        <div class="form-content" style="width:50%;">
            <!-- 我的房卡 -->
            <div class="form-group">
                <div class="col-sm-12" style="text-align:center;">
                    <span class="btn btn-info">下级代理商</span>
                    <span class="btn btn-info">用户</span>
                </div>
            </div>
            <div class="hr-line-dashed"></div>

            <!-- 我的房卡 -->
            <div class="form-group">
                <label class="col-sm-2 control-label">我的房卡</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control"  value="" name="title" disabled="">
                </div>
            </div>
            <div class="hr-line-dashed"></div>
            
            <!-- 关键字 -->
            <div class="form-group">
                <label class="col-sm-2 control-label">ID</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" placeholder="" value="" name="keywords">
                </div>
            </div>
            <div class="hr-line-dashed"></div>
      
            <!-- 描述信息 -->
            <div class="form-group">
                <label class="col-sm-2 control-label">数目</label>
                <div class="col-sm-10">
                    <input name="description" class="form-control " >
                </div>
            </div>
            <div class="hr-line-dashed"></div>
            
            <!-- 联系人 -->
            <div class="form-group">
                <label class="col-sm-2 control-label">单价</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" value="2元" name="person" disabled="">
                </div>
            </div>
            <div class="hr-line-dashed"></div>
            
            <!-- 联系人电话 -->
            <div class="form-group">
                <label class="col-sm-2 control-label">折扣</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" placeholder="" value="" name="phone">
                </div>
            </div>
            <div class="hr-line-dashed"></div>
            
            <!-- 联系人QQ -->
            <div class="form-group">
                <label class="col-sm-2 control-label">总价</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" value="" name="qq" disabled="">
                </div>
            </div>
            <div class="hr-line-dashed"></div>


            <div class="form-group">
                <div class="col-sm-4 col-sm-offset-2">
                    <input type="hidden" name="action" value="1">
                    <button class="btn btn-primary" type="submit">提交表单</button>
                </div>
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

<?php require_once('common-footer.php'); ?>
