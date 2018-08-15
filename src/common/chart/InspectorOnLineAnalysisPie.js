import * as d3 from 'd3';
import { merge } from './utils';

export default class InspectorOnLineAnalysisPie {
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
            // 外圆刻度
            wrapperCircleScaleCount: 90,
            innerCircleTickCount: 30,
            board: {
                className: '',
                backImage: ''
            },
            // 巡检总人数
            inspectorTotalCount: 10000,
            // 巡检在线人数
            inspectorOnLineCount: 5000
        };
    }

    constructor(selector, options) {
        this.config = merge(this.defaultSetting(), options, true);
        this.selector = selector;

        this.svg = d3.select(this.selector).append("svg").attr("width", this.config.width).attr("height", this.config.height);
    }

    draw() {
        const { width, height, padding, wrapperCircleScaleCount } = this.config;
        const _width = (width - padding.left - padding.right) / 2;
        const _height = (height - padding.top - padding.bottom) / 2;

        const outerRadius = (_width > _height) ? _height / 2 : _width / 2;
        const innerRadius = outerRadius - 30;
        const pie = d3.pie();
        const backCircleG = this.drawCircle(this.svg, { x: _width / 2, y: height / 2 }, outerRadius, innerRadius, (2 * Math.PI), '#0d2f7d');

        const wrapperCircleG = this.svg.append("g").attr("class", "wrapperCircleG").attr("transform", "translate(" + (_width / 2) + "," + (height / 2) + ")");;
        // 先定义扇形的个数
        const count = 90;
        // 创建弧度构造器
        for (let i = 0; i < count; i++) {
            // 计算出每个扇形的角度 计算公式为 360度 / 扇形的个数
            const angleVal = (Math.PI * 2) / count;
            // 计算每个扇形的开始角度 startAngle在i=0时为0度 
            const startAngle = i * (angleVal);
            // 计算每个扇形的结束角度
            const endAngle = (i + 1) * (angleVal) - (Math.PI * 2 / 180);

            // 根据开始角度以及结束角度创建弧度构造器
            const arc = d3.arc().outerRadius(outerRadius).innerRadius(outerRadius - 10).startAngle(startAngle).endAngle(endAngle);

            wrapperCircleG.append("path")
                .style("fill", "#02c7ea")
                .attr("d", arc).attr("transform", function () {
                    const midAngle = (startAngle + endAngle) / 2;
                    return "translate(" + (1 * Math.sin(midAngle)) + "," + (-1 * Math.cos(midAngle)) + ")";
                });
        }

        // 构造内圆1
        const innerCircleG1 = this.drawCircle(this.svg, { x: _width / 2, y: height / 2 }, innerRadius + 10, innerRadius - 30, (2 * Math.PI), '#2853d9');
        this.drawInnerCircleTickG();
        this.drawContentCircleG();
        this.drawBoard();
    }

    drawBoard() {
        const { width, height, padding, wrapperCircleScaleCount, board, inspectorTotalCount, inspectorOnLineCount } = this.config;
        const _width = (width - padding.left - padding.right) / 2;
        const _height = (height - padding.top - padding.bottom) / 2;

        const inspectorAnalysisBoardG = this.svg.append("g").attr("class", "inspectorAnalysisBoard").attr("transform", "translate(" + (_width + 50) + "," + (_height - 60) + ")");
        inspectorAnalysisBoardG.append("image").attr("href", board.backImage).attr("width", 250).attr("height", 150);
        inspectorAnalysisBoardG.append("text").text(inspectorOnLineCount).attr("fill", "#FFF").attr("font-size", "3.5rem").attr("text-anchor", "middle").attr("x", 125).attr("y", 70);
        const onLineRate = (inspectorOnLineCount / inspectorTotalCount) * 100 + '%';
        inspectorAnalysisBoardG.append("text").text(`在线巡检占比:${onLineRate}`).attr("fill", "#02c7ea").attr("font-size", "2rem").attr("text-anchor", "middle").attr("x", 125).attr("y", 100);
    }

    /** 
     * 
     * 创建内容圆形
     * 
    */
    drawContentCircleG() {
        const { width, height, padding, wrapperCircleScaleCount, inspectorOnLineCount, inspectorTotalCount } = this.config;
        const _width = (width - padding.left - padding.right) / 2;
        const _height = (height - padding.top - padding.bottom) / 2;

        const outerRadius = (_width > _height) ? _height / 2 : _width / 2;
        const innerRadius = outerRadius - 30;

        const contentCircleG = this.svg.append("g").attr("class", "contentCircleG").attr("transform", "translate(" + (_width / 2) + "," + (height / 2) + ")");
        const arc = d3.arc().outerRadius(innerRadius).innerRadius(innerRadius - 24, ).startAngle(0);

        const onLineRate = (inspectorOnLineCount / inspectorTotalCount) * 100;

        contentCircleG.append("path")
            .datum({ endAngle: ((Math.PI * 2 / 360) * 3.6 * onLineRate) })
            .style("fill", "#02c7ea")
            .attr("d", arc);
    }

    drawInnerCircleTickG() {
        const { width, height, padding, wrapperCircleScaleCount } = this.config;
        const _width = (width - padding.left - padding.right) / 2;
        const _height = (height - padding.top - padding.bottom) / 2;

        const outerRadius = (_width > _height) ? _height / 2 : _width / 2;
        const innerRadius = outerRadius - 30;
        // 构造内圆刻度
        const innerCircleTickG = this.svg.append("g").attr("class", "innerCircleTickG").attr("transform", "translate(" + (_width / 2) + "," + (height / 2) + ")");;
        // 先定义扇形的个数
        const tickCount = 30;
        // 创建弧度构造器
        for (let i = 0; i < tickCount; i++) {
            // 计算出每个扇形的角度 计算公式为 360度 / 扇形的个数
            const angleVal = (Math.PI * 2) / tickCount;
            // 计算每个扇形的开始角度 startAngle在i=0时为0度 
            const startAngle = i * (angleVal);
            // 计算每个扇形的结束角度
            const endAngle = (i + 1) * (angleVal) - (Math.PI * 2 / 360);

            // 根据开始角度以及结束角度创建弧度构造器
            const arc = d3.arc().outerRadius(innerRadius).innerRadius(innerRadius - 25, ).startAngle(startAngle).endAngle(endAngle);

            innerCircleTickG.append("path")
                .style("fill", "#002b74")
                .attr("d", arc).attr("transform", function () {
                    const midAngle = (startAngle + endAngle) / 2;
                    return "translate(" + (1 * Math.sin(midAngle)) + "," + (-1 * Math.cos(midAngle)) + ")";
                });
        }
    }

    drawCircle(svg, offset, outerRadius, innerRadius, endAngle, color) {
        const arcGenerator = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .startAngle(0);

        const circleG = svg
            .append("g")
            .attr("transform", "translate(" + offset.x + "," + offset.y + ")");

        circleG.append("path")
            .datum({ endAngle: endAngle })
            .style("fill", color)
            .attr("d", arcGenerator);

        return circleG;
    }
}