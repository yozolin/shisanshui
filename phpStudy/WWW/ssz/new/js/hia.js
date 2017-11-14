/**
 * hia.js
 * @authors lindaxue (mrlindaxue@sina.com)
 * @date    2016-12-25 08:56:28
 */
var width = 219;
var leftValue = 0;
var obj = $('#product-adver');
var maxLen = $('#product-adver li').size() - 1;

$('#product-adver').width( (maxLen+1)*width );
// 向左
$('.products-picture .left a').click(function(){
	if(leftValue >= 0 ){
		leftValue = -maxLen*width;
	}else{
		leftValue += width;
	}
	console.log( leftValue );
	obj.stop().animate( { left:leftValue } );
	return false;
});

// 向右
$('.products-picture .right a').click(function(){
	if( leftValue <= -maxLen*width ){
		leftValue = 0;
	}else{
		leftValue -= width;
	}
	console.log( leftValue );
	obj.stop().animate( { left:leftValue } );
	return false;
});