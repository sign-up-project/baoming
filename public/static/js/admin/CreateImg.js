/**
 *  考生信息 生成准考证图片；
 *  @param img 考生头像；
 *  @param data 考生信息；
 *  @param config 生成图片的相关配置；
 */

class CreateImg {

  constructor(img, data, config = {width: 794, height: 1123}) {

    this.img = img;
    this.data = data;
    this.config = config;    

  }

  /**
   * 初始化创建；
   */
  init(cb) {
    //如果图片地址正常（存在）；
    if (this.img){
      let _img = this.drawImg();
      _img.then((imgObj) => {

        let cvs = this.createCanvas(imgObj); //canvas 对象

        let src = this.canvasToImage(cvs);  //生成base64图片；

        typeof cb == "function" && cb(src);   //回调 用来将图片上传到服务器；

      }).catch((err) => {
        //图片加载失败；
        console.log('ERROR: ' + err);
        let cvs = this.createCanvas(); //canvas 对象
        let src = this.canvasToImage(cvs);  //生成base64图片；
        typeof cb == "function" && cb(src);   //回调
      });
    }else{
      let cvs = this.createCanvas(); //canvas 对象
      let src = this.canvasToImage(cvs);  //生成base64图片；
      typeof cb == "function" && cb(src);   //回调
    }
    

  }

  /**
   * 创建canvas对象
   */
  createCanvas(imgObj = '') {
    let canvas = document.createElement("canvas");
    canvas.id = 'mycanvas';
    canvas.width = this.config.width;
    canvas.height = this.config.height;
    //获取 canvas 上下文；
    const ctx = canvas.getContext('2d');

    this.fillBg(ctx);

    this.drawSchoolname(ctx);

    let arr = this.data;
    for(let i = 0; i < arr.length; i++) {
      let len = 260;
      if(i > 2){
        len = 530;
      }
      this.drawTitle(ctx, arr[i].name, 50, 324 + i * 100);
      this.drawVal(ctx, arr[i].val, 190 + Math.floor(len / 2), 324 + i * 100, len);
      this.drawLine(ctx, 195, 330 + i * 100, len);
    }

    if (imgObj) {
      ctx.drawImage(imgObj, 490, 266, 215, 301);
    } else {
      this.drawImgLocation(ctx, 520, 297);
    }    

    return canvas;

  }

  /**
   * 背景 填充
   */
  fillBg(ctx) {
    //填充背景；
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, this.config.width, this.config.height);
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.config.width, 0);

    ctx.lineTo(this.config.width, this.config.height);
    ctx.lineTo(0, this.config.height);
    ctx.lineTo(0, 0)
    ctx.closePath();
    ctx.stroke();
  }

  /**
   * 画 学校名称
   */
  drawSchoolname(ctx) {
    ctx.fillStyle = '#000';
    ctx.font = "58px Serif ";
    ctx.textAlign = 'center';
    ctx.fillText('厦门翔安艺术学校',this.config.width / 2, 149, this.config.width);
    ctx.font = "600 42px Serif ";
    ctx.fillText('准考证', this.config.width / 2, 206, this.config.width);
  }

  /**
   * 画 标题；
   */
  drawTitle(ctx, name, x=50, y) {
    ctx.font = "36px Serif";
    ctx.textAlign = 'left';
    ctx.fillText(name, x, y, 140);
  }

  /**
   * 画 标题对应内容；
   */
  drawVal(ctx, name, x=50, y, maxWidth) {
    ctx.font = "32px Serif";
    ctx.textAlign = 'center';
    ctx.fillText(name, x, y, maxWidth);
  }

  /**
   * 画 线；
   */
  drawLine(ctx, x, y, len) {
    ctx.beginPath();
    ctx.moveTo( x, y);
    ctx.lineTo( x + len, y);
    ctx.closePath();
    ctx.stroke();
  }

  /**
   * 画 头像；
   */
  drawImg() {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = function() {
        resolve(this);
      }
      img.onerror = function(err) {
        reject(err);
      }
      img.src = this.img;
    })
 
  }
  /**
   * 如果没有头像，或头像异常 ，画 头像位置(矩形框)；
   * x,y 为起始坐标，
   * w,h 矩形长宽，
   */
  drawImgLocation(ctx, x, y, w=181, h=243) {
    ctx.setLineDash([10, 5]); 
    ctx.lineWidth = 1; 
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.stroke();
    // ctx.strokeRect(x, y, w, h);
    ctx.font = "24px Serif ";
    ctx.textAlign = 'center';
    ctx.fillText('此处贴照片', x + w / 2, y + h/2, w);
  }

  /**
   *  将canvas 内容生成图片；
   */
  canvasToImage(canvas) {
    // let canvas = this.createCanvas();
    let image = canvas.toDataURL();
    
    return image;
  }

}
