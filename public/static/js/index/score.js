/**
 * Created by Administrator on 2018/1/15.
 */
window.onload = function() {

    var app = new Vue({
        el: '#score_list',
        data: {
            list: [],
        },
        created: function() {
            var layer_index = layer.open({
                type: 2,
                content: '加载中...'
            })
            //获取报名信息；
            axios.get('/index.php/index/entryinfo/getScore').then(function(res) {
                // console.log(res);
                layer.close(layer_index);
                if(res.data.status == 1){
                    this.list = res.data.data;
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
        

    })


}