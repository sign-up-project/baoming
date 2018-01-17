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
            //获取报名信息；
            axios.get('/index.php/index/entryinfo/getScore').then(function(res) {
                console.log(res);
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
        }

    })


}