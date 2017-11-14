<?php
$config = array (	
		//应用ID,您的APPID。
		'app_id' => "2017081308177893",

		//商户私钥，您的原始格式RSA私钥
		'merchant_private_key' => "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCIqYPLzW2rnm50bpaaGcvrfoEfX1bGLlK8OtePKIElBeaUkh1BkwIwE7NmPw7G1MST0f0fcbDkNV2BHxvXPun6gd6JHXmHTAI0C5OCWtfCo9wGoun0Fl148exWY0Rj5BLYJs78F4j9QyLUDqlvBUBpWOSYEJ0W45agbjlm77ahKmSWMs5WbJEeHMz485U831DPO4+frgzgTspqWw+30F8ijUSL5uwd2yitpJlDGIPLnMK3D+AQFwMxyVsb4snORLUcSpkP5EpgadpgxRJ+I+5zLmAnkh7tVrIOLqRMDZSSxGgCfoPKoMD1H/fdpvjoabPaZShlFFcHOvi+LB7jDurTAgMBAAECggEAMZs+sQLPlWU7+N2Poz5L7B6OZkHoMKXt+E9voZJ1VmgO680h+4SOXb849ptbFMd016d4typAqIXKfC07oOVAb2Mm0SS20WrAvf2ZvM6W1Rs/qdUHEUfxBA7k1/LOh2fpgzaLGay9WBk/kjQEQr1oRRU0XRJiw0U3juKTyY6n/1XpQ2xloCNPWw6xrsJONyjqm64yY0q6MCUQ92ONFBbGDdh5BN2RUmfW0fRRYJ+90ooiSVlyKZ1h+9OZoyj0ElyTVuaHO4DJuOdxcxN0BLe6hayNB8SU6hm6IYUhb/czAzI4vyuwWiB2PkcCmp7RPywKkgtMGh+bZywic3+ivDjZqQKBgQC8rdK7btQ5TdPLgTCttRRVXpGkS+FwUWrydZs99/mOM9FYzTLggzrxeuICT+t7AyqY5ygadgvqiwOulfFrC3GVTn2fnqv6/Q+Bh+qTCBbgLfCOZWTjdYvcOBWtO4PUjk2lKwlE0LrU2qmlk1GEzzHxYKwKrcYGW3yKdoGWbQRMzwKBgQC5bGi28Z1R916d/xhka7nfzzmlZ/QydtB2GU9/tZMPxZEHI7aM+fKO+C9cbkMZ02mDXL22GBWVBGvYNLBZGOLszRTC7OCoNwlEjnY76+lFnIO/06g8srmVHYcuu01LH8uHPdCHPXheVk2MWfckoynb3wU6oIcFeTQAdE2QWcPqvQKBgHefBLHMjERgcVzeZUxcN64ALPorGZyqIdHiejAJnXBordtNDWqGCMK8k7m/jZ4J3eHe++/604c553WynsKtGK/+eWrPoF2aP1ByKWhagpZSyeadph8HkUpnTGbuCqCiL9v9svysESeOEmxlQBOhgRp1nd2PWrMBIa5vf60tJMLFAoGABHKZQGojP+gTGO8Zgq8i0j+CPnlz3hIDhhGtWn7cfDBc/jLZGiCUtOE3IZxzd5cenMwIsOl6+wwUGieJY1m5d7yjltlfuik3y7EvHNjXy5epgVxuWKZg1TbUG0ba38Zvd1sAOX47+OdRDODLkNFpG6EJ2xImqvbxTGF9ysycanECgYEAnBD4uwq660czh3tJtlgVnov3Q06q2LzMV+JR/Y6/4JOHZAdUpgUxuTJVpuccRL3TMKjQaxwxoYxQcmuQuarrYRisa9BoFmPqY4YBgFe+rEfAt+TtEehMJFPprAi5ZZlNDLDVLNL/efOW1eDEVKH6l/DwxkAHHtFmr1zrX86U+ZE=",
		
		//异步通知地址
		'notify_url' => "http://phpvideo.cn/new/admin/buy_card.php",
		
		//同步跳转
		'return_url' => "http://phpvideo.cn/new/admin/buy_card.php",

		//编码格式
		'charset' => "UTF-8",

		//签名方式
		'sign_type'=>"RSA2",

		//支付宝网关
		'gatewayUrl' => "https://openapi.alipay.com/gateway.do",

		//支付宝公钥,查看地址：https://openhome.alipay.com/platform/keyManage.htm 对应APPID下的支付宝公钥。
		'alipay_public_key' => "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiKmDy81tq55udG6WmhnL636BH19Wxi5SvDrXjyiBJQXmlJIdQZMCMBOzZj8OxtTEk9H9H3Gw5DVdgR8b1z7p+oHeiR15h0wCNAuTglrXwqPcBqLp9BZdePHsVmNEY+QS2CbO/BeI/UMi1A6pbwVAaVjkmBCdFuOWoG45Zu+2oSpkljLOVmyRHhzM+POVPN9QzzuPn64M4E7KalsPt9BfIo1Ei+bsHdsoraSZQxiDy5zCtw/gEBcDMclbG+LJzkS1HEqZD+RKYGnaYMUSfiPucy5gJ5Ie7VayDi6kTA2UksRoAn6DyqDA9R/33ab46Gmz2mUoZRRXBzr4viwe4w7q0wIDAQAB",
		
	
);