import * as d3 from 'd3';
import { merge, getPixelLength, setStyle } from './utils';

/**
 * 首页左下角设备数量占比图表类
*/
export default class DevNumCompareChart {
  defaultOption() {
    return {
      width: 100,
      height: 100,
      padding: {
        top: 40,
        right: 10,
        bottom: 40,
        left: 10
      },
      totalSpaceCount: 1000000,
      datas: [
        {
          name: '占用泊位',
          count: 5000,
          color: '#F5CE34',
          formatter: function (d) {
            return '<p>' + d + '个</p><p>占用泊位数量</p>';
          }
        },
        {
          name: '空闲泊位',
          count: 3000,
          color: '#2480F7',
          formatter: function (d) {
            return '<p>' + d + '个</p><p>空闲泊位数量</p>';
          }
        }
      ]
    }
  }

  constructor(selector, option) {
    const defaultSetting = this.defaultOption()
    this.selector = selector
    this.config = merge(defaultSetting, option, true);

    // 让svg自适应容器
    this.svg = d3.select(this.selector).append('svg').attr("width", this.config.width).attr("height", this.config.height);
    // .attr("preserveAspectRatio", "xMidYMid meet")
    // .attr("viewBox", "0,0," + this.config.width + "," + this.config.height);
    return true;
  }



  drawPie() {
    const that = this;
    const { width, height, padding, totalSpaceCount, datas } = that.config;
    const dataset = datas.map(item => {
      return item.count;
    });
    const pie = d3.pie();
    const pieData = pie(dataset);

    const wrapperCircleoutRadius = that.wrapperCircleoutRadius = (height - padding.top - padding.bottom) / 2;
    const wrapperCircleInRadius = wrapperCircleoutRadius - 5;

    const innerCircleOutRadius = wrapperCircleInRadius - 10;
    const innerCircleInRadius = innerCircleOutRadius - 1;
    // 创建内圆
    this.drawCircle(that.svg, { x: width / 2, y: height / 2 }, innerCircleOutRadius, innerCircleInRadius, '#ddd');

    // 弧生成器
    const arc = d3.arc().outerRadius(wrapperCircleoutRadius).innerRadius(wrapperCircleInRadius);
    // 创建弧度构造器
    const arcs = this.svg.selectAll('pieItemG').data(pieData).enter().append('g').attr("class", "pieItemG").attr('transform', function (d, i) {
      return "translate(" + (width / 2) + "," + (height / 2) + ")";
    }).style("cursor", "pointer");

    arcs.append("path").attr("fill", function (d, i) {
      return datas[i].color;
    }).attr("d", function (d, i) {
      return arc(d);
    });

    this.showSpaceLegend(datas);
  }

  drawTotalSpaceCount(selector) {
    d3.select(selector).append("div")
  }

  showSpaceLegend(data) {
    const that = this;
    const { height, padding } = this.config;
    // 先设置selector为相对定位 方便图例进行定位
    const container = setStyle(d3.select(this.selector), {
      position: 'relative'
    });

    const inUseSpaceCountDiv = setStyle(container.append("div").attr("class", "inUseSpaceCount"), {
      position: 'absolute',
      left: padding.left + 'px',
      top: (padding.top + 20) + 'px',
      color: '#FFF',
      fontSize: '8px',
      background: 'red'
    }).html(data[0].formatter(data[0].count));

    const freeSpaceCountDiv = setStyle(container.append("div").attr("class", "freeSpaceCount"), {
      position: 'absolute',
      left: padding.left + 'px',
      bottom: (padding.bottom + 20) + 'px',
      color: '#FFF',
      fontSize: '8px',
      background: 'red'
    }).html(data[1].formatter(data[1].count));



  }

  /**
   * 绘制内圆
   * @param {*} svg svg元素
   * @param {*} offset 偏移
   * @param {*} outerRadius 外圆半径
   * @param {*} innerRadius 内圆半径
   * @param {*} color path填充颜色
   */
  drawCircle(svg, offset, outerRadius, innerRadius, color) {
    const arcGenerator = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0);

    const circleG = svg
      .append("g")
      .attr("transform", "translate(" + offset.x + "," + offset.y + ")");

    circleG.append("path")
      .datum({ endAngle: 2 * Math.PI })
      .style("fill", color)
      .attr("d", arcGenerator);
  }
}
