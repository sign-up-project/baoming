<?php
namespace app\index\controller;

use think\Controller;
use think\Db;
use think\View;
use think\Env;
class Index
{
    public function index()
    {
        dump($_ENV);
    }
    public function login()
    {
        $view = new View();
        $data = Db::name('user')->select();
//        $view -> data = json_encode($data);
        $view -> assign('data',json_encode($data));
        return $view -> fetch();
    }
}
