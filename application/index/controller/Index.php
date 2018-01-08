<?php
namespace app\index\controller;

use think\Controller;
use think\Db;
use think\Request;

class Index extendS Controller
{
    protected $request;

    public function __construct ()
    {
      $this -> request = Request::instance();
    }


    public function index()
    {
        return view();
    }

    // 用户登录页面
    public function login()
    {
        return view();
    }
    //检验用户登录
    public function checkLogin()
    {
        $where = $this->request -> post();

        // $res = Db::name('user') ->where($where)-> select();
        //
        // if(!empty($res)){
        //   return 1;
        // }else{
        //   return 0;
        // }
        return json_encode(array('status'=>1,'msg'=>'登录成功！'));
    }

    //用户注册；
    public function register()
    {
        return view();
    }
}
