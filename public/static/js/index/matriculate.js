/**
 * Created by Administrator on 2018/1/15.
 */
window.onload = function() {

    var app = new Vue({
        el: '#matriculate',
        data: {
            list: [],
        },
        created: function() {
            var layer_index = layer.open({
                type: 2,
                content: '加载中...'
            })
            //获取报名信息；
            axios.get('/index.php/index/entryinfo/getMatriculate').then(function(res) {
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
            // computedList: function() {
            //     var list = this.list;
            //     list.forEach(function(val, index){
            //         list[index]['sex'] = val['sex'] == 1 ? '男' : (val['sex'] == 2 ? '女' : '未知');
            //         var arr = val['idcar'].split('')
            //             arr.splice(6, 8, '*', '*', '*');
            //         var str = arr.join('');
            //         list[index]['idcar'] = str;
            //     });
            //     return list;
            // }
        },
        methods:{
            //点击查看详情
            info: function(event) {
                var index = event.currentTarget.dataset.index;
                var list = this.list;
                var detail = list[index];
                var html =
                    `<div >
                        <p class="en_title">录取信息</p>
                        <table>
                            <tr>
                                <td>姓名</td>
                                <td>${detail.username}</td>
                            </tr>

                            <tr>
                                <td>性别</td>
                                <td>${detail.sex}</td>
                            </tr>
                            <tr>
                                <td>身份证号</td>
                                <td>${detail.idcar}</td>
                            </tr>
                            <tr>
                                <td>准考证号</td>
                                <td>${detail.examnum}</td>
                            </tr>
                            <tr>
                                <td>报考科目</td>
                                <td>${detail.subject}</td>
                            </tr>
                            <tr>
                                <td>考试状态</td>
                                <td>${detail.examstatus}</td>
                            </tr>
                            <tr>
                                <td>录取结果</td>
                                <td>${detail.interviewstatus}</td>
                            </tr>

                        </table>

                    </div>`;
                layer.open({
                    type: 1
                    ,content: html
                    ,anim: 'up'
                    ,style: 'position:fixed; left:0; top:0; width:100%; height:100%; border: none; -webkit-animation-duration: .3s; animation-duration: .3s;'
                    ,btn: '关闭'
                })
            }
        }

    })


}