<?php
/**
 * 报名信息
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/1/15
 * Time: 10:33
 */

namespace app\index\controller;

use app\index\common\Base;
use app\index\model\Userinfo;
use think\Db;
use think\Session;
class Entryinfo extends Base
{
    //报名信息 列表页；
    public function entryInfoList()
    {
        return view();
    }
    //获取列表信息；
    public function getEntryinfoList()
    {
        $user_id = Session::get('index_login_status')['user_id'];
        if(!$user_id) {
            return json_encode(array('status'=>0, 'msg'=>'用户状态异常'));
        }
        $res = Db::name('userinfo') -> where(['user_id'=>$user_id]) -> select();
        if(empty($res)) {
            return json_encode(array('status'=>0, 'msg'=>'暂无查询数据'));
        }
        foreach($res as $k => $v){
            $domain = $this->request ->domain();
            $res[$k]['image'] = $domain.DS.$v['image'];
        }
        return json_encode(array('status'=>1, 'msg'=>'OK', 'data'=>$res));
    }


    //报名详情页面
    public function entryinfo()
    {
        return view();
    }
    //查看报名详情
    public function getEntryinfo()
    {
        $id = $this->request -> post('id');
        $userinfo = new Userinfo();

        $res = $userinfo -> where(['id'=>$id]) -> find();
        if(empty($res)){
            return json_encode(array('status'=>0,'msg'=> '网络繁忙，请稍后重试'));
        }

        $res = $res -> toArray();
        return json_encode(array('status'=>1,'msg'=> '','data'=>$res));
    }


    //分数查询页面；
    public function score()
    {
        return view();
    }
    //获取分数列表信息；
    public function getScore()
    {
        $user_id = Session::get('index_login_status')['user_id'];
        if(!$user_id) {
            return json_encode(array('status'=>0, 'msg'=>'用户状态异常'));
        }
        $res = Db::name('userinfo') -> where(['user_id'=>$user_id]) -> field('username,sex,idcar,examscore') -> select();
        if(empty($res)) {
            return json_encode(array('status'=>0, 'msg'=>'暂无查询数据'));
        }
        return json_encode(array('status'=>1, 'msg'=>'OK', 'data'=>$res));
    }


    //录取信息页面
    public function matriculate()
    {
        return view();
    }
    //获取录取信息；
    public function getMatriculate()
    {
        $user_id = Session::get('index_login_status')['user_id'];
        if(!$user_id) {
            return json_encode(array('status'=>0, 'msg'=>'用户状态异常'));
        }
        $res = Db::name('userinfo') -> where(['user_id'=>$user_id]) -> field('username,sex,idcar,examnum,examstatus,major,interviewstatus,examscore') -> select();
        if(empty($res)) {
            return json_encode(array('status'=>0, 'msg'=>'暂无查询数据'));
        }
        return json_encode(array('status'=>1, 'msg'=>'OK', 'data'=>$res));
    }
}