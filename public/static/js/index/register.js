/**
 * Created by sunzh on 2018/1/7.
 */
window.onload = function () {

    var app = new Vue({
        el: '#reg_page',
        data: {
            width: 0,
            height: 0,
            account:{
                account: '',
                password: '',
                password2: '',
                phone: '',
            }
        },
        created: function () {
            //获取浏览器的宽高；
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        },
        methods: {
            submitForm: function() {
                var account = this.account;
                if(account.account == ''|| account.account  == null){
                    layer.open({
                        content: '用户名不能为空！'
                        ,btn: '我知道了'
                    });
                    return ;
                }
                if(account.password == ''|| account.password  == null){
                    layer.open({
                        content: '密码不能为空！'
                        ,btn: '我知道了'
                    });
                    return ;
                }
                if(account.password2 == ''|| account.password2  == null){
                    layer.open({
                        content: '重复密码不能为空！'
                        ,btn: '我知道了'
                    });
                    return ;
                }
                var a_regExp = /^[a-zA-Z0-9_]{4,16}$/;
                if(!a_regExp.test(account.account)){
                    layer.open({
                        title: [
                            '用户名不符合要求',
                            'background-color:#8DCE16; color:#fff;'
                        ]
                        ,content: '用户名只能是 字母、数字、下划线 4-16个字符<br>请重新输入！'
                        ,btn: '我知道了'
                    });
                    return ;
                }

                var pwd_regExp = /^[a-zA-Z0-9_]{4,20}$/;
                if(!pwd_regExp.test(account.password)){
                    layer.open({
                        content: '密码是由 字母、数字、下划线 4-20个字符组成<br>请重新输入！'
                        ,btn: '我知道了'
                    });
                    return ;
                }
                if(account.password != account.password2){
                    layer.open({
                        content: '两次密码不一致！'
                        ,btn: '我知道了'
                    });
                    return ;
                }
                var phone_regExp = /^1[3|4|5|7|8][0-9]{9}$/;
                if(account.phone != '' && !phone_regExp.test(account.phone)){
                    layer.open({
                        content: '手机号不符合规范<br>请重新输入！'
                        ,btn: '我知道了'
                    });
                    return ;
                }
                var obj = {
                    account: account.account,
                    password: md5(account.password),
                };
                if(account.phone){
                    obj.phone = account.phone;
                }

                axios.post("/index.php/index/Login/regAdd",obj).then(function (res) {
                    console.log(res);
                    if(res.data.status == 1){
                        layer.open({
                            content: res.data.msg
                            ,time: 2
                        });
                    }else {
                        layer.open({
                            content: res.data.msg
                            ,btn: '我知道了'
                        });
                    }
                }).catch(function (err) {
                    console.log(err);
                })

            },
            // 用户名输入框 失焦事件
            accountBlur: function() {
                var obj = {
                    account: this.account.account
                }
                axios.post("/index.php/index/Login/checkRepeat",obj).then(function (res) {
                    console.log(res);
                    if(res.data == 0){
                        layer.open({
                            content: '用户名已被注册！请重新输入'
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