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
                username: '',
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
                let pwd = this.account.password;
                this.account.password = md5(pwd);

                axios.post("/index.php/index/index/checkLogin",this.account).then(function (res) {
                    console.log(res);
                    if(res.data.status == 1){

                    }
                }).catch(function (err) {
                    console.log(err);
                })

            }
        }
    })
}