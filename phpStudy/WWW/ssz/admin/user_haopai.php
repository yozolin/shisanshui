<?php require_once('common.php'); ?>
<?php 
/**
 * admin/user_addCardNum.php
 * 添加房卡
 */

$web_title = '设置比牌';        # 页面标题
$id = $_GET['id'];
$action = isset($_POST['action']) ? true : false;
$table_name = 'users';       #数据表
$url = 'user_haopai.php';
$url2 = 'user_lists.php';
// var_dump($cardNum["cardNumber"]);exit;
if($action){
    $uid = $_POST['id'];

    $hong = isset($_POST['hong']) ? $_POST['hong'] :false;
    $arr = explode(".", $hong);

   //$count = count($arrs);
$arrays = array_count_values($arr);//统计数组中重复值出现的次数
    foreach($arrays as $k => $v){
       
       if($arrays[$k]>1){
            alert_go('存在重复的牌'.$k);
            exit;
        }else{
             $hongs = array();
             $pais = array();
            foreach($arr as $key=>$value){
                if(strlen($value)>1&&strlen($value)<4){
                    $arr1 = substr($value, 0,1);
                    $arr2 = substr($value,1,2);
                    $arrs1 = [1,2,3,4];//牌的4种颜色
                    $arrs2 = [1,2,3,4,5,6,7,8,9,10,11,12,13];//牌的值
                    if(in_array($arr1, $arrs1)&&in_array($arr2,$arrs2)){
                        $hong = $arr1."_".$arr2;
                    }else{
                        $hong = "";
                    }
                   }else{
                        $hong = "";
                   }
                   $hongs[] = $hong;
            }
        }
    }

   $info = array_filter($hongs);//去掉数组里面的空值
   $arrs =array_slice($info,0,13);//截取前面13位
  $hongs = json_encode($arrs);//然后JSON转码
    $query = "UPDATE {$table_name} SET hong='{$hongs}' WHERE id='{$uid}' ";   # 构建sql查询语句：

    mysql_query($query);     # 发送指令
    
    $logs = mysql_affected_rows();  
          # 是否更新成功
    if($logs){
        alert_go('设置成功',$url2);
    }else{
        alert_go('设置失败，网络原因，请稍后再试');
        exit;
    }
    # 阻止往下执行：不需要显示页面
    exit;
}else{
    $query = "SELECT * FROM {$table_name} WHERE id='{$id}'";         # 构建sql语句
    $result = mysql_query($query);                  # 发送指令
    $data = mysql_fetch_assoc($result); 
    $paiInfo = json_decode($data['hong'],true);
    $arrs2 = array();           # 从结果集中读取数据
    for($i=0 ; $i < count($paiInfo);$i++){
        $arr = explode('_',$paiInfo[$i]);
        $pai1 = [0,'方块','梅花','红桃','黑桃'];
        $pai2 = [0,'A',2,3,4,5,6,7,8,9,10,'J','Q','K'];
        if($pai2[$arr[1]]){
             $arrs2[] = $pai1[$arr[0]].$pai2[$arr[1]];
         } 
    }
}
?>
<?php require_once('common-header.php'); ?> 
        <!-- 内容区域 -->
            
        <div id="page-wrapper" class="gray-bg dashbard-1">
            <!-- 面包屑 -->
            <div class="row wrapper border-bottom white-bg page-heading">
                <div class="col-lg-10">
                    <h2>设置几率</h2>
                    <ol class="breadcrumb">
                        <li><a href="index.php">首页</a></li>
                        <li><a href="user_lists.php">用户管理</a></li>
                        <li><a href="user_haopai.php">设置比牌</a></li>
                    </ol>
                </div>
            </div>
            <!-- 表格 -->
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="ibox float-e-margins">
                            <div class="ibox-title">
                                <h5>设置比牌 <small>填写信息</small></h5>
                            </div>
                            <div class="ibox-content">
    <!-- 表单 -->
    <form method="post" class="form-horizontal" action="">
        
        <!-- 用户ID -->
        <div class="form-group">
            <label class="col-sm-2 control-label">用户ID</label>
            <div class="col-sm-5">
                <input type="text" class="form-control"  name="userid" value="<?php echo $id; ?>" disabled=""> 
            </div>
        </div>
        <!-- 充值对象 -->
        <div class="hr-line-dashed"></div>
        <div class="form-group">
            <label class="col-sm-2 control-label">比牌</label>
            <div class="col-sm-5">
                <input type="text" class="form-control"  name="hong1" value=" <?php $arr = $arrs2;if(is_array($arr)){foreach ($arr as $value)echo $value.'&nbsp;&nbsp;';}else{echo $arr;}?>" disabled=""> 
                           
            </div>
        </div>
        <div class="hr-line-dashed"></div>
        <!--  -->
        <div class="form-group">
            <label class="col-sm-2 control-label">设置比牌</label>
            <div class="col-sm-5">
                <span style="color:red;font-size: 16px;font-weight: bold;">红桃</span>   &nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold">A</span><input type='checkbox' name="pai" value="31" ">&nbsp;&nbsp;&nbsp;&nbsp; <span style="font-size:18px;color:#f00;font-weight: bold">2</span><input type='checkbox' name="pai" value="32" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold">3</span><input type='checkbox' name="pai" value="33" ">&nbsp;&nbsp; &nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold">4</span><input type='checkbox' name="pai" value="34" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold">5</span><input type='checkbox' name="pai" value="35" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold"> 6</span><input type='checkbox' name="pai" value="36" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold">7</span><input type='checkbox' name="pai" value="37" ">&nbsp;&nbsp; &nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold">8</span> <input type='checkbox' name="pai" value="38" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold">9</span><input type='checkbox' name="pai" value="39" "> &nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold">10</span><input type='checkbox' name="pai" value="310" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold">J</span><input type='checkbox' name="pai" value="311" ">&nbsp;&nbsp; &nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold">Q</span><input type='checkbox' name="pai" value="312" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold">K</span><input type='checkbox' name="pai" value="313" "> </br>
                <span style="color:#000;font-size: 16px;font-weight: bold;">黑桃</span>   &nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold">A</span><input type='checkbox' name="pai" value="41" ">&nbsp;&nbsp;&nbsp;&nbsp; <span style="font-size:18px;color:#000;font-weight: bold">2</span><input type='checkbox' name="pai" value="42" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold">3</span><input type='checkbox' name="pai" value="43" ">&nbsp;&nbsp; &nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold">4</span><input type='checkbox' name="pai" value="44" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold">5</span><input type='checkbox' name="pai" value="45" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold"> 6</span><input type='checkbox' name="pai" value="46" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold">7</span><input type='checkbox' name="pai" value="47" ">&nbsp;&nbsp; &nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold">8</span> <input type='checkbox' name="pai" value="48" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold">9</span><input type='checkbox' name="pai" value="49" "> &nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold">10</span><input type='checkbox' name="pai" value="410" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold">J</span><input type='checkbox' name="pai" value="411" ">&nbsp;&nbsp; &nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold">Q</span><input type='checkbox' name="pai" value="412" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold">K</span><input type='checkbox' name="pai" value="413" "> </br>

                <span style="color:red;font-size: 16px;font-weight: bold;">方块</span>   &nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold">A</span><input type='checkbox' name="pai" value="11" ">&nbsp;&nbsp;&nbsp;&nbsp; <span style="font-size:18px;color:#f00;font-weight: bold">2</span><input type='checkbox' name="pai" value="12" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold">3</span><input type='checkbox' name="pai" value="13" ">&nbsp;&nbsp; &nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold">4</span><input type='checkbox' name="pai" value="14" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold">5</span><input type='checkbox' name="pai" value="15" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold"> 6</span><input type='checkbox' name="pai" value="16" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold">7</span><input type='checkbox' name="pai" value="17" ">&nbsp;&nbsp; &nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold">8</span> <input type='checkbox' name="pai" value="18" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold">9</span><input type='checkbox' name="pai" value="19" "> &nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold">10</span><input type='checkbox' name="pai" value="110" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold">J</span><input type='checkbox' name="pai" value="111" ">&nbsp;&nbsp; &nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold">Q</span><input type='checkbox' name="pai" value="112" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#f00;font-weight: bold">K</span><input type='checkbox' name="pai" value="113" "> </br>
                  <span style="color:#000;font-size: 16px;font-weight: bold;">梅花</span>   &nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold">A</span><input type='checkbox' name="pai" value="21" ">&nbsp;&nbsp;&nbsp;&nbsp; <span style="font-size:18px;color:#000;font-weight: bold">2</span><input type='checkbox' name="pai" value="22" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold">3</span><input type='checkbox' name="pai" value="23" ">&nbsp;&nbsp; &nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold">4</span><input type='checkbox' name="pai" value="24" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold">5</span><input type='checkbox' name="pai" value="25" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold"> 6</span><input type='checkbox' name="pai" value="26" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold">7</span><input type='checkbox' name="pai" value="27" ">&nbsp;&nbsp; &nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold">8</span> <input type='checkbox' name="pai" value="28" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold">9</span><input type='checkbox' name="pai" value="29" "> &nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold">10</span><input type='checkbox' name="pai" value="210" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold">J</span><input type='checkbox' name="pai" value="211" ">&nbsp;&nbsp; &nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold">Q</span><input type='checkbox' name="pai" value="212" ">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size:18px;color:#000;font-weight: bold">K</span><input type='checkbox' name="pai" value="213" "> </br>
                 <span style="color:#000;font-size: 16px;font-weight: bold;">已选张数：</span><span id="yixuan" style="font-size: 18px;color:red">0</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#000;font-size: 16px;font-weight: bold;">还可以选：</span><span id="weixuan" style="font-size: 18px;color:red">13</span>
                <input type="text" name="hong" id="teshupai" class="form-control" value="" placeholder="请输入相对应的牌型以‘.’隔开如：11.213.31" ><a href="javascript:void(0)" onclick="CardManager.deal(0)">六对半</a>&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" onclick="CardManager.deal(1)">三同花</a>&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" onclick="CardManager.deal(2)">三顺子</a>&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" onclick="CardManager.deal(3)">至尊青龙</a>&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" onclick="CardManager.deal(4)">一条龙</a><br/>
                <span style="color:red">第一个数表示花色   1：方块，2：梅花，3：红桃，4：黑桃<br/>之后的1--13数字表示点数   1：A，11：J，12：Q，13：K。如"113"表示方块K，'21"表示梅花A；</span>
            </div>
        </div>
        <div class="hr-line-dashed"></div>
        <!--  -->
       
        <div class="hr-line-dashed"></div>
        <div class="form-group">
            <div class="col-sm-4 col-sm-offset-2">
                <!-- crsf口令 -->
                <?php create_crsf() ?>
                <input type="hidden" name="id" value="<?php echo $data['id']; ?>">
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
$(function() {
            $("input[type=checkbox]").on("click", function () {
                var vIds = "";
                $("input:checked").each(function() {
                    vIds += $(this).attr('value') + ".";
                });
                if (vIds.length > 0) {
                    vIds = vIds.substring(0, vIds.length - 1);
                }
               var len = $("input:checkbox:checked").length; 
               if(len<14){
                     $('#teshupai').val(vIds);
                    $('#yixuan').html(len);
                    $('#weixuan').html(13-len);
               }else{
                    alert('不能超过十三张');
                    return false;
               }
               
            });
        });   
 
</script>
<?php require_once('common-footer.php'); ?>
