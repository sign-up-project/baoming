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
                username: '',
                passworld: ''
            }
        },
        created: function () {
          //获取浏览器的宽高；
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        },
        methods: {
            submitForm: function() {
                var formData = JSON.stringify(this.account);
                console.log(formData);

            }
        }
    })
}
