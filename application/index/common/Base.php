<?php

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/1/10
 * Time: 13:53
 */
namespace app\index\common;

use think\Controller;
use think\Request;
use think\Cookie;

class base extends Controller
{
    public $request;

    public function __construct ()
    {
        parent::__construct();
        $this -> request = Request::instance();
    }
    public function _initialize()
    {
        //判断登录状态；
        if(!Cookie::has('cookie_login_id') && !Cookie::get('cookie_login_id')){
            echo "<script>alert('您还未登录，请重新登录！');location.href='/index.php/index/login/login'</script>";
        }
    }
}