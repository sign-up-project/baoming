<?php

namespace app\index\controller;

use think\Controller;
use think\Loader;
use think\Db;
use think\Session;
use app\index\model\Userinfo;
class Weixinpay extends Controller
{
	//构造函数
    public function _initialize(){
		//  header("Access-Control-Allow-Origin: *");
    	//php 判断http还是https
    	$this->http_type = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')) ? 'https://' : 'http://';
        
        Loader::import('payment.wxpayapi.wxpay');
	}


	//***************************
	//  微信支付 接口
	//***************************
	public function wxpay(){
		 
		//①、获取用户openid	
		$openId = Session::get('openId');
		if (!$openId) {
			return json(array('status'=>0,'err'=>'用户状态异常！'));
		}
		
		$order_id = input('id', 0, 'intval');
		if (!$order_id) {
			return json_encode(array('status'=>0,'err'=>'支付信息错误！'));
		}

		$order_info = Db::name('userinfo') -> where(['id'=>$order_id]) -> find();

		if (!$order_info) {
			return json_encode(array('status'=>0,'err'=>'没有找到支付订单！'));
			
		}

		if (intval($order_info['paystatus']) != 0) {
			return json_encode(array('status'=>0,'err'=>'订单状态异常！'));
			
		}

        
		//②、统一下单
		$input = new \WxPayUnifiedOrder();
		$input->SetBody("考试报名费");
		// $input->SetAttach("test");
		$input->SetOut_trade_no(trim($order_info['ordernum']));
		$input->SetTotal_fee($order_info['money']*100);
		$input->SetTime_start(date("YmdHis"));
		$input->SetTime_expire(date("YmdHis", time() + 600));
		$input->SetGoods_tag("报名费");
		$input->SetNotify_url("http://wx.xmyishu.cn/index.php/index/weixinpay/notify");
		$input->SetTrade_type("JSAPI");
		$input->SetOpenid($openId);
		$order = \WxPayApi::unifiedOrder($input);

		$arr = array();
		$arr['appId'] = $order['appid'];
		$arr['nonceStr'] = $order['nonce_str'];
		$arr['package'] = "prepay_id=".$order['prepay_id'];
		$arr['signType'] = "MD5";
		$arr['timeStamp'] = (string)time();
		$str = $this->ToUrlParams($arr);
		$jmstr = $str."&key=".\WxPayConfig::KEY;
		$arr['paySign'] = strtoupper(MD5($jmstr));

		return json($arr);
		
	}

	//***************************
	//  支付回调 接口
	//***************************
	public function notify(){
		
		$postStr = $GLOBALS['HTTP_RAW_POST_DATA']; // 这里拿到微信返回的数据结果
		file_put_contents("./wx.txt", $postStr, FILE_APPEND);

		$getData = $this->xmlstr_to_array($postStr);	//xml 转数组；
		if (($getData['total_fee']) && ($getData['result_code'] == 'SUCCESS')) {

			$order_num = trim($getData['out_trade_no']);

			$examnum = $this -> createExamNum($order_num);
			
			$res = Db::name('userinfo') -> where(['ordernum'=>$order_num]) -> update(['paystatus'=>1,'examnum'=>$examnum]);
			if($res === false){
					return false;
			}
			$return = '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>';
			ob_clean();
			echo $return;
			exit;
		}

		// // $res_xml = file_get_contents("php://input");
		
	}

	public function xmlstr_to_array($xmlstr)
	{
		libxml_disable_entity_loader(true);
		
		$xmlstring = simplexml_load_string($xmlstr, 'SimpleXMLElement', LIBXML_NOCDATA);
		
		$val = json_decode(json_encode($xmlstring),true);
		
		return $val;
	}
		
	/**
	 * 生成准考证号；
	 */
	private function createExamNum($ordernum)
	{
		//获取支付订单信息；
		$data = Db::name('userinfo') -> where(['ordernum'=>$ordernum]) -> field('id,idcar,idcar_area') -> find();
		if(empty($data)){
			return false;
		}
		// 查询当前 区域 的最大数；
		$maxArr = Db::name('userinfo') ->field('max(examnum) maxnum')
		->where(['idcar_area'=>$data['idcar_area']])
		->select();
		if(!$maxArr[0]['maxnum']){
			$maxArr[0]['maxnum'] = 0;
		}
		$maxNum = ++$maxArr[0]['maxnum'];

		return $maxNum;
	} 

	//构建字符串
	private function ToUrlParams($urlObj)
	{
		$buff = "";
		foreach ($urlObj as $k => $v)
		{
			if($k != "sign"){
				$buff .= $k . "=" . $v . "&";
			}
		}
		
		$buff = trim($buff, "&");
		return $buff;
	}

	
}
?>