
<?php 
/**
 * admin/common-footer.php
 * 公共的底部
 */

# 获取当前文件路径
$path = $_SERVER["SCRIPT_NAME"];
# 从当前文件路径中读取 完整的文件名
$filename = pathinfo($path , PATHINFO_BASENAME );
?>
<div class="webstie" >
    <div id="tgBigox">
        <div id="tgGoox" left="">
          <p><?php echo select_weibsite()?></p>
        </div>
    </div>
</div>
<script>
    var tgBigox = document.getElementById('tgBigox');
    var tgGoox = document.getElementById('tgGoox');
    var Gw = tgGoox.offsetWidth, Bw = tgBigox.offsetWidth;
    tgGoox.style.width = Gw+"px";
    tgGoox.style.right = -Gw + "px";
    var i = -Gw;
    var time = '';
    time = setInterval(start,10);
    function start(){
        var Sl = tgGoox.scrollLeft;
        i++;
        if( i > Gw+Bw){
            tgGoox.style.right = -Gw + "px";
            clearInterval(time);
            setTimeout(function(){
                i = -Gw;
                time = setInterval(start,10);
            },3000);
        }else{
            tgGoox.style.right = i + "px";
        }
    }
</script>
<!-- Mainly scripts -->
    <script src="statics/h5add/js/bootstrap.min.js" ></script>
    <script src="statics/h5add/js/plugins/metisMenu/jquery.metisMenu.js" ></script>
    <script src="statics/h5add/js/plugins/slimscroll/jquery.slimscroll.min.js" ></script>
    <!-- Flot -->
    <script src="statics/h5add/js/plugins/flot/jquery.flot.js" ></script>
    <script src="statics/h5add/js/plugins/flot/jquery.flot.tooltip.min.js" ></script>
    <script src="statics/h5add/js/plugins/flot/jquery.flot.spline.js" ></script>
    <script src="statics/h5add/js/plugins/flot/jquery.flot.resize.js" ></script>
    <script src="statics/h5add/js/plugins/flot/jquery.flot.pie.js" ></script>
    <!-- Peity -->
    <script src="statics/h5add/js/plugins/peity/jquery.peity.min.js" ></script>
    <script src="statics/h5add/js/demo/peity-demo.js" ></script>
    <!-- Custom and plugin javascript -->
    <script src="statics/h5add/js/hplus.js" ></script>
    <script src="statics/h5add/js/plugins/pace/pace.min.js" ></script>
    <!-- jQuery UI -->
    <script src="statics/h5add/js/plugins/jquery-ui/jquery-ui.min.js" ></script>
    <!-- GITTER -->
    <script src="statics/h5add/js/plugins/gritter/jquery.gritter.min.js" ></script>
    <!-- EayPIE -->
    <script src="statics/h5add/js/plugins/easypiechart/jquery.easypiechart.js" ></script>
    <!-- Sparkline -->
    <script src="statics/h5add/js/plugins/sparkline/jquery.sparkline.min.js" ></script>
    <!-- Sparkline demo data  -->
    <script src="statics/h5add/js/demo/sparkline-demo.js" ></script>
    <!-- 富文本编辑器 -->
    <script src="statics/ueditor/ueditor.config.js"></script>
    <script src="statics/ueditor/ueditor.all.min.js"> </script>
    <script src="statics/ueditor/lang/zh-cn/zh-cn.js"></script>
    <script>
        // 富文本编辑器
        if( $('#editor').size() >0 ){
            var ue = UE.getEditor('editor');
        }
        // 导航： 默认选中当前页面
        var filename = '<?php echo $filename;?>';
        var obj = $('.nav-child a[href="'+filename+'"]').children().addClass('select');

        function addCardResult(date){
            if(date){
                var noUserId = date.noUserId;               // 没有改ID用户
                var noEnonghCard = date.noEnonghCard;       // 房卡不足
                var noHasUse = date.noHasUse;               // 用户不归属该登录人
                var userId = date.userId;                   // 用户ID
                var time = date.time;                       // 时间

                var addCardResult = date.result;            // 充值房卡数据
                var userCardNum = date.userCardNum          // 用户充值前的房卡
                var result = addCardResult.result;          // 充值结果
                var cardNum = date.cardNum;                 // 充值数量

                //console.log(date);

                openNew("addCard");
                document.getElementById('time').innerHTML = time;
                var span = "<span id='userId'>"+userId+"</span>"
                if(result == 1){ //成功
                    var nowCardNum = addCardResult.nowCardNum      // 充值后的房卡
                    document.getElementById('userId').innerHTML = userId;
                    document.getElementById('cardNum').innerHTML = cardNum;
                    document.getElementById('userCardNum').innerHTML = userCardNum;
                    document.getElementById('now').innerHTML = nowCardNum;
                }else{
                    document.getElementById('result').innerHTML = '充值房卡失败';
                    document.getElementById('before').innerHTML = ' ';
                    document.getElementById('after').innerHTML = ' ';
                }
                if(noUserId){
                    document.getElementById('result').innerHTML = '没有ID为'+span+'的用户';
                    document.getElementById('before').innerHTML = ' ';
                    document.getElementById('after').innerHTML = ' ';
                }
                if(noHasUse){
                    document.getElementById('result').innerHTML = '该用户'+span+'不归属您的名下';
                    document.getElementById('before').innerHTML = ' ';
                    document.getElementById('after').innerHTML = ' ';
                }
                if(noEnonghCard){
                    document.getElementById('result').innerHTML = '您的房卡不足，请及时充值';
                    document.getElementById('before').innerHTML = ' ';
                    document.getElementById('after').innerHTML = ' ';
                }
            }
        }
        function openNew(info){
            //获取页面的高度和宽度
            var sWidth=document.body.scrollWidth;
            var sHeight=document.body.scrollHeight;
            //获取页面的可视区域高度和宽度
            var wHeight=document.documentElement.clientHeight;
            var msg=document.createElement("div");
                msg.id="msg";
                msg.style.height=sHeight+"px";
                msg.style.width=sWidth+"px";
                document.body.appendChild(msg);
            var msgInfo=document.createElement("div");
                msgInfo.id="msg-info";
                msgInfo.innerHTML= innerContent(info);

                document.body.appendChild(msgInfo);
            //获取登陆框的宽和高
            var dHeight=msgInfo.offsetHeight;
            var dWidth=msgInfo.offsetWidth;
                //设置登陆框的left和top
                msgInfo.style.left=sWidth/2-dWidth/2+"px";
                msgInfo.style.top=wHeight/2-dHeight/2+"px";
            //点击关闭按钮
            var msgbtn=document.getElementById("msgbtn");
            //点击登陆框以外的区域也可以关闭登陆框
            msgbtn.onclick=msg.onclick=function(){
                document.body.removeChild(msgInfo);
                document.body.removeChild(msg);
                switch(info){
                    case "addCard":
                        window.location.href = "user_lists.php";
                        break;
                    case "checkCode":
                        window.location.href = "login.php";
                        break;
                }
            };
        };

        function innerContent(info){
            var addCard = "<h1 id='time'></h1><h2 id='result'>成功给<span id='userId'></span>充值房卡<span id='cardNum'></span>张</h2><h2 id='before'>原有房卡<span id='userCardNum'></span>张</h2><h2 id='after'>现有<span id='now'></span>张</h2><p><span class=\"btn btn-info\" id=\"msgbtn\">确定</span></p>";
            var checkCode ="<h1 id='time'></h1><h2 id='result'></h2><h2 id='before'></h2><p><span class=\"btn btn-info\" id=\"msgbtn\">确定</span></p>";
            switch(info){
                case "addCard":
                    innerContent = addCard;
                    break;
                case "checkCode":
                    innerContent = checkCode;
                    break;
            }
            return innerContent;
        }

        $.ajax({
            type:"post",
            url:"common_ajax.php",
            data:{checkCode:1},
            success:function(data){
                //var data = eval(data);
                var data = JSON.parse(data);
                //console.log(data.result);
                if(data.result){
                    openNew("checkCode");
                    var ipAddress = data.ipAddress;
                    console.log(data);
                    document.getElementById('time').innerHTML = data.lastLoginTime;
                    document.getElementById('result').innerHTML ="您的账号在其他地方登录，如有密码遗漏，请及时修改密码！";
                    document.getElementById('before').innerHTML = "登录地址："+ipAddress;

                    //window.location.href = "login.php";
                }
            }
        });
    </script>
    
</body>
</html>