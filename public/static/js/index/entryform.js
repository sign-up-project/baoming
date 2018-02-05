/**
 * Created by Administrator on 2018/1/9.
 */
window.onload = function() {

    //地址选择器 组件；
    Vue.component('address-selector', {
        props: ['region', 'which', 'width'],
        template: `
        <div id="picker">
            <div class="shadow" @click="hidePicker"></div>
            <transition v-on:after-leave="afterLeave" name="moveup" >
                <div class="p address_picker" v-show="showSelector">
                    <p class="p_title">选择地址 <span @click="hidePicker">&#215;</span></p>
                    <p class="show_value">
                        <span class="preview_span" :class="{select: selectNum == 1}" data-atype=1 v-on:click="clickSpanToMove($event)">{{preview.province == '' ? '请选择' : preview.province}}</span>
                        <span class="preview_span" :class="{select: selectNum == 2}" data-atype=2 v-on:click="clickSpanToMove($event)">{{preview.province != '' && preview.city == '' ? '请选择' : preview.city}}</span>
                        <span class="preview_span" :class="{select: selectNum == 3}" data-atype=3 v-on:click="clickSpanToMove($event)">{{preview.city != '' && preview.district=='' ? '请选择' : preview.district}}</span>
                    </p>
                    <div class="list_addr">
                        <ul class="list_addr_main" v-bind:class="" v-bind:style="{width: width/2*3 + 'px'}">
                            <li class="select_list">
                                <div class="select_list_box" v-if='provinceList'>
                                    <a v-for="item in provinceList" class="item" href="javascript:" v-bind:data-aid="item.id" data-atype="1" v-on:click="selectAddr($event)" :key="item.id">
                                        <span>{{item.name}}</span>
                                    </a>
                                </div>
                            </li>
                            <li class="select_list">
                                <div class="select_list_box" v-if='cityList'>
                                    <a v-for="item in cityList" class="item" href="javascript:" v-bind:data-aid="item.id" data-atype="2" v-on:click="selectAddr($event)" :key="item.id">
                                        <span>{{item.name}}</span>
                                    </a>
                                </div>
                            </li>
                            <li class="select_list">
                                <div class="select_list_box" v-if='districtList'>
                                    <a href="javascript:" class="item" v-for="item in districtList" v-bind:data-aid="item.id" :key="item.id" data-atype="3" v-on:click="selectAddr($event)">
                                        <span>{{item.name}}</span>
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
        </div>`,
        data: function() {
            return {
                showSelector: false,

                cityList: [], //市列表
                districtList: [], //县|区 列表；

                preview: {
                    province: '', //省 
                    city: '', //市 
                    district: '' //区|县
                }, // 地址选择要展示的地址名称(预览)；
                selectNum: 1, //当前选择 (预览) 元素 的标志 （设置样式）；

                direction: 'r', //移动方向 'r' 将要向左移动，'l' 将要向右移动；
            }
        },

        computed: {
            //计算省份列表；
            provinceList: function() {
                return this.initProvince();
            }
        },
        mounted: function() {
            this.showSelector = true;
        },
        methods: {
            //初始化省份列表；
            initProvince: function() {
                var ary = this.region.provinceList;
                if (!ary) {
                    return [];
                }
                // console.log('computed', ary);
                if (this.which == 'school') {
                    ary.forEach(function(val) {
                        if (val.name == '福建省') {
                            return ary = [val];
                        }
                    })
                }
                return ary;
            },
            //隐藏地址选择器；
            hidePicker: function() {
                this.showSelector = false;
            },

            //选择地址（三级联动）；
            selectAddr: function(event) {

                var elmObj = event.currentTarget, //当前点击的对象；
                    pid = elmObj.dataset.aid, //当前点击列表元素的id 即下级元素的父id；
                    val = elmObj.innerText,
                    type = elmObj.dataset.atype; //点击的类型（1、省份 2、市 3、县|区）；
                //设置当前点击 元素 的样式；
                var childElm = elmObj.parentNode.childNodes;
                childElm.forEach(function(val) {
                    val.classList.remove('checked');
                })
                elmObj.classList.add('checked');

                var objData = this.setPreview(pid, val, type); //设置预览值；
                // 发送预览值 给根实例；
                this.$emit('data', objData);

            },
            // 设置预览值；
            setPreview: function(parentId, previewVal, type) {
                //获取 显示选取值 标签元素；
                var previewSpan = document.getElementsByClassName('preview_span');
                var arr = [];
                if (type == 1) {
                    this.region.cityList.forEach(function(val, i) {
                        if (val.parent_id == parentId) {
                            arr.push(val);
                        }
                    });
                    this.cityList = arr;

                    this.preview.province = previewVal; //设置省份为当前选择的值
                    this.preview.city = ''; //
                    this.preview.district = '';

                    this.selectNum = parseInt(type) + 1;
                } else if (type == 2) {
                    if (this.direction == 'r') {
                        this.clickToMove();
                        this.direction = 'l';
                    }
                    this.region.districtList.forEach(function(val, i) {
                        if (val.parent_id == parentId) {
                            arr.push(val);
                        }
                    });
                    this.districtList = arr;

                    this.preview.city = previewVal; //
                    this.preview.district = '';

                    this.selectNum = parseInt(type) + 1;
                } else {
                    this.preview.district = previewVal;
                    this.selectNum = parseInt(type);
                }
                return this.preview;
            },

            //地址选择列表移动
            clickToMove: function() {
                var ul = document.getElementsByClassName('list_addr_main')[0];
                var distance = this.width / 2; //移动距离
                var val = '';
                if (this.direction == 'r') {
                    val = `translateX(-${distance}px)`;
                } else if (this.direction == 'l') {
                    val = `translateX(0)`;
                }
                ul.style.transform = val;
            },

            //点击地址显示区 滚动地址列表；
            clickSpanToMove: function(event) {
                var event = window.event || event;
                var elmObj = event.currentTarget; //当前点击对象；
                var type = elmObj.dataset.atype;

                this.selectNum = parseInt(type);

                if (type == 1) {
                    if (this.direction == 'l') {
                        this.clickToMove();
                        this.direction = 'r';
                    }
                } else {
                    if (this.direction == 'r') {
                        this.clickToMove();
                        this.direction = 'l';
                    }
                }
            },

            // transition 动画离开之后
            afterLeave: function(el) {
                this.$emit('hide', false);
            },
        }
    });

    var app = new Vue({
        el: '#entryform',
        data: {
            width: 0,
            height: 0,
            isPicker: false, //是否显示地址选择器；
            info: {
                username: '', //姓名
                sex: '', //性别
                idcar: '', //身份证号
                school: '', //学校
                major: 0, //课程
                major2: 0, //课程
                brtel: '', //本人电话
                telone: '', //家长电话  1
                teltwo: '', //家长电话 2
                province: '', //省 校址
                city: '', //市 校址
                district: '', //区|县 校址
                address: '', //详细地址 校址

                stu_province: '', //省  住址
                stu_city: '', //市 住址
                stu_district: '', //区|县 住址
                stu_address: '', //详细地址 住址

            },
            majors: [],
            cost: 0,

            previewImg: '', //上传图片预览地址；
            addressList: {}, //地址总列表；；

            subject: [], //科目 列表；
            station: 'home', // 选择是学校还是家庭 地址的标志；

        },
        created: function() {
            var layer_index = layer.open({
                type: 2,
                content: '数据加载中',
                shadeClose: false
            })
            var that = this;
            //获取浏览器的宽高；
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            //获取地址选择器数据,及科目数据；
            axios.get("/index.php/index/entryform/getAddressList").then(function(res) {
                // console.log(res);
                layer.close(layer_index);
                if (res.status == 200) {
                    var data = res.data;
                    that.addressList = {
                        provinceList: data.province,
                        cityList: data.city,
                        districtList: data.district,
                    }
                    that.subject = data.subject;
                }

            }).catch(function(err) {
                console.log(err);
            })
        },
        watch: {
            // 如果  发生改变，这个函数就会运行
            majors: function(newQuestion, oldQuestion) {
                // 最多选两项；
                var checkbox = document.getElementsByClassName('major')[0].getElementsByTagName('input');
                if(this.majors.length >= 2){
                    for(let i in checkbox){ 
                         if (!checkbox[i].checked) {
                            checkbox[i].disabled = true;
                        } 
                    }
                } else {
                    for (let i in checkbox) {
                        checkbox[i].disabled = false;
                    }
                }
                this.getCost();
            }
        },
        methods: {
            getCost: function() {
                this.info.major = this.majors[0] != undefined ? this.majors[0] : 0;
                this.info.major2 = this.majors[1] != undefined ? this.majors[1] : 0;
                if (this.majors.length == 0){
                    this.cost = 0;
                    return ;
                }
                var _self = this;
                for(let i = 0; i < this.majors.length; i++){
                    var id = this.majors[i];
                    this.subject.forEach(function (v) {
                        if (v.id == id) {
                          _self.cost = _self.cost >= v.submoney ? _self.cost : v.submoney;
                        }
                    })
                }
                
            },
            //表单提交
            submitForm: function(event) {

                let { username, sex, idcar, school, major, brtel, telone, teltwo, province, city, district, address, stu_province, stu_city, stu_district, stu_address } = this.info;

                if (username == '' || sex == '' || idcar == '' || school == '' || major == '' || brtel == '' || teltwo == '' ||
                    province == '' || city == '' || district == '' || stu_province == '' || stu_city == '' || stu_district == '') {
                    layer.open({
                        content: "表单带<span class='red'> * </span>号的内容不能为空",
                        btn: '我知道了'
                    })
                    return;
                }
                let idcar_regExp = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/; //身份证正则校验；
                if (!idcar_regExp.test(idcar)) {
                    layer.open({
                        content: '身份证号码不符合规范<br>请重新输入！',
                        btn: '我知道了'
                    });
                    return;
                }
                let phone_regExp = /^1[3|4|5|7|8][0-9]{9}$/; //手机号码正则校验
                if (!phone_regExp.test(brtel)) {
                    layer.open({
                        content: '联系电话不符合规范<br>请重新输入！',
                        btn: '我知道了'
                    });
                    return;
                }
                if (telone != '' && !phone_regExp.test(telone)) {
                    layer.open({
                        content: '家长电话不符合规范<br>请重新输入！',
                        btn: '我知道了'
                    });
                    return;
                }
                if (!phone_regExp.test(teltwo)) {
                    layer.open({
                        content: '班主任电话不符合规范<br>请重新输入！',
                        btn: '我知道了'
                    });
                    return;
                }
                let formData = new FormData();
                for (let key in this.info) {
                    formData.append(key, this.info[key]);
                }
                formData.append('money', this.cost);
                var subOrder = new Promise((resolve, reject) => {
                    axios.post("/index.php/index/entryform/submit", formData).then(function(res) {
                        // console.log(res);
                        if (res.data.status == 1) {
                            var layer_index_2 = layer.open({
                                type: 2,
                                content: '信息提交成功，即将调起支付页面...',
                                shadeClose: false
                            });
                            var obj = res.data.data;
                            sessionStorage.setItem('table_userinfo_id', obj.id); //存储id,上传图片时使用；
                            obj.layerIndex = layer_index_2;
                            //微信 支付 统一下单；
                            resolve(obj);
                        } else {
                            layer.open({
                                content: res.data.msg,
                                btn: '我知道了',
                            });
                        }


                    }).catch(function(err) {
                        reject(err);
                    })
                });
                //微信 支付 统一下单；
                subOrder.then(function(params) {
                    console.log('promise then: ' + params);
                    var config = {
                        withCredentials: true,
                    }

                    axios.post('/index.php/index/Weixinpay/wxpay', { id: params.id }).then(function(res) {
                        layer.close(params.layerIndex);
                        //微信支付；

                        var str = res.data;
                        var obj = delxml(str);

                        if (res.status == 200) {
                            if (typeof WeixinJSBridge == "undefined") {
                                if (document.addEventListener) {
                                    document.addEventListener('WeixinJSBridgeReady', function() {
                                        onBridgeReady(obj);
                                    }, false);
                                } else if (document.attachEvent) {
                                    document.attachEvent('WeixinJSBridgeReady', function() {
                                        onBridgeReady(obj);
                                    });
                                    document.attachEvent('onWeixinJSBridgeReady', function() {
                                        onBridgeReady(obj);
                                    });
                                }
                            } else {
                                onBridgeReady(obj);
                                sessionStorage.setItem('table_userinfo_id', params.id);
                            }
                        } else {
                            layer.open({
                                content: res.data.err,
                                btn: '我知道了'
                            });
                        }


                    }).catch(function(err) {
                        console.log(err);
                    });
                }).catch(function(err) {
                    console.log(err)
                })


            },

            //显示地址选择器；
            showPicker: function(event) {
                var event = window.event || event;
                var workStation = event.currentTarget.dataset.work;
                this.station = workStation;
                this.isPicker = true;
                this.isSelectors = true;
            },

            // 接收隐藏 地址选择器 指令；
            hideSelector: function(data) {
                this.isPicker = data;
            },

            //接收地区值 并设置省市区；
            setData: function(data) {

                if (this.station == 'school') {
                    this.info.province = data.province;
                    this.info.city = data.city;
                    this.info.district = data.district;
                } else {
                    this.info.stu_province = data.province;
                    this.info.stu_city = data.city;
                    this.info.stu_district = data.district;
                }
            },




            // // 图片选择
            // selectImg: function(event) {
            //     var _self = this;
            //     var elmObj = event.currentTarget;
            //     var file = elmObj.files[0];
            //     this.info.image = file;
            //     var render = new FileReader();
            //     render.readAsDataURL(file);
            //     render.onload = function() {
            //         _self.previewImg = this.result;
            //     }
            // }
        },
    });

    //
    function onBridgeReady(obj) {
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": obj.appId, //公众号名称，由商户传入     
                "timeStamp": obj.timeStamp, //时间戳，自1970年以来的秒数     
                "nonceStr": obj.nonceStr, //随机串     
                "package": obj.package,
                "signType": obj.signType, //微信签名方式：     
                "paySign": obj.paySign //微信签名 
            },
            function(res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") { // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
                    location.href = '/index.php/index/entryform/uploadImg';
                } else {

                }
            }
        );
    }
    //q去除xml
    function delxml(str) {
        var index = str.indexOf('{');
        var dataStr = str.substr(index);
        var data = JSON.parse(dataStr);
        console.log(data);
        return data;
    }

}