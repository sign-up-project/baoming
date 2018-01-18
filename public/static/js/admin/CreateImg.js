/**
 *  考生信息 生成准考证图片；
 *  @param img 考生头像；
 *  @param data 考生信息；
 *  @param config 生成图片的相关配置；
 */

class CreateImg {

  constructor(img, data, config = {width: '360', height: '420'}) {

    this.img = img;
    this.data = data;
    this.config = config;    

  }

  /**
   * 初始化创建；
   */
  init(cb) {

    let _img = this.drawImg();
    _img.then((imgObj) => {
      
        let cvs = this.createCanvas(imgObj); //canvas 对象

        let src = this.canvasToImage(cvs);  //生成base64图片；

          var img = document.createElement('img');
          img.src = src;
          document.body.appendChild(img);

        typeof cb == "function" && cb(src);

      }).catch((err) => {
        console.log('ERROR: ' + err)
      });

  }

  /**
   * 创建canvas对象
   */
  createCanvas(imgObj) {
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
      let len = 125;
      if(i > 2){
        len = 215;
      }
      this.drawTitle(ctx, arr[i].name, 30, 150 + i * 40);
      this.drawVal(ctx, arr[i].val, 105 + Math.floor(len / 2), 150 + i * 40, len);
      this.drawLine(ctx, 105, 156 + i * 40, len);
    }
    
    ctx.drawImage(imgObj, 240, 120, 90, 126);

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
    ctx.font = "500 29px Arial";
    ctx.textAlign = 'center';
    ctx.fillText('厦门翔安艺术学校',this.config.width / 2, 50, this.config.width);
    ctx.font = "bold 21px Arial";
    ctx.fillText('准考证', this.config.width / 2, 85, this.config.width);
  }

  /**
   * 画 标题；
   */
  drawTitle(ctx, name, x=30, y) {
    ctx.font = "500 18px Arial";
    ctx.textAlign = 'left';
    ctx.fillText(name, x, y, 75);
  }

  /**
   * 画 标题对应内容；
   */
  drawVal(ctx, name, x=30, y, maxWidth) {
    ctx.font = "16px Arial";
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
   *  将canvas 内容生成图片；
   */
  canvasToImage(canvas) {
    // let canvas = this.createCanvas();
    let image = canvas.toDataURL();
    
    return image;
  }

}