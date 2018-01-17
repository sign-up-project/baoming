/**
 * Created by Administrator on 2018/1/11.
 */

window.onload = function() {

    var app = new Vue({
        el: '#personal_page',
        data: {
            img: '',//头像
            username:'',//昵称
            sex: 1,//性别
        },
        created: function() {
            //获取用户信息；
            axios.get('/index.php/index/index/getUserinfo').then(function(res) {
                console.log(res);
                var data = res.data.data;
                this.username = data.account;
                //this.sex = data.sex;
                //this.sex = data.img;
            }.bind(this)).catch(function(err) {
                console.log(err);
            })
        },
        computed:{
            //计算性别
            sexTxt: function() {
                return this.sex == 1 ? '男' : (this.sex == 2 ? '女' : '未知');
            },
            //头像
            headPic: function() {
                return this.img ? this.img : '/static/images/user.jpg';
            }
        },
        methods: {
            //报名信息列表页；
            entryinfolist: function() {
              location.href = '/index.php/index/Entryinfo/entryInfoList';
            },
            //分数 页面
            scorepage: function () {
                location.href = '/index.php/index/Entryinfo/score';
            },
            //录取信息页面
            matriculate: function () {
                location.href = '/index.php/index/Entryinfo/matriculate';
            },
            //退出登录；
            loginOut: function() {
                axios.get('/index.php/index/index/loginOut').then(function (res) {
                    if(res.data.status == 1){
                        layer.open({
                            content: res.data.msg,
                            skin: 'msg',
                            time: 2,
                            success: function() {

                                setTimeout(function() {
                                    window.open('/index.php/index/login/login','_self');
                                }, 1000);

                            }
                        })
                    }
                }).catch(function (err) {
                    console.log(err);
                })
            }
        }


    })


}