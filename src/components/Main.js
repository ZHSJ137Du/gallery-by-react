require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

let yeomanImage = require('../images/yeoman.png');

// 20171210
// 获取图片相关数据
let imageDatas = require('../data/imageDatas.json');

// 利用自执行函数，将图片数据转换为url路径信息
imageDatas = (function getImageURL(imageDataArr) {
	for (let i = imageDataArr.length - 1; i >= 0; i--) {
		let singleImageData = imageDataArr[i];

		singleImageData.imageURL = require('../images/' +singleImageData);
		imageDataArr[i] = singleImageData;
	}
})(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
		<section className="sec-gallery">
			<figure className="gallery-images">

			</figure>
			<nav className="gallery-nav">

			</nav>
		</section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent; //暴露组件
