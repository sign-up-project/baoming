<?php

namespace app\index\controller;

use think\Controller;
use think\Db;
use think\Loader;
use wxcf\WxPayConfig;
use wxtest\WxPayApi;
class Wxpay extends Controller
{


    function payinfo(){
        Loader::import('gyjt.example.WxPayJsApiPay',VENDOR_PATH);
        $tools = new \JsApiPay();
        $openId = $tools->GetOpenid();
//②、统一下单
        $input = new \WxPayUnifiedOrder();
        $input->SetBody("test");
        $input->SetAttach("test");
        $input->SetOut_trade_no(WxPayConfig::MCHID.date("YmdHis"));
        $input->SetTotal_fee("2");
        $input->SetTime_start(date("YmdHis"));
        $input->SetTime_expire(date("YmdHis", time() + 600));
        $input->SetGoods_tag("test");
//$input->SetNotify_url("http://paysdk.weixin.qq.com/example/notify.php");
        $input->SetNotify_url(dirname('http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']).'/notify.php');
        $input->SetTrade_type("JSAPI");
        $input->SetOpenid($openId);
        $order = WxPayApi::unifiedOrder($input);
        echo '<font color="#f00"><b>统一下单支付单信息</b></font><br/>';
        printf_info($order);
        $jsApiParameters = $tools->GetJsApiParameters($order);

//获取共享收货地址js函数参数
        $editAddress = $tools->GetEditAddressParameters();


    }
}