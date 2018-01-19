/**
 * Created by Administrator on 2018/1/15.
 */
window.onload = function() {

    var app = new Vue({
        el: '#entryinfo_list',
        data: {
            list: [],
        },
        
        created: function() {
            var layer_index = layer.open({
                type: 2,
                content: '加载中...'
            })
            //获取报名信息；
            axios.get('/index.php/index/entryinfo/getEntryinfoList').then(function(res) {
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
        computed:{
            //计算列表
            computedList: function() {
                var list = this.list;
                list.forEach(function(val, index){
                    list[index]['sex'] = val['sex'] == 1 ? '男' : (val['sex'] == 2 ? '女' : '未知');
                    var arr = val['idcar'].split('')
                        arr.splice(6, 8, '*', '*', '*');
                    var str = arr.join('');
                    list[index]['idcar'] = str;
                });
                return list;
            }
        },
        methods:{
            detail: function($event) {
                var id = event.currentTarget.dataset.id;
                var status = event.currentTarget.dataset.status;
                if(status == 0){
                    layer.open({
                        content: '报名未成功,请重新报名',
                        btn: '我知道了'
                    });
                    return ;
                }
                sessionStorage.setItem('table_userinfo_id',id);

                location.href = '/index.php/index/entryinfo/entryinfo';
            }
        }

    })


}