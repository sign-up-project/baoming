<?php
namespace app\index\controller;

use app\index\common\Base;
use think\Db;
use think\Session;
use think\Cookie;
class Index extendS Base
{
    //首页(用户个人中心)
    public function index()
    {
        return view();
    }
    //个人中心用户数据；
    public function getUserinfo()
    {
        // $uid = Cookie::get('cookie_login_id');

        $login_info = Session::get('index_login_status');
        $uid = $login_info['user_id'] ? $login_info['user_id'] : Cookie::get('cookie_login_id');
        if(!$uid) {
            return json_encode(array('status'=>0, 'msg'=>'用户状态异常'));
        }
        $res = Db::name('user') -> where(['id'=>$uid]) -> find();
        if(empty($res)){
            return json_encode(array('status'=>0 ,'msg'=>'网络繁忙'));
        }
        return json_encode(array('status'=>1,'data'=>$res,'msg'=>''));
    }
    //退出登录
    public function loginOut() {

        Cookie::delete('cookie_login_id');
        if(Cookie::has('cookie_login_id')){
            return json_encode(array('status'=>0,'msg'=>'退出登录失败'));
        }
        Session::clear();
        return json_encode(array('status'=>1,'msg'=>'退出登录成功'));
    }

}
