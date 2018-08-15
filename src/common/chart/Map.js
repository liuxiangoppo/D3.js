import * as d3 from 'd3'
import {
    merge, setAttr, setStyle, getInterPixel, isArray
} from './utils';
import { posix } from 'path';

export default class Map {
    defaultSetting() {
        return {
            width: 100,
            height: 100,
            padding: {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
            },
            style: {
                fill: '#010d3d',
                stroke: {
                    color: '#0087ff',
                    width: 1
                },
                text: {
                    color: '#FFF',
                    size: 11
                }
            },
            infoBox: {
                html: '',
                className: 'infoBox',
                formatter: function (d) { }
            }
        }
    }

    constructor(selector, option) {
        const that = this;
        that.config = merge(this.defaultSetting(), option, true);
        that.selector = selector;

        that.svg = d3.select(this.selector).select('#centerMapSvg')
            .attr("width", this.config.width)
            .attr("height", this.config.height);

        that.infoTip = d3.select(this.selector)
            .append('div')
            .attr('id', "infoTip")
            .attr('class', 'infoTip');

        // 为body绑定事件 如果事件触发的当前元素的class不是point的话 就移除掉infoWindowG元素
        document.body.onclick = function (e) {
            const target = e.target;
            if (target.className.baseVal !== 'point') {
                that.svg.selectAll('.infoWindowG').remove();
                that.svg.selectAll(".infoWindowLineG").remove();
                // 把点还原回原先的颜色
                that.svg.selectAll('.point').attr("fill", 'yellow');
            }
        };

        return true;
    }


    drawChart(data) {
        const scale = this.getZoomScale(data.features);
        const center = this.getCenters(data.features);
        // 创建投影方式
        this.projection = d3.geoMercator()
            .center(center)
            .scale(scale * 50)
            .translate([this.config.width / 2, this.config.height / 2])

        this.path = d3.geoPath(this.projection);
        const config = this.config;
        // 创建阴影
        this.renderShadow();
        this.drawInfoWindowBackImage();
        // 创建mapG
        this.drawMapG(this.svg, "mapG", config.style.fill, "url(#mapShadow)");



        const provincesG = setAttr(this.mapG.selectAll("path")
            .data(data.features)
            .enter()
            .append("path"), {
                // 省与省之间线的颜色
                stroke: config.style.stroke.color,
                // 线宽
                "stroke-width": config.style.stroke.width + 'px',
                d: this.path
            });

        // 绑定事件
        // provincesG
        //     .on("mouseover", function (d, i) {
        //         d3.select(this).attr("fill", "#46C5FB");
        //     })
        //     // 鼠标移除后 填充回之前的颜色
        //     .on("mouseout", function (d, i) {
        //         d3.select(this).attr("fill", config.style.fill);
        //     });

        this.circleDraw();
    }

    /**
     * 创建mapG元素
     * @param {*} svg svg元素
     * @param {*} className class名称 
     * @param {*} fillColor 填充颜色
     * @param {*} filterId 滤镜id
     */
    drawMapG(svg, className, fillColor, filterId) {
        this.mapG = svg
            .append("g")
            .style("fill", fillColor)
            .attr("class", className)
            .attr("filter", filterId);
    }

    /**
     * 显示地图标注
     * @param {*} features 
     * @param {*} path 
     */
    showMarkText(features, path) {
        const {
            style: {
                text
            }
        } = this.config;

        this.svg.selectAll("text")
            .data(features)
            .enter()
            .append("text")
            //设置各个文本（省份名称）显示的文字  
            .attr("transform", function (d, i) {
                if (d.properties.id == "13") //河北  
                {
                    return "translate(" + (path.centroid(d)[0] - 20) + "," + (path.centroid(d)[1]) + ")";
                }
                return "translate(" + (path.centroid(d)[0]) + "," + path.centroid(d)[1] + ")";
            })
            //显示省名  
            .text(function (d) {
                return d.properties.name;
            })
            .attr("fill", text.color)
            .attr("font-size", text.size);
    }

    /** 
     * 用于绘制地图上 不停扩山的圆圈
    */
    circleDraw() {
        const that = this;
        const { marks, infoWindow } = that.config;

        const circleGs = this.svg.selectAll("circleG").data(marks).enter().append('g').attr('class', 'circleG');

        const circleOuter2 = circleGs.append("circle").attr("class", "circleOuter2").attr("cx", function (d) {
            return that.projection(d.offset)[0];
        }).attr("cy", function (d) {
            return that.projection(d.offset)[1];
        }).attr("r", 60).attr("fill", "none").attr("stroke", "yellow").attr("transform", "translate(10,-20)");
        // 半径
        setAttr(circleOuter2.append("animate"), {
            attributeType: "xml",
            attributeName: "r",
            from: 0, to: 60, dur: "2s", repeatCount: "indefinite"
        });
        // 透明度
        setAttr(circleOuter2.append("animate"), {
            attributeType: "xml",
            attributeName: "opacity",
            from: 1, to: 0, dur: "2s", repeatCount: "indefinite"
        });

        const circleOuter1 = circleGs.append("circle").attr("class", "circleOuter1").attr("cx", function (d) {
            return that.projection(d.offset)[0];
        }).attr("cy", function (d) {
            return that.projection(d.offset)[1];
        }).attr("r", 40).attr("fill", "none").attr("stroke", "yellow").attr("transform", "translate(10,-20)");

        // 半径
        setAttr(circleOuter1.append("animate"), {
            attributeType: "xml",
            attributeName: "r",
            from: 0, to: 40, dur: "2s", repeatCount: "indefinite"
        });
        // 透明度
        setAttr(circleOuter1.append("animate"), {
            attributeType: "xml",
            attributeName: "opacity",
            from: 1, to: 0, dur: "2s", repeatCount: "indefinite"
        });

        const points = circleGs.append("circle").attr("class", "point").attr("cx", function (d) {
            return that.projection(d.offset)[0];
        }).attr("cy", function (d) {
            return that.projection(d.offset)[1];
        }).attr("r", 20).attr("fill", "yellow").attr("transform", "translate(10,-20)");

        points.on("click", function (d) {
            const pointOffset = that.projection(d.offset);
            const infoWindowWidth = 350, infoWindowHeight = 500;

            let infoWindowOffset = {};
            const otherWidth = 50;
            if (pointOffset[0] > (infoWindowWidth + otherWidth)) {
                // 如果当前点的位置的x轴大于弹窗的宽度
                infoWindowOffset.x = pointOffset[0] - infoWindowWidth - otherWidth;
            } else {
                infoWindowOffset.x = pointOffset[0] + infoWindowWidth + otherWidth;
            }

            if (pointOffset[1] > (infoWindowHeight + otherWidth)) {
                infoWindowOffset.y = pointOffset[1] - otherWidth;
            } else {
                infoWindowOffset.y = pointOffset[1] + otherWidth;
            }
            that.svg.selectAll(".point").attr("fill", "yellow");
            d3.select(this).attr("fill", "#46C5FB");
            const offsetX = 40;
            that.svg.selectAll('.infoWindowG').remove();
            that.svg.selectAll(".infoWindowLineG").remove();
            const infoWindowG = that.svg.append("g").attr("class", "infoWindowG").attr("transform", "translate(" + (infoWindowOffset.x) + ", " + (infoWindowOffset.y) + ")");
            infoWindowG.append("image").attr("href", infoWindow.backgroundImage).attr("width", infoWindowWidth).attr("height", infoWindowHeight);
            infoWindowG.append("text").attr("class", "provinceName").attr("x", offsetX).attr("y", 130).attr("font-size", 35).attr("fill", "#FFF").text(d.provinceName);
            infoWindowG.append("text").attr("class", "spaceCount").attr("x", offsetX).attr("y", 230).attr("font-size", 30).attr("fill", "#FFF").text(`泊位数:${d.spaceCount}个`);
            infoWindowG.append("text").attr("class", "parkingCount").attr("x", offsetX).attr("y", 270).attr("font-size", 30).attr("fill", "#FFF").text(`车场数:${d.parkingCount}个`);
            infoWindowG.append("text").attr("class", "inspectorCount").attr("x", offsetX).attr("y", 310).attr("font-size", 30).attr("fill", "#FFF").text(`巡检数:${d.inspectorCount}个`);
            infoWindowG.append("text").attr("class", "spaceUseRate").attr("x", offsetX).attr("y", 350).attr("font-size", 30).attr("fill", "#FFF").text(`泊位利用率:${d.spaceUseRate}`);
            infoWindowG.append("text").attr("class", "spaceTurnOverRate").attr("x", offsetX).attr("y", 390).attr("font-size", 30).attr("fill", "#FFF").text(`泊位周转率:${d.spaceTurnOverRate}`);

            const infoWindowLineG = that.svg.append("g").attr("class", "infoWindowLineG");
            infoWindowLineG.append("line")
                .attr("stroke", "#46C5FB")
                .attr("stroke-width", "2px")
                //.attr("shape-rendering", "crispEdges")
                .attr("x1", function () {
                    return pointOffset[0] + 30;
                })
                .attr("y1", function () {
                    return pointOffset[1] - 18;
                })
                .attr("x2", function () {
                    //return pointOffset[0] + 90;
                    return infoWindowOffset.x + infoWindowWidth;
                })
                .attr("y2", function () {
                    //return pointOffset[1] - 18;
                    return infoWindowOffset.y + infoWindowHeight - 53;
                });
        });
    }

    /**
     * 实时显示用户更新的数据
     * @param {*} data 数据 
     */
    showUserStatus(data) {
        const that = this;
        const { infoBox } = that.config;

        var i = 0;
        const time = infoBox.timeInterval;

        const timer = window.setInterval(() => {
            // 将已存在的消息弹窗先清理掉
            d3.selectAll("." + infoBox.className).remove();
            d3.selectAll(".infoBoxLineG").remove();

            // 获取当前的数据项
            const currentItem = data[i];
            // 创建弹窗
            const infoBoxLayer = document.createElement("div");
            const boxId = `infobox_${i}`;
            infoBoxLayer.id = boxId;
            infoBoxLayer.className = infoBox.className;
            infoBoxLayer.innerText = infoBox.formatter(currentItem);
            document.querySelector(that.selector).appendChild(infoBoxLayer);

            const infoBoxLineG = that.svg.append("g").attr("class", "infoBoxLineG");
            infoBoxLineG.append("line").attr("class", "infoBoxLine").attr("stroke", "#46C5FB")
                .attr("stroke-width", "2px")
                .attr("x1", function () {
                    return that.projection(currentItem.parkingPos)[0];
                })
                .attr("y1", function () {
                    return that.projection(currentItem.parkingPos)[1];
                })
                .attr("x2", function () {
                    return 968;
                })
                .attr("y2", function () {
                    return 151;
                });
            // 绘制线端的圆点
            infoBoxLineG.append("circle").attr("class", "infoBoxLinePoint").attr("cx", function (d) {
                return that.projection(currentItem.parkingPos)[0];
            }).attr("cy", function (d) {
                return that.projection(currentItem.parkingPos)[1];
            }).attr("r", 8).attr("fill", "#46C5FB");

            d3.select("#" + boxId).style("opacity", 1).transition().ease(d3.easeLinear).duration(9500).delay(200).style("opacity", 0.0);
            d3.select(".infoBoxLineG").style("opacity", 1).transition().ease(d3.easeLinear).duration(9500).delay(200).style("opacity", 0.0);

            if (i === data.length - 1) {
                window.clearInterval(timer);
            } else {
                i++;
            }

        }, time);
    }

    /**
     * 设置dom元素样式
     * @param {*} dom 
     * @param {*} style 
     */
    setDomStyle(dom, style) {
        Object.keys(style).forEach((key, i) => {
            var attr = key.replace(/[A-Z]/g, function (word) {
                return '-' + word.toLowerCase();
            });
            dom.style[attr] = style[key];
        });
        return dom;
    }

    /**
     * 获取Zoom缩放
     * @param {*} features 
     */
    getZoomScale(features) {
        const { width, height } = this.config
        let longitudeMin = 100000 // 最小经度
        let latitudeMin = 100000 // 最小维度
        let longitudeMax = 0 // 最大经度
        let latitudeMax = 0 // 最大纬度
        features.map((e) => {
            let a = d3.geoPath().bounds(e) // [[最小经度，最小维度][最大经度，最大纬度]]
            if (a[0][0] < longitudeMin) {
                longitudeMin = a[0][0]
            }
            if (a[0][1] < latitudeMin) {
                latitudeMin = a[0][1]
            }
            if (a[1][0] > longitudeMax) {
                longitudeMax = a[1][0]
            }
            if (a[1][1] > latitudeMax) {
                latitudeMax = a[1][1]
            }
        })
        var a = longitudeMax - longitudeMin
        var b = latitudeMax - latitudeMin
        return Math.min(width / a, height / b)
    }

    /**
     * 获取地图中心点
     * @param {*} features 
     */
    getCenters(features) {
        let longitudeMin = 100000
        let latitudeMin = 100000
        let longitudeMax = 0
        let latitudeMax = 0
        features.forEach((e) => {
            let a = d3.geoPath().bounds(e)
            if (a[0][0] < longitudeMin) {
                longitudeMin = a[0][0]
            }
            if (a[0][1] < latitudeMin) {
                latitudeMin = a[0][1]
            }
            if (a[1][0] > longitudeMax) {
                longitudeMax = a[1][0]
            }
            if (a[1][1] > latitudeMax) {
                latitudeMax = a[1][1]
            }
        })
        let a = (longitudeMax + longitudeMin) / 2
        let b = (latitudeMax + latitudeMin) / 2
        return [a, b]
    }

    /** 
     * 渲染阴影
    */
    renderShadow() {
        this.defs = this.svg.append("defs");
        const shadowAttr = {
            id: 'mapShadow',
            x: 0,
            y: 0,
            width: '200%',
            height: '200%'
        };
        const mapShadow = setAttr(this.defs.append('filter'), shadowAttr);

        setAttr(mapShadow.append('feOffset'), { result: "offOut", in: "SourceGraphic", dx: 4, dy: 4 });
        setAttr(mapShadow.append('feGaussianBlur'), { result: 'blurOut', in: 'offOut', stdDeviation: 10 });
        setAttr(mapShadow.append('feBlend'), { in: 'SourceGraphic', in2: 'blurOut', mode: 'normal' });
    }

    /**
     * 绘制信息弹窗背景图
     * @param {*} imagePath 背景图片地址
     */
    drawInfoWindowBackImage(imagePath) {
        const { infoWindow } = this.config;
        const pattern = this.defs.append("pattern").attr("id", "infoWindowBg").attr("height", 1).attr("width", 1).attr("patternContentUnits", "objectBoundingBox");
        pattern.append("image").attr("width", 1).attr("height", 1).attr("preserveAspectRatio", "none").attr("xmlns:xlink", infoWindow.backgroundImage);
    }

    /**
     * 在两个值之间随机获取数值
     * @param {*} Min 最小值
     * @param {*} Max 最大值
     */
    RandomNumBoth(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Math.round(Rand * Range);
        return num;
    }
}
