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
            $arr = array();
            $arr['status'] = true;
            $arr['user_id'] = $res['id'];

            Session::set('index_login_status',$arr);

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
    public function checkRepeat() {
        $data = $this->request -> post('account');
        $res = Db::name('user') ->where(['account'=>$data]) -> select();
        if(count($res) > 0){
            return 0;
        }
        return 1;
    }
    // 注册方法；
    public function regAdd() {
        if(!$this->checkRepeat()){
            return json_encode(array('status'=>0,'msg'=>'用户名已被注册！请重新输入'));
        }
        $data = $this->request -> post();
        $res = Db::name('user') ->insert($data);
        if(!$res){
            return json_encode(array('status'=>0,'msg'=>'注册失败！'));
        }
        return json_encode(array('status'=>1,'msg'=>'注册成功！'));
    }
}