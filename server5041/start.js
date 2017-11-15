var db = require('base/dbmanager');
var schedule  = require('node-schedule');

var WebSocketServer = require('ws').Server,
ws = new WebSocketServer({
    port: 5041, //监听接口
    verifyClient: socketVerify //可选，验证连接函数
});

//验证函数
function socketVerify(info) {
    return true;
}

//广播
ws.broadcast = function broadcast(s,ws) {

};

function clearRoom(){
    var sql = "UPDATE rooms SET status = 0,setting1 = 0,setting2 = 0,setting3 = 0,setting4 = 0,setting5 = 0,createUserId = 0,updateAt = 0,type = 0 WHERE status = 1";
    db.query(sql,function (error) {
        if (error) {
            console.log("UPDATE ERROR - ",error.message);
        }
        console.log(" --------------- 清房 ---------------");
    });
}
clearRoom();

var rule = new schedule.RecurrenceRule();
rule.hour = 1;
var time = 1; //时间
schedule.scheduleJob(rule, function(){
    var sql ="DELETE FROM big_records WHERE UNIX_TIMESTAMP(createAt)<UNIX_TIMESTAMP( DATE_SUB( CURDATE(),INTERVAL "+time+" WEEK))";
    db.query(sql,function(error){
        if (error) {
            console.log('[SELECT ERROR] -',error.message);
            return;
        }
　　  console.log("执行删除大局数据程序");
    })
	
	var sql_re ="DELETE FROM records WHERE UNIX_TIMESTAMP(creatAt)<UNIX_TIMESTAMP( DATE_SUB( CURDATE(),INTERVAL "+time+" WEEK))";
	db.query( sql_re,function(error){
        if (error) {
            console.log('[SELECT ERROR] -',error.message);
            return;
        }
　　  console.log("执行删除小局数据程序");
    })
});

schedule.scheduleJob(rule,function(){
    var sql = "update users set hasChange = 0";
    db.query(sql,function(error){
        if (error) {
            console.log('[SELECT ERROR] -',error.message);
            return;
        }
        console.log("半夜凌晨0点，可以更新信息啦！");
    })
});

var SSGDeskManager = require('ssg-desk-manager');
var manager = new SSGDeskManager();
// 初始化
ws.on('connection', function(ws) {
    /*ws.send(JSON.stringify({'action':'checkVersion',
                            'data':{'version':'v1.0.0','iosUrl':'http://www.baidu.com','androidUrl':'http://www.baidu.com'}}));*/
    var sql = "SELECT info1 FROM hall";
    db.query(sql,null,function (error,result) {
        if (error) {
            console.log('[SELECT ERROR] -',error.message);
        }
        //处理
        if (result.length > 0) {
            var data = result[0];
            // console.log(data.info1);
            try{
                ws.send(JSON.stringify({'action':'checkVersion',
                            'data':{'version':data.info1}}));
            }catch(e){
                console.log(e);
            }

           
        }
    });
    console.log(ws._socket.remoteAddress);
    // 发送消息
    // user
    ws.on('message', function(jsonStr,flags) {
        //console.log("收到消息："+JSON.parse(jsonStr).action);
        manager.processAction(JSON.parse(jsonStr),ws);
    });
    // 退出
    ws.on('close', function(close) {
        manager.networkErrorAction({},ws);
    });
    //发生错误
    ws.on('error', function(exception) {
        manager.networkErrorAction({},ws);
    });
});

console.log('server start');
