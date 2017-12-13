require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

// let yeomanImage = require('../images/yeoman.png');

// 20171210
// 获取图片相关数据
let imageDatas = require('../data/imageDatas.json');

// 利用自执行函数，将图片数据转换为url路径信息
imageDatas = (function getImageURL(imageDataArr) {

    for (let i = imageDataArr.length - 1; i >= 0; i--) {
        let singleImageData = imageDataArr[i];

        singleImageData.imageURL = require('../images/' + singleImageData.fileName);
        imageDataArr[i] = singleImageData;
    }
    // console.log(imageDataArr);
    return imageDataArr;
})(imageDatas);
// console.log(imageDatas);

/**
 *  date: 2017-12-11 09:50:47
 *  函数说明: 获取区间随机值
 *  @param min最低值；max最高值（不包含）
 */
function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 *  date: 2017-12-11 15:40:03
 *  函数说明: 获取0-max间随机正负值角度(deg)
 *  @param max最大值
 *
 */
function getRandomDeg(maxDeg) {
    let randomValue = Math.random(),
        symbol = randomValue < 0.5 ? '-' : '';

    return (symbol + Math.floor(randomValue * maxDeg));
}

// 返回单个figure图片容器
class ImgFigure extends React.Component {

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    /**
     *  date: 2017-12-11 16:28:46
     *  update: 2017-12-12 11:56:42
     *  函数说明: 图片点击时的处理函数
     *
     */
    handleClick(e) {

        if (this.props.imgArrange.isCenter) {
            this.props.inverse();
        } else {
            this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
    }

    render() {

        let styleObj = {};
        // 如果props属性指定了该图的位置
        if (this.props.imgArrange.pos) {
            styleObj = this.props.imgArrange.pos;
        }

        // 设置旋转角度
        if (this.props.imgArrange.rotate) {
            let browserPre = ['MOZTransform', 'MsTransform', 'WebkitTransform', 'transform'];
            browserPre.forEach(function(value) {
                styleObj[value] = 'rotate(' +
                    this.props.imgArrange.rotate + 'deg)';
            }.bind(this));
        }

        // 提高中心图片z-index,起到遮盖
        if (this.props.imgArrange.isCenter) {
            styleObj.zIndex = 11;
        } else {
            styleObj.zIndex = 0;
        }

        // 设置图片类
        let imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.imgArrange.isInverse ?
            ' is-inverse' : '';

        return (
            <figure className = {imgFigureClassName} style = {styleObj}
                onClick={this.handleClick} >
                <img
                     src={this.props.data.imageURL}
                     alt={this.props.data.title}
                />
                <figCaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                </figCaption>
                <div className="img-back" onClick={this.handleClick}>
                    <p>
                        {this.props.data.dec}
                    </p>
                </div>
            </figure>
        );
    }
}


// 导航控制组件
class NavControllerUnit extends React.Component {

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {

        // 如果点击的为当前居中的图片，则翻转图片，否则居中图片
        if (this.props.imgArrange.isCenter) {
            this.props.inverse();
        } else {
            this.props.center();
        }

        e.preventDefault();
        e.stopPropagation();
    }

    render() {

        let navCUnitClassName = 'nav-controller-unit';

        // 图片居中时，放大控制单元比例
        if (this.props.imgArrange.isCenter) {
            navCUnitClassName += ' is-center';

            // 如果同时对应为翻转时，改变控制单元旋转箭头
            if (this.props.imgArrange.isInverse) {
                navCUnitClassName += ' is-inverse';
            }
        }

        return (
            <span className={navCUnitClassName} onClick={this.handleClick}></span>
        );
    }
}

// 处理一切数据，及状态转换
class AppComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // 各图片位置的设置信息
            imgArrangeArr: [
                // pos: {
                //     left: 0,
                //     top: 0
                // },
                // rotate: 0, //旋转角度
                // isInverse: false, //图片正反面
                // isCenter: false //是否居中
            ]
        };

        this.Constant = {
            centerPos: {
                left: 0,
                right: 0
            },
            hPosRange: {    //水平方向左右区域取值
                leftSecX: [0, 0],
                rightSecX: [0, 0],
                y: [0, 0]
            },
            vPosRange: {    //垂直方向区域的取值范围
                x: [0, 0],
                topY: [0, 0]
            }
        };

        this.inverse = this.inverse.bind(this);
        this.center = this.center.bind(this);
    }

    // 图片加载之后为每张图片计算其位置的范围
    componentDidMount() {

        //先拿到容器gallery-sec的大小
        let gallerySecDOM = ReactDOM.findDOMNode(this.gallerySecDOM),
            gallerySecW = gallerySecDOM.scrollWidth,
            gallerySecH = gallerySecDOM.scrollHeight,
            halfGSecW = Math.ceil(gallerySecW / 2),
            halfGSecH = Math.ceil(gallerySecH / 2);

        // 获取一个imageFigure图片（组件）的大小
        let imgDOM = ReactDOM.findDOMNode(this.imgFigure0),
            imgW = imgDOM.scrollWidth,
            imgH = imgDOM.scrollHeight,
            halfImgW = imgW / 2,
            halfImgH = imgH / 2;

        // 计算中心图片分布区域
        // 区域计算
        this.Constant = {
            centerPos: {
                left: halfGSecW - halfImgW,
                top: halfGSecH - halfImgH
            },
            hPosRange: {    //水平方向左右区域取值
                leftSecX: [-halfImgW,
                    halfGSecW - halfImgW * 3],
                rightSecX: [halfGSecW + halfImgW,
                    gallerySecW - halfImgW],
                y: [-halfImgH, gallerySecH - halfImgH]
            },
            vPosRange: {    //垂直方向区域的取值范围
                x: [halfGSecW - halfImgW * 3,
                    halfGSecW + halfImgW],
                topY: [-halfImgH, halfGSecH - halfImgH * 3]
            }
        };
        console.log('constant', this.Constant);
        this.rearrange(0);
    }

    /**
     *  date: 2017-12-11 16:37:14
     *  函数说明: 翻转图片
     *  @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
     *  @return {Function} 这是一个闭包函数，其内return一个真正待被执行的函数
     */
    inverse(index) {
        return function() {
            let imgArrangeArr = this.state.imgArrangeArr;
            
            imgArrangeArr[index].isInverse = !imgArrangeArr[index].isInverse;

            console.log('into inverse');
            this.setState({
                imgArrangeArr: imgArrangeArr
            });
        }.bind(this);
    }

    /**
     *  date: 2017-12-12 11:52:40
     *  函数说明: 利用rearrange函数(重新渲染)，居中对应的index图片
     *  @param index, 需要居中的图片index
     *  @return {Function}
     */
    center(index) {
        return function() {
            this.rearrange(index);
        }.bind(this);
    }

    /**
     *  date: 2017-12-10 16:49:43
     *  函数说明: 重新布局所有图片
     *  @param centerIndex 指定居中排布哪个图片
     */
    rearrange(centerIndex) {
        console.log('rearrange', this.state.imgArrangeArr);
        let imgArrangeArr = this.state.imgArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeX = vPosRange.x,
            vPosRangeTopY = vPosRange.topY,

            // 取0个或1个至上侧区域
            imgArrangeTopArr = [],
            // 可有可无 0与1
            topImgFlag = getRandomValue(0, 2),
            // 从哪个取
            topImgSpliceIndex = 0,
            // 配置中心图片信息
            imgArrangeCenterArr = imgArrangeArr.splice(centerIndex, 1);
            imgArrangeCenterArr[0] = {
                pos: centerPos,
                rotate: 0,
                isInverse: false,
                isCenter: true
            };

            // 上侧图片信息
            topImgSpliceIndex = getRandomValue(0,
                imgArrangeArr.length);
            imgArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex,
                topImgFlag);

            // 布局上侧图片
            imgArrangeTopArr.forEach(function (value, index) {
                imgArrangeTopArr[index] = {
                    pos: {
                        left: getRandomValue(vPosRangeX[0], vPosRangeX[1]),
                        top: getRandomValue(vPosRangeTopY[0], vPosRangeTopY[1])
                    },
                    rotate: getRandomDeg(30),
                    isInverse: false,
                    isCenter: false
                };
            });

            // 布局左右两侧图片
            for (let i = 0, j = imgArrangeArr.length - 1, k = j / 2; i <= j; i++) {
                // 左区域 或右区域的水平x取值范围
                let hPostRangeLORX = null;

                // 数组前半为左，后半视为右
                if (i < k) {
                    hPostRangeLORX = hPosRangeLeftSecX;
                } else {
                    hPostRangeLORX = hPosRangeRightSecX;
                }

                imgArrangeArr[i] = {
                    pos: {
                        left: getRandomValue(hPostRangeLORX[0], hPostRangeLORX[1]),
                        top: getRandomValue(hPosRangeY[0], hPosRangeY[1])
                    },
                    rotate: getRandomDeg(30),
                    isInverse: false,
                    isCenter: false
                };
            }

            // 将有可能取出来的图片放回
            if (imgArrangeTopArr && imgArrangeTopArr[0]) {
                imgArrangeArr.splice(topImgSpliceIndex, 0, imgArrangeTopArr[0]);
            }
            imgArrangeArr.splice(centerIndex, 0, imgArrangeCenterArr[0]);
            this.setState({
                imgArrangeArr: imgArrangeArr
            });

            console.log(222, this.state.imgArrangeArr);
    }


    render() {
      
        let navControllerUnit = [],
            imgFigure = [];

        // 传子组件使用：this.props.data
        imageDatas.forEach(function(value, index) {
            
            if (!this.state.imgArrangeArr[index]) {

                this.state.imgArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    isInverse: false,
                    isCenter: false
                };
            }

            imgFigure.push(
                <ImgFigure key = {index}
                    imgArrange = {this.state.imgArrangeArr[index]}
                    ref = {(ref) => {this['imgFigure' + index] = ref;}}
                    data = {value}
                    inverse = {this.inverse(index)}
                    center = {this.center(index)}
                />
            );

            navControllerUnit.push(
                <NavControllerUnit key = {index}
                    imgArrange = {this.state.imgArrangeArr[index]}
                    inverse = {this.inverse(index)}
                    center = {this.center(index)}
                />
            );
        }.bind(this));
        console.log(11, imgFigure);

        return (
            <section className="gallery-sec"
                ref={(ref) => this.gallerySecDOM = ref}>
                <section className="gallery-images">
                    {imgFigure}
                </section>
                <nav className="gallery-nav">
                    {navControllerUnit}
                </nav>
            </section>
        );
    }
}

AppComponent.defaultProps = {
};

export default AppComponent; //暴露组件
