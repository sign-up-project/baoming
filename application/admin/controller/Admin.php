<?php
namespace app\admin\controller;

use think\Controller;
use think\Db;
class Admin extends controller
{
    public function admin()
    {
        $user = Db::name('user')->find();
        $this->assign('user',$user);
        var_dump($user);
        return $this->fetch();
    }
}
