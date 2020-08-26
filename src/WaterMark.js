import { Component } from 'react';

// interface IInfo {
//     width: number;
//     height: number;
//     text: string;
// }

// interface IWaterMarkProps {
//     info: IInfo;
// }

const waterConfig = {
    fontStyle: 'bold 14px 黑体', // 水印字体设置
    rotateAngle: (20 * Math.PI) / 180, // 水印字体倾斜角度设置
    fontColor: 'rgba(44, 46, 59, 0.06)', // 水印字体颜色设置
    firstLinePositionX: 0, // canvas第一行文字起始X坐标
    firstLinePositionY: 0, // Y
    width: 220,
    height: 100
};

class WaterMark extends Component {
    domObserver = null;
    waterBox = null;
    url = null;

    componentDidMount() {
        this.drawerCanvas();
    }

    componentWillUnmount() {
        this.domObserver.disconnect();
        document.body.removeChild(this.waterBox);
    }

    drawerCanvas = async () => {
        const { info } = this.props;
        const canvas = document.createElement('canvas');

        canvas.width = waterConfig.width;
        canvas.height = waterConfig.height;

        const ctx = canvas.getContext('2d');

        // 绘制水印到canvas上
        ctx.font = waterConfig.fontStyle;
        ctx.fillStyle = waterConfig.fontColor;
        ctx.translate(waterConfig.width / 2, waterConfig.height / 2);
        ctx.rotate(waterConfig.rotateAngle); // 水印偏转角度
        ctx.fillText(info.text, waterConfig.firstLinePositionX, waterConfig.firstLinePositionY);

        this.url = canvas.toDataURL();
        this.waterBox = document.createElement('div');
        this.waterBox.className = 'water-maker';
        this.waterBoxStyle();

        document.body.appendChild(this.waterBox);
        this.observerDomChange();
    };

    waterBoxStyle = () => {
        const waterStyle = [
            ['width', '100%'],
            ['height', '100%'],
            ['pointerEvents', 'none'],
            ['opacity', '1 !important'],
            ['top', 0],
            ['left', 0],
            ['position', 'fixed'],
            ['zIndex', 1000000],
            ['display', 'block !important'],
            ['background', `url(${this.url}) repeat`]
        ];
        const waterStyleMap = new Map(waterStyle);

        for (let [key, value] of waterStyleMap.entries()) {
            this.waterBox.style[key] = value;
        }
    };

    observerDomChange = () => {
        if (window.MutationObserver) {
            const config = {
                childList: true,
                attributes: true,
                characterData: true,
                subtree: true,
                attributeOldValue: true,
                characterDataOldValue: true
            };

            this.domObserver = new MutationObserver(this.observerCallback);
            this.domObserver.observe(document.body, config);
        }
    };

    observerCallback = mutationsList => {
        for (let mutation of mutationsList) {
            let type = mutation.type;

            switch (type) {
                case 'childList':
                    if (!document.getElementsByClassName('water-maker')[0]) {
                        this.drawerCanvas();
                    }

                    break;
                case 'attributes':
                    if (mutation.attributeName === 'class' && mutation.oldValue === 'water-maker') {
                        this.waterBox.className = 'water-maker';
                        // console.log(`${mutation.attributeName}属性修改了`, mutation);
                    }

                    if (mutation.attributeName === 'style' && mutation.target.className === 'water-maker') {
                        this.waterBoxStyle();
                        // console.log(`${mutation.attributeName}属性修改了`, mutation);
                    }

                    break;
                default:
                    break;
            }
        }
    };

    render() {
        return null;
    }
}

export default WaterMark;
