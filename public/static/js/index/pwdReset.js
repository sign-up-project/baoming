/**
 * Created by Administrator on 2018/1/5.
 */
window.onload = function () {

    var app = new Vue({
        el: '#reset_page',
        data: {
            val: '',    //修改密码的凭据 密码或手机号；
            password: '',
            password2: '',
            showResetBox: false,//显示密码修改框；
            subAccount: '', //提交的用来修改密码的 账户或手机号，防止提交后修改；
        },
        created: function () {

        },
        methods: {
            //检验账户是否存在；
            checkAccount: function() {
                var _self = this;
                if(this.val == ''){
                    layer.open({
                        content: '修改凭据不能为空',
                        time: 1
                    });
                    return ;
                }
                axios.post('/index.php/index/login/checkAccount',{value: this.val}).then(function(res) {

                    if(res.data.status == 0){
                        layer.open({
                            content: res.data.msg,
                            btn: '我知道了'
                        });
                        return;
                    }
                    _self.showResetBox = true;
                    _self.subAccount = _self.val;
                }).catch(function (err) {
                    console.log(err);
                })
            },
            //判断输入框是否改变，改变后需要从新提交验证；
            changeEvent: function() {
                this.showResetBox = false;
            },
            //提交修改密码；
            clickToReset: function() {
                if(this.val != this.subAccount){
                    layer.open({
                        content: '账号或手机号提交后不能修改<br>请重新提交',
                        btn: '我知道了'
                    });
                    return ;
                }
                if(this.password == ''){
                    layer.open({
                        content: '密码不能为空',
                        time: 1
                    });
                    return ;
                }
                if(this.password2 == ''){
                    layer.open({
                        content: '密码不能为空',
                        time: 1
                    });
                    return ;
                }
                var pwd_regExp = /^[a-zA-Z0-9_]{4,20}$/;
                if(!pwd_regExp.test(this.password)){
                    layer.open({
                        content: '密码是由 字母、数字、下划线 4-20个字符组成<br>请重新输入！'
                        ,btn: '我知道了'
                    });
                    return ;
                }
                if(this.password2 != this.password){
                    layer.open({
                        content: '两次密码不一致',
                        time: 1
                    });
                    return ;
                }
                var obj = {
                    value: this.subAccount,
                    password: md5(this.password)
                }
                axios.post('/index.php/index/login/subResetPwd',obj).then(function (res) {
                    if(res.data.status == 1){
                        layer.open({
                            content: res.data.msg,
                            time: 1,
                            success:function() {
                                setTimeout(function () {
                                    window.open('/index.php/index/login/login', '_self');
                                },1000);
                            }
                        });
                        return ;
                    }else {
                        layer.open({
                            content: res.data.msg
                            ,btn: '我知道了'
                        });
                    }

                })
            }
        }
    })
}
