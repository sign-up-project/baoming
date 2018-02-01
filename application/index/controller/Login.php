<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/1/11
 * Time: 17:39
 */

namespace app\index\controller;

use think\Controller;
use think\Db;
use think\Session;
use think\Cookie;
class Login extends Controller
{


    // 用户登录页面
    public function login()
    {
        return view();
    }
    //检验用户登录
    public function checkLogin()
    {
        $where = $this->request -> post();

        $res = Db::name('user') ->where($where)-> find();

        if(!empty($res)){
            $session['user_id'] = $res['id'];
            Session::set('index_login_status',$session);
            
            Cookie::set('cookie_login_id', $res['id'], 7200);
            return json_encode(array('status'=>1,'msg'=>'登录成功！'));
        }else{
            return json_encode(array('status'=>0,'msg'=>'账号或密码错误！'));
        }
    }

    //用户注册 页面；
    public function register()
    {
        return view();
    }
    //检验注册时账户是否已存在
    public function checkRepeat()
    {
        $flag = $this->request -> post('flag');
        if($flag == 1){
            $account = $this->request -> post('account');
            $res1 = Db::name('user') ->where(['account'=>$account]) -> select();
            if(count($res1) > 0){
                return json_encode(array('status'=>0,'msg'=>'用户名已被注册！请重新输入'));
            }
        }elseif($flag == 2){
            $phone = $this->request -> post('phone');
            $res2 = Db::name('user') ->where(['phone'=>$phone]) -> select();
            if(count($res2) > 0){
                return json_encode(array('status'=>0,'msg'=>'手机号已被注册！请重新输入'));
            }
        }
        return json_encode(array('status'=>1,'msg'=>'OK'));
    }
    // 注册；
    public function regAdd()
    {
        $data = $this->request -> post();
//        检验账号是否重复
        $account = $data['account'];
        $res1 = Db::name('user') ->where(['account'=>$account]) -> select();
        if(count($res1) > 0){
            return json_encode(array('status'=>0,'msg'=>'用户名已被注册！请重新输入'));
        }
        //检验手机号是否重复；
        $phone = $data['phone'];
        if($phone){
            $res2 = Db::name('user') ->where(['phone'=>$phone]) -> select();
            if(count($res2) > 0){
                return json_encode(array('status'=>0,'msg'=>'手机号已被注册！请重新输入'));
            }
        }


        $res = Db::name('user') ->insert($data);
        if(!$res){
            return json_encode(array('status'=>0,'msg'=>'注册失败！请稍后重试'));
        }
        return json_encode(array('status'=>1,'msg'=>'注册成功！'));
    }
    //密码重置 页面；
    public function pwdReset()
    {
        return view();
    }
    //检验修改密码账户是否存在；
    public function checkAccount()
    {
        $val = input('post.value');
        $where['account|phone'] = $val;
        $res = Db::name('user') -> where($where) -> select();
        if(count($res) == 0){
            return json_encode(array('status'=>0, 'msg'=>'账号或手机号不存在，请重新输入'));
        } elseif(count($res) > 1) {
            return json_encode(array('status'=>-1, 'msg'=>'账号或手机号不唯一！不能修改'));
        }
        return json_encode(array('status'=>1, 'msg'=>'OK'));
    }
    //修改密码
    public function subResetPwd()
    {
        $val = $this->request -> post('value');//要修改密码 的账户；
        $pwd = $this->request -> post('password');
        $where['account|phone'] = $val;
        $res = Db::name('user') -> where($where) -> update(['password'=>$pwd]);

        if($res !== false){
            return json_encode(array('status'=>1, 'msg'=> '修改成功'));
        }
        return json_encode(array('status'=>0, 'msg'=> '修改失败，请稍后重试！'));
    }



    /**
	* 获取用户的openid
	*/
	public function getOpenid(){
		
        //获取code码，以获取openid
        $code = $this->request -> post('code');
        //2.获取到网页授权的access_token
        $appid = 'wxecfabad8973495ca';//这里的appid是假的演示用
        $appsecret = '165fb1f5bcdb4ae7b231f9f9670186b5';//这里的appsecret是假的演示用
        $url="https://api.weixin.qq.com/sns/oauth2/access_token?appid=".$appid."&secret=".$appsecret."&code=".$code."&grant_type=authorization_code";
        //3. 读取链接上 网页内容；
        $res = file_get_contents($url);
        $data = json_decode($res);

        $openId = $data -> openid;//获取用户的openid
        if($openId){
            Session::set('openId',$openId);
            return json_encode(array('status'=>1, 'data'=>$openId,'msg'=>'OK'));
        }
        return json_encode(array('status'=>0, 'data'=>'','msg'=>'服务器异常，请联系管理员'));
        
    }

    /**
	* 检验用户的openid
	*/
	public function checkOpenid(){
		
        if(Session::has('openId') && Session::get('openId')){
            return 1;
        }
        return 0;
        
    }


}