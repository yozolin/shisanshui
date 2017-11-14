var objW = document.getElementById('lineChart').clientWidth;
var canvas = document.getElementById('canvas');
var canvasW = 0;
if(objW<=400){
	canvasW = objW;
}else{
 	canvasW = objW-80;
}
canvas.width= objW;
//console.log(objW);
$(function(){
    var time = [];
    var myDate = new Date();        //获取系统当前时间
    var Y = myDate.getFullYear()%100;   //获取完整的年份(4位,1970-????)
    var M = myDate.getMonth()+1;    //获取当前月份(0-11,0代表1月)
    var D = myDate.getDate();       //获取当前日(1-31)  3号
    //var now = Y+"-"+(M)+"-"+(D);
    days = lastMonth(Y,M-1);
    for(var i=1;i<=7; i++){
        if(D-i<=0){
            if(M-1 ==0){
                time.splice(0,0,Y+"/"+(12)+"/"+(days-i+D));
            }else{
                time.splice(0,0,Y+"/"+(M-1)+"/"+(days-i+D));
            }
        }else{
            time.splice(0,0,Y+"/"+M+"/"+(D-i));
        }
    }
    //console.log(days);
   	//console.log(time);
    var num = [];
    $.ajax({
        type:"post",
        url:"common_ajax.php",
        data:{time:time},
        success:function(result){
            num = eval(result);  //将json转化为数组
            // num = JSON.stringify(result);
            //console.log(num);
            /*---------------------找到最大值----------------------*/ 
            var max = num[0];
            var min = num[0]
            var len = num.length; 
            for (var i = 1; i < len; i++){ 
                if (num[i] > max) { 
                    max = num[i]; 
                } 
                if(num[i]<min){
                    min = num[i];
                }
            }
            /*---------------------找到最大值----------------------*/ 
            // if(!max){
            //     max = 1500;
            // }
            max = Math.ceil(max/10)*10;
            //console.log(min);
            //console.log(max);
            //var num=[200,600,400,700,250,500,190];
            //var num1=[30,45,30,50,60,40,62];
            //var week=['6-21','6-22','6-23','6-24','6-25','6-26','6-27'];
            var week=time;
            var canv=document.getElementById("canvas");
            var ctx=canv.getContext("2d");
            var col=["red","blue","green"]
            var j=0,j1=0,j2=0,jiao=0;
            var sun=0;
            var xnum=Math.floor(max/10);    //y轴
            //console.log(max);
            var ynum=300/10;
            for(var i=0; i<num.length;i++){
                sun=sun+num[i];
                //console.log(sun);
            }
            /*---------------------横线-----------------------*/ 
            for(var i=0; i<=10;i++){
                //ctx.lineWidth=0.5;
                ctx.beginPath();
                ctx.strokeStyle="#88c0f2";
                ctx.fillStyle="#188618";
                ctx.moveTo(canvasW/7,i*35+50) ;     //画线的起点
                ctx.lineTo(canvasW,i*35+50);  			//画线的终点
                //alert(i*35+50)
                ctx.stroke();
                ctx.fillText(max-i*xnum,20,i*35+50);
            	//console.log(max-i*xnum);
                //ctx.fillText(100-i*ynum,canv.width-50,i*35+50);
                ctx.fill();
            }
            /*---------------------横线-----------------------*/ 

            /* for(var i=1; i<=10;i++){
                ctx.fillStyle="#e04b39";
                ctx.fillText(300-i*ynum,canv.width-50,i*35+50);
                ctx.fill();
                }*/

            /*---------------------竖线-----------------------*/  
            for(var i=1; i<=7;i++){
                //ctx.lineWidth=0.5;
                ctx.beginPath();
                ctx.strokeStyle="#88c0f2";
                ctx.moveTo(Math.floor(i*canvasW/7),50);
                //console.log(Math.floor(i*canvasW/7));
                ctx.lineTo(Math.floor(i*canvasW/7),canv.height-100);
                //console.log(Math.floor(i*objW/7));
                ctx.stroke();
                ctx.fillStyle="#000";
                ctx.fillText(week[i-1],Math.floor(i*canvasW/7),canv.height-80);
                ctx.fill();
                }
            /*---------------------竖线-----------------------*/  

            /*---------------------折线-----------------------*/
            for(var i=0; i<10;i++){
                ctx.beginPath();
                ctx.strokeStyle="#188618";
                ctx.fillStyle="#188618";
                if(i==0){
                	var a = 80*xnum
                    ctx.moveTo(Math.floor(canvasW/7),400-Math.floor(num[i]/xnum*35));   
                    //console.log(Math.floor(objW/7),400-Math.floor(num[i]/xnum*35));
                }else{
                    ctx.moveTo(Math.floor(i*canvasW/7),400-Math.floor(num[i-1]/xnum*35))       
                }
                ctx.lineTo(Math.floor(canvasW/7)+Math.floor(i*canvasW/7),400-Math.floor(num[i]/xnum*35));
                //console.log(Math.floor(objW/7)+Math.floor(i*objW/7),400-Math.floor(num[i]/xnum*35));

                ctx.fillText(num[i],Math.floor(canvasW/7)+Math.floor(i*canvasW/7),400-Math.floor(num[i]/xnum*35));
                //console.log(num[i]);
                ctx.stroke();
            }
            /*---------------------折线-----------------------*/

            /* for(var i=0; i<10;i++){
                ctx.beginPath();
                ctx.strokeStyle="#e04b39";
                ctx.fillStyle="#e04b39";
                if(i==0){
                ctx.moveTo(100,400-num1[i]/30*35)   
                    }
                    else{
                    ctx.moveTo(i*100,400-num1[i-1]/30*35)       
                        }
                ctx.lineTo(100+i*100,400-num1[i]/30*35)
                ctx.fillText(num1[i],100+i*100,400-num1[i]/30*35);
                ctx.stroke();
                }
                */
            var col=['#188618','#e04b39']
            var ip=['代理销量','']
            for(var i=0; i<col.length;i++){
                ctx.font="20px 黑体"
                ctx.globalAlpha=0.9;
                ctx.fillStyle=col[i];
                ctx.fillRect(200*i+250,465,80,1);
                // ctx.rotate(Math.PI/6);
                ctx.fillText(ip[i],240*i+100,470);
                ctx.fill();
            }

        }
    });
    function lastMonth(Y,M){
        var days;   //定义当月的天数；
        if (M == 2) {//当月份为二月时，根据闰年还是非闰年判断天数
           days = Y % 4 == 0 ? 29 : 28;
        }
        else if(M == 1 || M == 3 || M == 5 || M == 7 || M == 8 || M == 10 || M == 0){ //获取上个月的天数，0表示12月份
           days = 31; //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
        }
        else {
           days = 30; //其他月份，天数为：30.
        }
        return days;
    } 
})



$(function(){
    var barChartBox=document.getElementById("barChart-box");
    var barChart=document.getElementById("barChart");
    var W_barChartBox = barChartBox.clientWidth;
    barChart.width = W_barChartBox;
    var ctx=barChart.getContext("2d");
    var bar = 1;
    var peopleNum =[];
    var cardNumber = [];
    $.ajax({
        type:"post",
        url:"common_ajax.php",
        data:{bar:bar},
        success:function(result){
            var result = eval(result);
            //console.log(result);
            for(var i=0;i<result.length; i++){
                peopleNum.push(result[i].username);
                cardNumber.push(result[i].cardNumber);
            }
            var num=cardNumber;  //房卡
            // console.log(cardNumber);
            // var max = num[0];
            // var min = num[0];
            // var len = num.length; 
            // for (var i = 0; i < len; i++){ 
            //     if (num[i] > max) { 
            //         max = num[i]+100; 
            //     } 
            //     if(num[i]<min){
            //         min = num[i];
            //     }
            // }
            var people=peopleNum;  //昵称
            //var num=[200,600,400,700,250,500,190];
            var num_max=1000;
            var a1=num_max/10;

            var num1=[30,45,30,50,60,40,62];
            var num1_max=200;
            var col=["#F00","#00f","#060"];
            var j=0,j1=0,j2=0,jiao=0;
            var sun=0;
            var xnum=num_max/10;
            var ynum=num1_max/10;

            for(var i=0; i<num.length;i++){
                sun=sun+num[i];
            }
            for(var i=1; i<=10;i++){
                //ctx.lineWidth=0.5;
                ctx.beginPath();
                ctx.moveTo(50,i*36+50)
                ctx.lineTo(W_barChartBox,i*36+50);
                //console.log(W_barChartBox);
                //alert(i*36+50)
                ctx.strokeStyle="#88c0f2";
                ctx.stroke();
                ctx.fillStyle="#188618";
                ctx.fillText(num_max-i*xnum,20,i*36+50);
                ctx.fill();
                }

            /*for(var i=1; i<=10;i++){
                ctx.fillStyle="#e04b39";
                ctx.fillText(num1_max-i*ynum,barChart.width-50,i*36+50);
                ctx.fill();
                }*/ 
            /*------------------------------竖线start------------------------------*/ 
            /* for(var i=1; i<=23;i++){
                 ctx.beginPath();
                 ctx.moveTo(i*30+20,50)
                 ctx.lineTo(i*30+20,canv.height-90)

                 ctx.strokeStyle="#88c0f2";
                 ctx.stroke();
                 ctx.fillStyle="#000";
                 ctx.fill();
                 }*/
            /*------------------------------竖线end------------------------------*/ 

            for(var i=0; i<people.length;i++){
                ctx.globalAlpha=0.9;
                ctx.fillStyle="#188618";
                if(i==0){
                    ctx.fillRect(80+i*30,410,30,-num[i]/a1*36);
                    ctx.fillText(num[i],80+i*60+i*30+3,410-num[i]/a1*36-10);
                    }else{
                    ctx.fillRect(80+i*60+i*30,410,30,-num[i]/a1*36);    
                    
                    ctx.fillText(num[i],80+i*60+i*30+3,410-num[i]/a1*36-10);
                        }
                
                }   

            /*-------------------------红色条形图start------------------------------*/
            /* for(var i=0; i<7;i++){
                 ctx.globalAlpha=0.9;
                 ctx.fillStyle="#e04b39";
                 if(i==0){
                     ctx.fillRect(110+i*30,410,30,-num1[i]/20*36);
                     ctx.fillText(num1[i],110+i*60+i*30+3,410-num1[i]/20*36-10);
                     }else{
                     ctx.fillRect(110+i*60+i*30,410,30,-num1[i]/20*36);  
                     ctx.fillText(num1[i],110+i*60+i*30+3,410-num1[i]/20*36-10);
                         }
                 }*/
            /*-------------------------红色条形图end------------------------------*/
                
            for(var i=1; i<=people.length;i++){
                ctx.fillStyle="#000";
                ctx.fillText(people[i-1],i*60+i*30+3,430);    
                ctx.fill();
                }
            var col=['#188618','#e04b39']
            var ip=['','']

            for(var i=0; i<col.length;i++){
                ctx.font="20px "
                ctx.globalAlpha=0.9;
                ctx.fillStyle=col[i];
                ctx.fillRect(200*i+250,445,60,20)
                ctx.fillText(ip[i],240*i+110,462)
                ctx.fill();
            }
         }
    });

})



