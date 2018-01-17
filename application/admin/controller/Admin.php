<?php
namespace app\admin\controller;

use think\Controller;
use think\Db;
use think\Session;
use think\Loader;

class Admin extends controller
{

    public function register(){
        Session::clear();
        return $this->fetch();
    }
    public function checkres(){
        $username=$_POST['user'];
        $password=$_POST['pass'];
        $user=Db::name('admin')->where("username = '$username'")->find();
        if(!empty($user)){
           if($user['password'] == $password){
               Session::set('status','success');
               $this->success('登录成功','admin/index');
           }else{
               $this->error('密码错误，登录失败','admin/register');
           }
        }else{
            $this->error('账号错误，登录失败','admin/register');
        }
    }
    //修改密码，包含updatepaw和repwd两个方法
    public function updatepaw(){
        $ses=Session::has('status');
        if($ses){
            return $this->fetch();
        }else{
            $this->error('请通过登录方式进入后台','admin/register');
        }
    }
    public function repwd(){
        $user=$_POST['user'];
        $oldpwd=$_POST['oldpwd'];
        $newpwd=$_POST['newpwd'];
        $result=Db::name('admin')->where("username = '$user' and password = '$oldpwd'")->find();
        $id=$result['id'];
        if(!empty($result)){
            $ques=Db::name('admin')->where('id='.$id)->update(['password' => "$newpwd"]);
            if($ques){
                $this->success('修改管理员密码成功','admin/index');
            }else{
                $this->error('出现未知错误请联系开发人员','admin/updatepaw');
            }
        }else{
            $this->error('原始账号或密码不正确','admin/updatepaw');
        }
    }
   //设置分数线，包含setting和changeset两个方法
    public function setting(){
        $ses=Session::has('status');
        if($ses){
            $result=Db::name('through-line')->find();
            $this->assign('fs',$result['through']);
            return $this->fetch();
        }else{
            $this->error('请通过登录方式进入后台','admin/register');
        }

    }
    public function changeset(){
        $fs=$_POST['fs'];
        $res=Db::name('through-line')->where('id=1')->update(['through'=>"$fs"]);
        if($res){
            $this->success('设置成功','admin/index');
        }else{
            $this->error('设置失败','admin/setting');
        }
    }
    function dizhi()
    {
        $p=$_POST['area'];
        Session::set('area',$p);
        Header("Location: index");
    }
    public function index(){
        $ses=Session::has('status');
        if($ses){
            $p=Session::get('area');
            if($p) {
                $res = Db::name('user')
                    ->alias('u')
                    ->join('userinfo i', 'u.id = i.user_id')
                    ->join('subject s','i.major = s.id')
                    ->field('i.id,i.image,i.school,i.interviewstatus,i.username,i.examnum,i.sex,i.idcar,s.subject,i.province,i.city,i.district,i.address,i.brtel,i.telone,i.teltwo,i.examscore,i.examtime,i.examaddress,i.examaddnum')
                    ->where("district='$p' AND paystatus ='已支付'")
                    ->paginate(6);
                $fs=Db::name('through-line')->find();
                $this->assign('user', $res);
                $this->assign('fs',$fs);
            }else{
                $res = Db::name('user')
                    ->alias('u')
                    ->join('userinfo i', 'u.id = i.user_id')
                    ->join('subject s','i.major = s.id')
                    ->field('i.id,i.image,i.school,i.interviewstatus,i.username,i.examnum,i.sex,i.idcar,s.subject,i.province,i.city,i.district,i.address,i.brtel,i.telone,i.teltwo,i.examscore,i.examtime,i.examaddress,i.examaddnum')
                    ->where("paystatus ='已支付'")
                    ->paginate(6);
                $fs=Db::name('through-line')->find();
                $this->assign('user', $res);
                $this->assign('fs',$fs);
            }
            return $this->fetch();
        }else{
           $this->error('请通过登录方式进入后台','admin/register');
        }
    }
    //index页面成绩框失去焦点事件
    public function updascore(){
        $id=input('post.id');
        $value=input('post.value');
        $up=Db::name('userinfo')->where("id=$id")->update(['examscore'=>$value]);
        if($up){
            echo 1;
        }
    }
//,'examtime'=>$time,'examaddress'=>$add,'examaddnum'=>$addnum
    public function updatime(){
        $id=input('post.id');
        $value=input('post.value');
        $up=Db::name('userinfo')->where("id=$id")->update(['examtime'=>$value]);
        if($up){
            echo 1;
        }
    }
    public function updaadd(){
        $id=input('post.id');
        $value=input('post.value');
        $up=Db::name('userinfo')->where("id=$id")->update(['examaddress'=>$value]);
        if($up){
            echo 1;
        }
    }
    public function updanum(){
        $id=input('post.id');
        $value=input('post.value');
        $up=Db::name('userinfo')->where("id=$id")->update(['examaddnum'=>$value]);
        if($up){
            echo 1;
        }
    }
    public function updainter(){
        $val=input('post.id');
        $a=explode(',',$val);
        $id=$a[0];
        $inter=$a[1];
        Db::name('userinfo')->where("id=$id")->update(['interviewstatus'=>$inter]);
        if($inter == 1){
            echo 1;
        }elseif($inter == 2){
            echo 2;
        }else{
            echo 3;
        }
    }
    //清除地址搜索数据
    public function clear(){
        Session::delete('area');
        Header("Location: index");
    }
    //打印excel
    public function dayin(){
        $p=Session::get('area');
        if($p){
            $list=Db::query("SELECT username,CASE sex
				 WHEN '0' THEN '女'
                 WHEN '1' THEN '男' END newsex,idcar,school,address,brtel,telone,teltwo,CASE major
                 WHEN '1' THEN '高中-美术'
                 WHEN '2' THEN '高中-音乐舞蹈'
				 WHEN '3' THEN '高中-播音主持'
                 WHEN '4' THEN '教育-美术'
				 WHEN '5' THEN '教育-音乐舞蹈'
                 WHEN '6' THEN '教育-播音主持'
				 WHEN '7' THEN '教育-休闲体育' END newmajor,examnum,examtime,examaddress,examaddnum from userinfo
                 where district='$p' AND where paystatus='已支付'");
        }else{
            $list=Db::query("SELECT username,CASE sex
				 WHEN '0' THEN '女'
                 WHEN '1' THEN '男' END newsex,idcar,image,school,address,brtel,telone,teltwo,CASE major
                 WHEN '1' THEN '高中-美术'
                 WHEN '2' THEN '高中-音乐舞蹈'
				 WHEN '3' THEN '高中-播音主持'
                 WHEN '4' THEN '教育-美术'
				 WHEN '5' THEN '教育-音乐舞蹈'
                 WHEN '6' THEN '教育-播音主持'
				 WHEN '7' THEN '教育-休闲体育' END newmajor,examnum,examtime,examaddress,examaddnum  from userinfo where paystatus='已支付'");
        }
        $excel2007=false;
        $indexKey=array('username','newsex','idcar','school','address','brtel','telone','teltwo','newmajor','examnum','examtime','examaddress','examaddnum');
        if(empty($filename)) $filename = $p.date("Y-m-d",time());//time();
        if( !is_array($indexKey)) return false;

        $header_arr = array('A','B','C','D','E','F','G','H','I','J','K','L','M', 'N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
        //初始化PHPExcel()
        Loader::import('classes\PHPExcel',EXTEND_PATH);
        $objPHPExcel = new \PHPExcel();
        //设置保存版本格式
        if($excel2007){
            Loader::import('classes\PHPExcel\Writer\PHPExcel_Writer_Excel2007',EXTEND_PATH);
            $objWriter = new \PHPExcel_Writer_Excel2007($objPHPExcel);
            $filename = $filename.'.xlsx';
        }else{
            Loader::import('classes\PHPExcel\Writer\PHPExcel_Writer_Excel5',EXTEND_PATH);
            $objWriter = new \PHPExcel_Writer_Excel5($objPHPExcel);
            $filename = $filename.'.xls';
        }
//        //图片下载类
//        Loader::import('classes\PHPExcel\Worksheet\PHPExcel_Worksheet_Drawing',EXTEND_PATH);
//        $objDrawing = new \PHPExcel_Worksheet_Drawing();
//
//        /*填充表格内容*/
//        $tableheader = array('姓名','性别','身份证号','就读学校','头像','家庭地址','本人电话','家长电话（1）','家长电话（2）','报考专业','准考证号','考试时间','考点名称','考场编号');
//        $letter = array('A','B','C','D','E','F','G','H','I','J','K','L','M','N');
//        for($i = 0;$i < count($tableheader);$i++) {
//            $objPHPExcel->getActiveSheet()->setCellValue("$letter[$i]1","$tableheader[$i]");
//        }
//
//        $objActSheet = $objPHPExcel->getActiveSheet();
//        for ($i = 0;$i < count($list);$i++) {
//            $j = $i + 2;
//            /*设置表格宽度*/
//            $objActSheet->getColumnDimension("$header_arr[$i]")->setWidth(20);
//            /*设置表格高度*/
//            $objPHPExcel->getActiveSheet()->getRowDimension($j)->setRowHeight(100);
//            /*向每行单元格插入数据*/
//            for ($row = 0;$row < count($list[$i]);$row++) {
//                if ($row == (count($list[$i]) -7 )) {
//                    /*实例化插入图片类*/
//                    /*设置图片路径 切记：只能是本地图片*/
//                    $objDrawing->setPath($list[$i]['image']);
//                    /*设置图片高度*/
//                    $objDrawing->setHeight(100);
//                    /*设置图片要插入的单元格*/
//                    $objDrawing->setCoordinates("$header_arr[$row]$j");
//                    /*设置图片所在单元格的格式*/
//                    $objDrawing->setOffsetX(80);
//                    $objDrawing->setRotation(20);
//                    $objDrawing->getShadow()->setVisible(true);
//                    $objDrawing->getShadow()->setDirection(50);
//                    $objDrawing->setWorksheet($objPHPExcel->getActiveSheet());
//                    continue;
//                }
//
//                $objPHPExcel->getActiveSheet()->setCellValue("$header_arr[$row]$j",$list[$i]['username']);
//            }
//        }
        //接下来就是写数据到表格里面去
        $objActSheet = $objPHPExcel->getActiveSheet();
//        array('姓名','性别','身份证号','就读学校','家庭地址','本人电话','家长电话（1）','家长电话（2）','报考专业','准考证号','考试时间','考点名称','考场编号');
        $objActSheet->setCellValue('A1',"考生姓名");
        $objActSheet->setCellValue('B1',"性别");
        $objActSheet->setCellValue('C1',"身份证号");
        $objActSheet->setCellValue('D1',"就读学校");
        $objActSheet->setCellValue('E1',"家庭地址");
        $objActSheet->setCellValue('F1',"本人电话");
        $objActSheet->setCellValue('G1',"家长电话（1）");
        $objActSheet->setCellValue('H1',"家长电话（2）");
        $objActSheet->setCellValue('I1',"报考专业");
        $objActSheet->setCellValue('J1',"准考证号");
        $objActSheet->setCellValue('K1',"考试时间");
        $objActSheet->setCellValue('L1',"考点名称");
        $objActSheet->setCellValue('M1',"考场编号");
        $startRow = 2;
        foreach ($list as $row) {
            foreach ($indexKey as $key => $value){
                //这里是设置单元格的内容
                $objActSheet->setCellValue($header_arr[$key].$startRow,$row[$value]);
            }
            $startRow++;
        }

        // 下载这个表格，在浏览器输出
        header("Pragma: public");
        header("Expires: 0");
        header("Cache-Control:must-revalidate, post-check=0, pre-check=0");
        header("Content-Type:application/force-download");
        header("Content-Type:application/vnd.ms-execl");
        header("Content-Type:application/octet-stream");
        header("Content-Type:application/download");;
        header('Content-Disposition:attachment;filename='.$filename.'');
        header("Content-Transfer-Encoding:binary");
        $objWriter->save('php://output');
    }

    //修改科目系列操作
    public function userdata(){
        $ses=Session::has('status');
        if($ses){
            $list=Db::name('subject')->order('id')->select();
            $this->assign('subject',$list);
            return $this->fetch();
        }else{
            $this->error('请通过登录方式进入后台','admin/register');
        }
    }
    public function updatesub(){
        $id= input('post.id');
        $subject=input('post.subject');
        $submoney=input('post.submoney');
        $up=Db::name('subject')->where("id=$id")->update(['subject'=>$subject,'submoney'=>$submoney]);
       if($up){
           echo 1;
       }
    }
    public function delsub(){
        $id=input('post.id');
        $del=Db::name('subject')->where("id=$id")->delete();
        echo $del;
    }
    public function insub(){
        $subject=input('post.subject');
        $submoney=input('post.submoney');
        $up=Db::name('subject')->insert(['subject'=>$subject,'submoney'=>$submoney]);
        echo $up;
    }
}
