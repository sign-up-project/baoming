/**
 * Created by Administrator on 2018/1/16.
 */

window.onload = function () {
    var app = new Vue({
        el: '#uploadImg',
        data: {
            image: '',  // 要上传的图片；
            previewImg: '', //预览图片
        },
        methods: {
            //选择图片；
            selectImg: function(event) {
                var _self = this;
                var elmObj = event.currentTarget;
                var file = elmObj.files[0];
                console.log(file,file.type);
                if( file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/png' ){

                    if(file.size > 1024*1024){
                        layer.open({
                            content: '上传图片大小不得大于1M,请重新选择',
                            btn: '我知道了'
                        });
                        return ;
                    }
                    this.image = file;
                    var render = new FileReader();
                    render.readAsDataURL(file);
                    render.onload = function() {
                        _self.previewImg = this.result;
                    }

                }else{
                    layer.open({
                        content: '文件类型不符合要求',
                        btn: '我知道了'
                    });
                }

            },
            subImg: function() {

                var id = sessionStorage.getItem('table_userinfo_id'); //报名信息的id 或order_id;
                if(this.image == ''){
                    layer.open({
                        content: '请选择要上传的图片',
                        time: 1,
                    });
                    return ;
                }
                if(!id){
                    layer.open({
                        content: '未获取到报名信息',
                        time: 1,
                    });
                    return ;
                }
                //上传提示；
                var index = layer.open({
                    type: 2,
                    content: '正在上传'
                });

                var formdata = new FormData();
                formdata.append('id',id);
                formdata.append('image', this.image);
                var config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                axios.post('/index.php/index/entryform/uploadImgAction',formdata, config).then(function(res) {
                    layer.close(index);

                    if(res.data.status == 1){
                        layer.open({
                           content: res.data.msg,
                            time: 1,
                            success: function() {
                                setTimeout(function() {
                                    location.href = '/index.php/index/index/index';
                                }, 1000)
                            }
                        });
                    }else if(res.data.status == 0){
                        layer.open({
                            content: res.data.msg,
                            btn: '我知道了',
                        });
                    }else{
                        layer.open({
                            content: '服务器繁忙，请联系管理员',
                            btn: '我知道了',
                        });
                    }
                }).catch(function(err) {
                    console.log(err)
                })
            }
        }
    })
}