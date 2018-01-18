<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/1/17
 * Time: 10:09
 */
namespace app\index\model;

use think\Model;

class Userinfo extends Model
{
    //获取性别；
    public function getSexAttr($v)
    {
        switch ($v)
        {
            case 1:
                return '男';
            break;
            case 2:
                return '女';
            break;
            default:
                return '未知';
            break;
        }
    }
    //获取图片；
    public function getImageAttr($v)
    {
        return $v ? (request() -> domain() . $v) : '' ;
    }
    //获取身份证号；
    public function getIdcarAttr($v)
    {
        return substr($v, 0, 6) . '***' .substr($v, -4);
    }
    //获取报名时间；
    public function getAddtimeAttr($v)
    {
        return date('Y-m-d H:i:s', $v);
    }
//    //获取报名 状态；
//    public function getPaystatusAttr($v)
//    {
//        return date('Y-m-d H:i:s', $v);
//    }
    //考试状态；
    public function getExamstatusAttr($v)
    {
        return $v == 1 ? '已考' : '待考';
    }

}