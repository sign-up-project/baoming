<?php
namespace app\admin\controller;

use think\Controller;
use think\Db;
class Admin extends controller
{
    public function admin()
    {
        //$user = Db::name('user');
        return $this->fetch('admin');
    }
}
