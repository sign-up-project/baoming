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
use think\Cookie;
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
        $user = Session::get('index_login_status');
        $user_id = $user['user_id'];
        $user_id = $user_id ? $user_id : Cookie::get('cookie_login_id');
        if(!$user_id) {
            return json_encode(array('status'=>0, 'msg'=>'用户状态异常'));
        }
        $res = Db::name('userinfo') 
        -> where(['user_id'=>$user_id,'paystatus'=>1])
        -> select();
        if(empty($res)) {
            return json_encode(array('status'=>0, 'msg'=>'暂无查询数据'));
        }
        foreach($res as $k => $v){
            $domain = $this->request ->domain();
            $res[$k]['image'] = $domain.$v['image'];
        }
        // dump(Session::get('index_login_status'));
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
        $id = input('id', 0, 'intval');
        if(!$id){
            return json_encode(array('status'=>0,'msg'=> '网络异常，请联系管理员'));
        }
        $userinfo = new Userinfo();
        $res = $userinfo
        -> alias('u')
        -> join('subject s','u.major = s.id')
        -> join('subject m','u.major2 = m.id')
        -> where(['u.id'=>$id])
        -> field('u.*, s.subject, s.submoney,m.subject subject2')
        -> find();
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
        $user_id = $user_id ? $user_id : Cookie::get('cookie_login_id');
        if(!$user_id) {
            return json_encode(array('status'=>0, 'msg'=>'用户状态异常'));
        }

        // 查询分数线
        $throughLine = Db::name('through-line') -> find();
        $throughLine = $throughLine['through'];//

        $userinfo = new Userinfo();
        $res = $userinfo 
        -> where(['user_id'=>$user_id,'paystatus'=>1])
        -> where('examstatus', 'EGT', 1)
        -> field('username,sex,idcar,examscore') 
        -> select();
        if(empty($res)) {
            return json_encode(array('status'=>0, 'msg'=>'暂无查询数据'));
        }
        foreach ($res as $key => $value) {
             //考试是否通过状态；
            if($value['examscore'] >= $throughLine) {
                $res[$key]['status'] = 1;
            }else{
                $res[$key]['status'] = 0;
            }
        }
       
        // $res = $res -> toArray();
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
        $user_id = $user_id ? $user_id : Cookie::get('cookie_login_id');
        if(!$user_id) {
            return json_encode(array('status'=>0, 'msg'=>'用户状态异常'));
        }
        // 查询分数线
        $throughLine = Db::name('through-line') -> find();
        $throughLine = $throughLine['through'];//

        $userinfo = new Userinfo();
        $res = $userinfo 
        -> alias('u')
        -> join('subject s','u.major = s.id')
        -> where(['u.user_id'=>$user_id,'u.paystatus'=>1])
        -> where('u.examscore', 'EGT', $throughLine)
        -> field('u.username,u.sex,u.idcar,u.examnum,u.examstatus,major,u.interviewstatus,u.examscore,s.subject') 
        -> select();
        if(empty($res)) {
            return json_encode(array('status'=>0, 'msg'=>'暂无查询数据'));
        }
        
        // $res = $res -> toArray();
        return json_encode(array('status'=>1, 'msg'=>'OK', 'data'=>$res));
    }

}