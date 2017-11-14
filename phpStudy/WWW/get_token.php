<?php
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-07-15 11:54:52
 * @version $Id$
 */
$code = isset($_POST['code']) ? $_POST['code'] : false;
// echo json_encode($_POST['code']);
// echo json_encode( $_POST );exit;
if($code){
    // 大众
    $appid = "wx1bf6bb2db2d1cd3f";  
    $appsecret = "b34e15e37d783ba857a212d89ef0fe82"; 

    
  	$url ="https://api.weixin.qq.com/sns/oauth2/access_token?appid=".$appid."&secret=".$appsecret."&code=".$code."&grant_type=authorization_code";
    $ch = curl_init();  
    curl_setopt($ch, CURLOPT_URL, $url);  
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);  
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);  
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);  
    $output = curl_exec($ch);  
    curl_close($ch);  
    $jsoninfo = json_decode($output, true); 
    if($jsoninfo){   
        $refresh_token = $jsoninfo["refresh_token"];    #获取 refresh_token
        $access_token = $jsoninfo["access_token"];      #获取 access_token 
        $openid = $jsoninfo["openid"];                  #获取 openid 

        $userinfo = getInfo( $access_token,$openid);
        echo json_encode( $userinfo );
    //exit;
    }
 }
// 根据Openid获取单个用户信息，如nickname  
function getInfo($access_token,$openid){  
    $url = "https://api.weixin.qq.com/sns/userinfo?access_token=$access_token&openid=$openid&lang=zh_CN ";
    $output = https_request($url);  
    $jsoninfo = json_decode($output);  
    return $jsoninfo;
    //echo $jsoninfo -> headimgurl;  
    //echo $jsoninfo ->nickname;  
    //echo "<br>";            
}     
   
function https_request($url){         
    $curl = curl_init();         
    curl_setopt($curl, CURLOPT_URL, $url);         
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);         
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);         
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);         
    $data = curl_exec($curl);         
    if (curl_errno($curl)) {return 'ERROR '.curl_error($curl);}         
    curl_close($curl);         
    return $data;  
}  

