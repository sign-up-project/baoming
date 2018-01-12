/**
 * Created by Administrator on 2018/1/9.
 */
window.onload = function() {

    var app = new Vue({
        el: '#entryform',
        data: {
            width: 0,
            height: 0,
            isSelectors: false, //地址选择器列表；
            isPicker: false, //是否显示地址选择器；
            info: {
                username: '', //姓名
                sex: '', //性别
                idcar: '', //身份证号
                school: '', //学校
                major: '', //课程
                brtel: '', //本人电话
                telone: '', //家长电话  1
                teltwo: '', //家长电话 2
                province: '', //省
                city: '', //市
                district: '', //区|县
                address: '', //详细地址
                image: '',
            },
            cost: 100.00,
            previewImg: '', //上传图片预览地址；
            addressList: {},
            provinceList: [],
            cityList: [],
            districtList: [],
            direction: 'r',//移动方向 'r' 将要向左移动，'l' 将要向右移动
        },
        created: function() {
            var that = this;
            //获取浏览器的宽高；
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            //获取地址选择器数据；
            axios.get("/index.php/index/entryform/getAddressList").then(function(res) {
                //console.log(res);
                if (res.status == 200) {
                    var data = res.data;
                    that.addressList = {
                        provinceList: data.province,
                        cityList: data.city,
                        districtList: data.district,
                    }
                    that.provinceList = data.province
                }

            }).catch(function(err) {
                console.log(err);
            })
        },
        methods: {
            //表单提交
            submitForm: function(event) {

                let { username, sex, idcar, school,  major, brtel, telone, teltwo, province, city, district, address, image } = this.info;
                //console.log(username, sex, idcar, school,  major, brtel, telone, teltwo, province, city, district, address, image);

                if(username == '' || sex == ''  || idcar == '' || school == ''|| major == ''||
                telone == ''|| province == ''|| city == ''|| district == '')
                {
                    layer.open({
                        content:"表单带<span class='red'> * </span>号的内容不能为空"
                        ,btn:'我知道了'
                    })
                }
                let idcar_regExp = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/; //身份证正则校验；
                if(!idcar_regExp.test(idcar)){
                    layer.open({
                        content: '身份证号码不符合规范<br>请重新输入！'
                        ,btn: '我知道了'
                    });
                    return ;
                }
                let phone_regExp = /^1[3|4|5|7|8][0-9]{9}$/;    //手机号码正则校验
                if(brtel != '' && !phone_regExp.test(brtel)){
                    layer.open({
                        content: '本人手机号不符合规范<br>请重新输入！'
                        ,btn: '我知道了'
                    });
                    return ;
                }
                if(!phone_regExp.test(telone)){
                    layer.open({
                        content: '家长电话1不符合规范<br>请重新输入！'
                        ,btn: '我知道了'
                    });
                    return ;
                }
                if(teltwo != '' && !phone_regExp.test(teltwo)){
                    layer.open({
                        content: '家长电话1不符合规范<br>请重新输入！'
                        ,btn: '我知道了'
                    });
                    return ;
                }
                let formData = new FormData();
                for(let key in this.info){
                    formData.append(key,this.info[key]);
                }
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                axios.post("/index.php/index/entryform/submit", formData, config).then(function (res) {
                    console.log(res);

                }).catch(function (err) {
                    console.log(err);
                })

            },
            //选择地址（三级联动）；
            selectAddr: function(event) {
                var that = this;
                var elmObj = event.currentTarget,//当前点击的对象；
                    pid = elmObj.dataset.aid,
                    v = elmObj.innerText,
                    type = elmObj.dataset.atype;
                //设置当前点击 元素 的样式；
                var childElm = elmObj.parentNode.childNodes;
                childElm.forEach(function(val){
                    val.classList.remove('checked');
                })
                elmObj.classList.add('checked');
                //获取 显示选取值 标签元素；
                var showValElms = document.getElementsByClassName('show_value')[0].getElementsByTagName('span');

                var arr = [];
                if (type == 1) {
                    this.addressList.cityList.forEach(function(val, i) {
                        if (val.parent_id == pid) {
                            arr.push(val);
                        }
                    });
                    this.cityList = arr;
                    this.info.province = v; //设置省份为当前选择的值
                    this.info.city = ''; //
                    this.info.district = '';
                    // 本级列表内容选取后，下级对应 显示值的元素 高亮；
                    for(var i=0 in showValElms){
                        showValElms[i].className = '';
                    }
                    showValElms[1].classList.add('select');
                } else if (type == 2) {
                    if(this.direction == 'r'){
                        this.clickToMove();
                        this.direction = 'l';
                    }
                    this.addressList.districtList.forEach(function(val, i) {
                        if (val.parent_id == pid) {
                            arr.push(val);
                        }
                    });
                    this.districtList = arr;
                    this.info.city = v; //设置省份为当前选择的值
                    this.info.district = '';
                    // 本级列表内容选取后，下级对应 显示值的元素 高亮；
                    for(var i=0 in showValElms){
                        showValElms[i].className = '';
                    }
                    showValElms[2].classList.add('select');
                } else if (type == 3) {
                    this.info.district = v; //设置省份为当前选择的值
                    this.isSelectors = false;
                }
            },
            //显示地址选择器；
            showPicker: function() {
                this.isPicker = true;
                this.isSelectors = true;
            },
            //显示地址选择器；
            hidePicker: function() {
                this.isSelectors = false;
            },
            // transition 动画离开之后
            afterLeave: function (el) {
                this.isPicker = false;
                this.direction = 'r';
            },
            //地址选择列表移动
            clickToMove: function() {
                var ul = document.getElementsByClassName('list_addr_main')[0];
                var distance = this.width / 2;
                var val = '';
                if(this.direction == 'r'){
                    var val = `translateX(-${distance}px)`;
                }else if(this.direction == 'l'){
                    var val = `translateX(0)`;
                }
                ul.style.transform = val;
            },
            //点击地址显示区 滚动地址列表；
            clickSpanToMove: function(event){
                var elmObj = event.currentTarget;//当前点击对象；
                var type = elmObj.dataset.atype;

                var showValElms = elmObj.parentNode.children;
                for(var i=0 in showValElms){
                    showValElms[i].className = '';
                }
                elmObj.classList.add('select');

                if(type == 1) {
                    if (this.direction == 'l') {
                        this.clickToMove();
                        this.direction = 'r';
                    }
                }else{
                    if(this.direction == 'r'){
                        this.clickToMove();
                        this.direction = 'l';
                    }
                }
            },
            selectImg: function(event) {
                var _self = this;
                var elmObj = event.currentTarget;
                var file = elmObj.files[0];
                this.info.image = file;
                var render = new FileReader();
                render.readAsDataURL(file);
                render.onload = function() {
                    _self.previewImg = this.result;
                }
            }
        },
    })

}