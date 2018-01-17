/**
 * Created by Administrator on 2018/1/15.
 */
window.onload = function() {

    var app = new Vue({
        el: '#entryinfo',
        data: {
            detail: [],
        },
        created: function() {
            var id = sessionStorage.getItem('userinfo_id');
            console.log(id);
            //获取报名信息；
            axios.post('/index.php/index/entryinfo/getEntryinfo',{id: id}).then(function(res) {
                console.log(res);
                if(res.data.status == 1){
                    this.detail = res.data.data;
                }else{
                    layer.open({
                        content: res.data.msg,
                        time: 1
                    });
                }

            }.bind(this)).catch(function(err) {
                console.log(err);
            })
        },
        computed:{

        },
        methods: {
            //跳转至 图片上传页面
            toUploadImg: function (event) {

                if(sessionStorage.getItem('table_userinfo_id')){
                    location.href = '/index.php/index/entryform/uploadImg';
                }else{
                    var elmObj = event.currentTarget;
                    var id = elmObj.dataset.id;
                    sessionStorage.setItem('table_userinfo_id',id); //存储报名信息的id；
                    location.href = '/index.php/index/entryform/uploadImg';
                }

            },
        }

    })


}