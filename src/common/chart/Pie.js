import * as d3 from 'd3';
import { merge, getPixelLength, setStyle, toThousands } from './utils';

/**
 * 首页左下角设备数量占比图表类
*/
export default class DevNumCompareChart {
  defaultOption() {
    return {
      width: 100,
      height: 100,
      padding: {
        top: 100,
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
          markClassName: 'useSpaceMark',
          formatter: function (d) {
            return '<p>' + d + '个</p><p>占用泊位数量</p>';
          }
        },
        {
          name: '空闲泊位',
          count: 3000,
          color: '#2480F7',
          markClassName: 'freeSpaceMark',
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
    return true;
  }

  /** 
   * 绘制饼图
  */
  drawPie() {
    const that = this;
    const { width, height, padding, totalSpaceCount, inUseSpace, freeSpace } = that.config;
    const dataset = [inUseSpace.count, freeSpace.count];
    const pie = d3.pie();
    const pieData = pie(dataset);

    const wrapperCircleoutRadius = that.wrapperCircleoutRadius = (height - padding.top - padding.bottom) / 2;
    const wrapperCircleInRadius = wrapperCircleoutRadius - 13;

    const innerCircleOutRadius = wrapperCircleInRadius - 20;
    const innerCircleInRadius = innerCircleOutRadius - 2;
    // 创建内圆
    this.drawCircle(that.svg, { x: width / 2, y: height / 2 }, innerCircleOutRadius, innerCircleInRadius, '#333');

    // 弧生成器
    const arc = that.arc = d3.arc().outerRadius(wrapperCircleoutRadius).innerRadius(wrapperCircleInRadius);
    // 创建弧度构造器
    const arcs = this.svg.selectAll('.pieItemG')
      .data(pieData)
      .enter()
      .append('g')
      .attr("class", "pieItemG")
      .attr('transform', function (d, i) {
        return "translate(" + (width / 2) + "," + (height / 2) + ")";
      }).style("cursor", "pointer");

    arcs.append("path").attr("fill", function (d, i) {
      if (i === 0) {
        return inUseSpace.legend.color;
      }
      return freeSpace.legend.color;
    }).attr("d", function (d, i) {
      return arc(d);
    });

    // arcs.append("path").attr("fill", function (d, i) {
    //   if (i === 0) {
    //     return inUseSpace.legend.color;
    //   }
    //   return freeSpace.legend.color;
    // }).transition().duration(750).attrTween("d", function (d, i) {
    //   // return {
    //   //   startAngle: d.startAngle,
    //   //   endAngle: d.endAngle
    //   // }
    //   const a = d3.interpolate(d.startAngle, d.endAngle);
    //   return function(t){
    //     return arc(a(t));
    //   }
    // });

    this.showSpaceLabel(inUseSpace, freeSpace);
    this.showSpaceLegend(inUseSpace, freeSpace);
    this.drawTotalSpaceCount();
  }

  /**
   * 绘制泊位总数
   * @param {*} totalSpaceCount 泊位总数
   */
  drawTotalSpaceCount() {
    const that = this;
    const { width, height, padding, totalSpaceCount } = that.config;

    const totalCountTextG = that.svg.append("g").attr("class", "totalCountTextG");
    totalCountTextG.append("text").attr("fill", "#FFF").attr("font-size", "25px").attr("text-anchor", "middle").attr("transform", function () {
      const x = (width - padding.left - padding.right) / 2;
      return `translate(${x},190)`;
    }).text(totalSpaceCount.label);

    const container = setStyle(d3.select(that.selector), {
      position: 'relative',
      overflow: "hidden"
    });

    const boardDiv = setStyle(container.append("div"), {
      position: "absolute",
      width: ((width / 2) - padding.left) + "px",
      height: "110px",
      left: (padding.left + getPixelLength(totalSpaceCount.label, 25) / 2) + "px",
      top: ((height - padding.top - padding.bottom) / 2 + 28) + "px"
    });

    boardDiv.append("div").attr("class", totalSpaceCount.className).text(toThousands(totalSpaceCount.count));
  }

  showSpaceLegend(inUseSpace, freeSpace) {
    const that = this;
    const { width, height, padding, totalSpaceCount } = this.config;
    // 先设置selector为相对定位 方便图例进行定位
    const container = setStyle(d3.select(this.selector), {
      position: 'relative'
    });

    const legendContainer = setStyle(container.append("div").attr("class", "freeSpaceAndUseSpaceCount"), {
      position: "absolute",
      right: "0px",
      top: "50px",
      bottom: padding.bottom + "px",
      width: (width - (that.wrapperCircleoutRadius * 2)) / 2 + "px"
    });

    legendContainer.append("div")
      .attr("class", inUseSpace.legend.className)
      .html(inUseSpace.legend.formatter(inUseSpace, totalSpaceCount));

    legendContainer.append("div")
      .attr("class", freeSpace.legend.className)
      .html(freeSpace.legend.formatter(freeSpace, totalSpaceCount));
  }

  /**
   * 显示对应的标签
   * @param {*} inUseSpace 
   * @param {*} freeSpace 
   */
  showSpaceLabel(inUseSpace, freeSpace) {
    const that = this;
    const { width, height, padding } = this.config;
    // 先设置selector为相对定位 方便图例进行定位
    const container = setStyle(d3.select(this.selector), {
      position: 'relative'
    });

    const markContainer = setStyle(container.append("div").attr("class", "freeSpaceAndUseSpaceCount"), {
      position: "absolute",
      left: "0px",
      top: "50px",
      bottom: padding.bottom + "px",
      width: (width - (that.wrapperCircleoutRadius * 2)) / 2 + "px"
    });

    markContainer.append("div").attr("class", inUseSpace.label.className).html(inUseSpace.label.formatter(inUseSpace));
    markContainer.append("div").attr("class", freeSpace.label.className).html(freeSpace.label.formatter(freeSpace));
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
