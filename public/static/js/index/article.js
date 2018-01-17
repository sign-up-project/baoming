/**
 * Created by Administrator on 2018/1/5.
 */
window.onload = function () {

    var app = new Vue({
        el: '#article',
        data: {
            width: 0,
            height: 0,
            checked: false
        },
        created: function () {
          //获取浏览器的宽高；
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        },
        methods: {
            toEntryform: function() {
                if(!this.checked){
                    layer.open({
                        content: '请先确认阅读 说明',
                        btn: '好的'
                    });
                    return ;
                }
                location.href = '/index.php/index/entryform/entryform';
            },
        },

    })
}
