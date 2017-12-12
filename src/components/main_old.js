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

// 返回单个figure图片容器
class ImgFigure extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <figure className="img-figure">
                <img src={this.props.data.imageURL}
                     alt={this.props.data.title}
                />
                <figCaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                </figCaption>
            </figure>
        );
    }
}


// 处理一切数据，及状态转换
class AppComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            Constant: {
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
            },
            // 各图片位置的设置信息
            Pos: [
                // {
                //     left: 0,
                //     top: 0
                // }
            ],
            imgFigure: [],
            galleryNavUnit: []
        };

        this.getImgFigure = this.getImgFigure.bind(this);

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
        this.setState(() => ({
            // 区域计算
            Constant: {
                centerPos: {
                    left: halfGSecW - halfImgW,
                    right: halfGSecW + halfImgW
                },
                hPosRange: {    //水平方向左右区域取值
                    leftSecX: [-halfImgW,
                        halfGSecW - halfImgW * 3],
                    rightSecX: [halfGSecW + halfImgW * 3,
                        halfGSecW - halfImgW],
                    y: [-halfImgH, gallerySecH - halfImgH]
                },
                vPosRange: {    //垂直方向区域的取值范围
                    x: [halfGSecW - halfImgW * 3,
                        halfGSecW + halfImgW * 3],
                    topY: [-halfImgH, halfGSecH - halfImgH * 3]
                }
            }
        }));

        console.log(this.state);
        this.rearrange(0);
    }

    /**
     *  date: 2017-12-10 16:49:43
     *  函数说明: 重新布局所有图片
     *  @param centerIndex 指定居中排布哪个图片
     */
    rearrange(centerIndex) {

    }

    /**
     *  date: 2017-12-10 17:52:36
     *  函数说明: 获取imgFigure图片数组
     *
     */
    getImgFigure() {

        let imgFigure = [];

        // 传子组件使用：this.props.data
        imageDatas.forEach(function(value, index) {
            
            if (!this.state.Pos[index]) {
                // console.log(this.state.Pos);

                this.setState(() => {
                    this.state.Pos[index] = {
                        left: 0,
                        top: 0
                    };

                });
            }

            imgFigure.push(
                <ImgFigure key={index}
                    ref={(ref) => this['imgFigure' + index] = ref }
                    data={value}
                />
            );
        }.bind(this));

        return imgFigure;
    }

    
    render() {
      
        let galleryNavUnit = [],
            imgFigure = [];

        imgFigure = this.getImgFigure();
        console.log(imgFigure);

        // // 传子组件使用：this.props.data
        // imageDatas.forEach(function(value, index) {
            
        //     if (!this.state.Pos[index]) {
        //         // console.log(this.state.Pos);

        //         this.setState(() => {
        //             this.state.Pos[index] = {
        //                 left: 0,
        //                 top: 0
        //             };

        //         });
        //     }

        //     imgFigure.push(<ImgFigure key={index} ref={(ref) =>
        //         this['imgFigure' + index] = ref } data={value}/>);
        // }.bind(this));

        return (
            <section className="gallery-sec"
                ref={(ref) => this.gallerySecDOM = ref}>
                <section className="gallery-images">
                    {imgFigure}
                </section>
                <nav className="gallery-nav">
                    {galleryNavUnit}
                </nav>
            </section>
        );
    }
}

AppComponent.defaultProps = {
};

export default AppComponent; //暴露组件
