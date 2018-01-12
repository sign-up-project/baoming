/**
 * Created by Administrator on 2018/1/5.
 */
window.onload = function () {

    var app = new Vue({
        el: '#login_page',
        data: {
            message: 'Hello Vue!',
            width: 0,
            height: 0,
            account:{
                account: '',
                password: ''
            }
        },
        created: function () {
          //获取浏览器的宽高；
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        },
        methods: {
            submitForm: function() {
                var pwd = this.account.password;
                if(this.account.account == ''){
                    layer.open({
                        content: '账号不能为空'
                        ,btn: '我知道了'
                    });
                    return;
                }
                if(pwd == ''){
                    layer.open({
                        content: '登录密码不能为空'
                        ,btn: '我知道了'
                    });
                    return;
                }
                var obj = {};
                obj.account = this.account.account;
                obj.password = md5(pwd);

                var index = layer.open({
                    type:2,
                    content: '正在登录',
                    shadeClose: false,
                });
                axios.post("/index.php/index/Login/checkLogin",obj).then(function (res) {
                    layer.close(index);
                    var msg = res.data.msg || '登录失败，请重试';
                    //登录成功跳转页面；
                    if(res.data.status == 1){
                        layer.open({
                            content: msg,
                            skin: 'msg',
                            time: 2,
                            success: function(){
                                setTimeout(function () {
                                    window.open('/index.php/index/index/index','_self');
                                }, 1000);
                            }
                        });

                    }else {
                        layer.open({
                            content: msg
                            ,btn: '我知道了'
                        });
                    }
                }).catch(function (err) {
                    console.log(err);
                })

            }
        }
    })
}
