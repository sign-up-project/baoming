<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/1/8
 * Time: 16:12
 */

namespace app\index\controller;

use app\index\common\Base;
use think\Db;
use think\Session;
use think\Cookie;
use think\Loader;
class Entryform extends Base
{

    //条款页面
    public function article()
    {
        return view();
    }
    //报名表 页面
    public function entryform()
    {
        return view();
    }
    //获取地址选择列表
    public function getAddressList()
    {
        //获取省、市、区列表
        $addr = Db::name('region');
        $province = $addr->where(['level'=> '1'])->select();
        $city = $addr->where(['level'=> '2'])->select();
        $district = $addr->where(['level'=> '3'])->select();
        //获取科目信息；
        $subject = Db::name('subject') -> order('id') -> select();

        return(json_encode(array('province'=> $province,'city'=>$city,'district'=>$district, 'subject'=>$subject)));
    }
    //提交报名信息并存储；
    public function submit() {
//        // 获取表单上传文件 例如上传了001.jpg
//        $file = $this->request -> file('image');
//
//        // 移动到框架应用根目录/public/uploads/ 目录下
//        if($file){
//            $info = $file->move(ROOT_PATH . 'public' . DS . 'uploads');
//            if($info){
//                // 成功上传后 获取上传信息
//                $filename = $info->getSaveName();
//                $imgPath = 'uploads' . DS . $filename;
//            }else{
//                // 上传失败获取错误信息
//                return json_encode(array('status'=>0, 'msg'=>$file->getError()));
//            }
//        }else{
//            // 上传失败获取错误信息
//            return json_encode(array('status'=>0, 'msg'=>'未获取到上传的图片'));
//        }


        //获取用户id
        $userinfo = Session::get('index_login_status');
        $uid = $userinfo['user_id'] ? $userinfo['user_id'] : Cookie::get('cookie_login_id');
        if(!$uid) {
            return json_encode(array('status'=>0, 'msg'=>'用户状态异常'));
        }
        //获取post 数据；
        $data = $this->request -> post();

//        $data['image'] = $imgPath;//图片路径；

       
        $data['user_id'] = $uid;
        $data['ordernum'] = $this->createOrderNum($uid);
		$data['idcar_area'] = substr($data['idcar'], 0, 6);
        $data['addtime'] = time();

        $resId = Db::name('userinfo') -> insertGetId($data);
        if($resId <= 0){
            return json_encode(array('status'=>0, 'msg'=>'数据提交失败'));
        }

        return json_encode(array('status'=>1, 'msg'=>'信息提交成功','data'=>array('id'=> $resId)));
    }

    //生成订单号；
    public function createOrderNum($id = 01) {
        return date('YmdHis').substr($id.rand(10000,99999),0,7);
    }

//    图片上传 page
    public function uploadImg()
    {
        return view();
    }
//    图片上传方法
    public function uploadImgAction()
    {
        $id = $this->request -> post('id');
        if(!$id) {
            return json_encode(array('status'=>0, 'msg'=>'数据异常'));
        }
        // 获取表单上传文件 例如上传了001.jpg
        $file = $this->request -> file('image');

        // 移动到框架应用根目录/public/uploads/ 目录下
        if($file){
            $info = $file->move(ROOT_PATH . 'public' . DS . 'uploads');
            if($info){
                // 成功上传后 获取上传信息
                $filename = $info->getSaveName();
                $imgPath = DS . 'uploads' . DS . $filename;
            }else{
                // 上传失败获取错误信息
                return json_encode(array('status'=>0, 'msg'=>$file->getError()));
            }
        }else{
            // 上传失败获取错误信息
            return json_encode(array('status'=>0, 'msg'=>'未获取到上传的图片'));
        }

        $res = Db::name('userinfo') -> where(['id'=> $id]) -> update(['image'=>$imgPath]);
        if($res !== false) {
            return json_encode(array('status'=>1, 'msg'=>'图片上传成功'));
        }
        return json_encode(array('status'=>0, 'msg'=>'网络繁忙，请稍后重试'));
    }



}