/**
 * Created by Administrator on 2018/1/5.
 */


function getQueryString(name) {
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
     var r = window.location.search.substr(1).match(reg);
     if (r != null) return unescape(r[2]); return null;
    
 
} 

window.onload = function () {
    var layer_alert = layer.open({
        type: 2,
        content: '加载中...',
        shadeClose: false
    });
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
            
            var code = getQueryString("code");
            if (code) {
                axios.post("/index.php/index/Login/getOpenid", { code: code }).then(function (res) {
                    layer.close(layer_alert);
                    // console.log(res);
                }).catch(function (err) {
                    console.log(err);
                })
            } else {
                axios.get('/index.php/index/Login/checkOpenid').then(function (res) {
                    layer.close(layer_alert);
                    if(!res.data){
                        layer.open({
                            content: '数据异常，继续使用将不能体验报名功能<br/>如需报名，请从报名入口重新进入此程序',
                            btn: '好的'
                        });
                    }
                }).catch(function(err){
                    layer.close(layer_alert);
                    layer.open({
                        content: '数据异常，继续使用将不能体验报名功能<br/>如需报名，请从报名入口重新进入此程序',
                        btn: '好的'
                    });
                })
                
            }
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
                            shadeClose: false,
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
