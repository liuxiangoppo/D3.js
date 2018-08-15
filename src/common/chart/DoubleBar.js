import * as d3 from 'd3';
import {
  merge
} from './utils';

export default class DoubarBar {

  /** 
   * width: 画布宽度
   * height: 画布高度
   * padding:{ 位置调整
   *  top: 10,
   *  right: 10,
   *  bottom: 10,
   *  left: 10
   * }
   * isGrid: 是否显示网格 默认为true
   */
  defaultSetting() {
    return {
      width: 0,
      height: 0,
      padding: {
        top: 20,
        right: 10,
        bottom: 20,
        left: 30
      },
      xAxis: {
        data: ["赵", "钱", "孙", "李", "周", "吴", "郑", "王"],
        // x轴坐标标签
        axisLabel: {
          // true: 表示Label在bar内部 false: 表示在下方
          inside: true, // true false
          show: true,
          // 字体样式
          style: {
            color: '#FFF',
            fontSize: 10
          }
        },
        // x轴网格线
        axisLine: {
          show: true,
          style: {
            width: 1,
            color: '#2A4A70'
          }
        },
        // 刻度
        axisTick: {
          show: false,
          style: {
            color: '#0B538F'
          }
        },
        axisGrid: {
          show: false,
          style: {
            color: '#0B538F'
          }
        }
      },
      yAxis: {
        // y轴坐标线
        axisLine: {
          show: true,
          style: {
            width: 1,
            color: '#2A4A70'
          }
        },
        // y轴坐标标签
        axisLabel: {
          show: true,
          // 字体样式
          style: {
            color: '#FFFFFF',
            fontSize: 10
          }
        },
        // 刻度
        axisTick: {
          show: false,
          style: {
            strokeColor: '#0B538F'
          },
          tickSize: 5
        },
        axisGrid: {
          show: true,
          style: {
            color: '#0B538F'
          }
        }
      },
      series: [{
        type: 'bar', // pie
        data: [100, 200, 300, 400, 330, 240, 120, 600]
      }],
      tip: {
        className: "tip",
        style: {

        },
        // 格式化tip显示内容
        formatter: function (d) {
          return "<p>当前的值:" + d + "</p>";
        }
      }
    }
  }

  constructor(selector, option) {
    this.config = merge(this.defaultSetting(), option, true);
    this.selector = selector;
    const {
      width,
      height
    } = this.config;

    // 初始化svg
    this.svg = d3.select(this.selector).append("svg")
      .attr("width", width)
      .attr("height", height);
  }

  // 绘制图表
  drawChart(data) {
    // 渲染x坐标轴
    this.renderXAxis();
    // 渲染y坐标轴
    this.renderYAxis();
    this.renderRectGradient();
    this.renderRect();
    // this.createTip();
  }

  // 创建x轴比例尺
  createXscale() {
    const that = this;
    const {
      width,
      padding: {
        right,
        left
      },
      xAxis
    } = this.config;

    this.xScale = d3.scaleBand()
      .domain(xAxis.data) //[0, (d3.max(xAxis.data)+ 20)] xAxis.data
      .rangeRound([0, width - right - left]);
  }

  // 渲染x坐标
  renderXAxis() {
    const {
      height,
      padding: {
        top,
        bottom,
        left
      },
      xAxis,
      gridStyle
    } = this.config;

    const {
      axisLabel,
      axisLine,
      axisTick,
      axisGrid
    } = xAxis;

    this.createXscale();

    //添加x轴坐标
    this.svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", function () {
        return "translate(" + left + "," + (height - bottom) + ")"
      })
      .call(d3.axisBottom(this.xScale).tickSizeOuter(0));


    // 如果设置了标尺颜色
    if (xAxis) {
      const domainLine = d3.selectAll('g.x-axis path.domain');
      if (axisLine && axisLine.show) {
        // 设置刻度尺颜色
        domainLine.attr("stroke", axisLine.style.color);
      } else {
        domainLine.attr("opacity", 0);
      }

      const tickLines = d3.selectAll('g.x-axis g.tick line');
      if (axisTick && axisTick.show) {
        // 设置下标线颜色
        tickLines.attr("stroke", axisTick.style.color);
      } else {
        tickLines.attr("opacity", 0);
      }

      const tickLabels = d3.selectAll('g.x-axis g.tick text');
      if (axisLabel && axisLabel.show) {
        // 设置下标标注颜色
        tickLabels.attr("fill", axisLabel.style.color);
      } else {
        // 设置下标标注颜色
        tickLabels.attr("opacity", 0);
      }

      // 创建x轴网格线
      const gridX = d3.selectAll('g.x-axis g.tick')
        .append('line')
        .classed('grid-line', true)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', -(height - top - bottom));

      if (axisGrid && axisGrid.show) {
        gridX.attr('stroke', axisGrid.style.color);
      }

    }


  }

  /**
   * 创建Y轴比例尺
   */
  createYscale() {
    const {
      height,
      padding: {
        top,
        bottom
      },
      series
    } = this.config;

    this.yScale = d3.scaleLinear()
      .domain([0, d3.max(series[0].data)]) //d3.max(series[0].data) + 100
      .range([height - top - bottom, 0]);
  }

  // 渲染y坐标
  renderYAxis() {
    const {
      width,
      padding: {
        top,
        right,
        left
      },
      yAxis
    } = this.config;

    const {
      axisTick,
      axisLabel,
      axisLine,
      axisGrid
    } = yAxis;

    // 创建Y轴比例尺
    this.createYscale();

    //创建y坐标轴
    this.svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(" + left + "," + top + ")")
      .call(d3.axisLeft(this.yScale).ticks(axisTick.tickSize)); //.tickSizeOuter(0))

    const domainLine = d3.selectAll('g.y-axis path.domain');
    if (axisLine && axisLine.show) {
      domainLine.attr("stroke", axisLine.style.color);
    } else {
      domainLine.attr("opacity", 0);
    }

    // 设置下标线颜色
    const axisTicks = d3.selectAll('g.y-axis g.tick line');
    if (axisTick && axisTick.show) {
      axisTicks.attr("stroke", axisTick.style.strokeColor);
    } else {
      axisTicks.attr("opacity", 0);
    }

    const axisLabels = d3.selectAll('g.y-axis g.tick text');
    // 设置下标标注颜色
    if (axisLabel && axisLabel.show) {
      axisLabels.attr("fill", axisLabel.style.color).attr("font-size", axisLabel.style.fontSize);
    } else {
      axisLabels.attr("opacity", 0);
    }

    const gridY = d3.selectAll('g.y-axis g.tick')
      .append('line')
      .classed('y-gridLine', true)
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', width - left - right)
      .attr('y2', 0);

    if (axisGrid && axisGrid.show) {
      gridY.attr('stroke', axisLine.style.color);
    }
  }

  // 渲染柱形图
  renderRect() {
    const that = this;
    const {
      height,
      padding: {
        top,
        bottom,
        left
      },
      xAxis,
      series
    } = that.config;

    const rectPadding = 10;

    that.bars = that.svg.selectAll(".barG")
      .data(series[0].data)
      .enter()
      .append("g")
      .attr("class", "barG");

    // 背景
    that.bars.append("rect")
      .attr("class", function (d, i) {
        return `rect_bg_${i}`;
      })
      .attr("transform", "translate(" + left + "," + top + ")")
      .attr("x", function (d, i) {
        return that.xScale(xAxis.data[i]);
      })
      .attr("y", function (d) {
        return 0;
      })
      .attr("width", that.xScale.bandwidth())
      .attr("height", function (d) {
        return height - top - bottom;
      })
      .attr("fill", "#000000")
      .attr("opacity", 0);

    that.bars.append("rect")
      .attr("class", "rectItem").attr("transform", "translate(" + left + "," + top + ")")
      .attr("x", function (d, i) {
        return that.xScale(xAxis.data[i]) + rectPadding / 2;
      })
      .attr("y", function (d) {
        var min = that.yScale.domain()[0];
        return that.yScale(min);
      })
      .style("cursor", "pointer")
      .attr("fill", "url(#" + this.rectGradient.attr("id") + ")") //"#7EA4F3"
      .attr("width", that.xScale.bandwidth() - rectPadding)
      .attr("height", function (d) {
        return 0;
      })
      .attr("bg", function (d, i) {
        return `rect_bg_${i}`;
      })
      .transition()
      .delay(function (d, i) {
        // i = 0、1、2、3、4、5、6
        // 表示按照递归每一个矩形都延迟200毫秒
        return i * 200;
      })
      .duration(1000)
      // ease(d3.easeBounce) v4的新写法 不得不说 v3到v4的过渡太坑了
      .ease(d3.easeBounce)
      .attr("y", function (d, i) {
        return that.yScale(d)
      })
      .attr("height", function (d, i) {
        return height - top - bottom - that.yScale(d);
      });

    // 添加文字标注


    that.bars.selectAll(".rectItem").on("mouseover", function () {
      const bgClassName = d3.select(this).attr("bg");
      d3.select(`.${bgClassName}`).attr("opacity", 0.3);
    }).on("mousemove", function () {
      const bgClassName = d3.select(this).attr("bg");
      d3.select(`.${bgClassName}`).attr("opacity", 0.3);
    }).on("mouseout", function () {
      const bgClassName = d3.select(this).attr("bg");
      d3.select(`.${bgClassName}`).transition().duration(100).attr("opacity", 0);
    });

    // that.bars.append("text").text(function (d) {
    //     return d;
    //   })
    //   .attr("x", function (d, i) {
    //     return that.xScale(xAxis.data[i]) + that.xScale.bandwidth();
    //   })
    //   .attr("y", function (d) {
    //     var min = that.yScale.domain()[0];
    //     return that.yScale(d);
    //   });
  }

  // 渲染矩形渐变
  renderRectGradient() {
    this.defs = this.svg.append("defs");
    const a = d3.rgb(130, 140, 20);
    const b = d3.rgb(255, 255, 180);
    const color = d3.interpolate(a, b);

    this.rectGradient = this.defs.append("linearGradient")
      .attr("id", "linearColor")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "20%");

    this.rectGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#D02C69"); // 红色

    this.rectGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#7EA4F3"); // 浅蓝色
  }

  createTip() {
    const that = this;
    const rects = that.rects;

    const {
      tip
    } = this.config;

    const $tipLayer = that.tipLayer = d3
      .select(that.selector)
      .append("div")
      .attr("class", "tipLayer")
      .style("position", "absolute")
      .style("display", "none");

    const $tipInner = that.tipInner = that.tipLayer
      .append("div")
      .attr("class", "tip-inner")
      .style("position", "relative");

    rects
      .on("mouseover", function (d) {
        $tipInner.html(tip.formatter(d));
        const pos = d3.mouse(this);
        const selectorWidth = document.querySelector(that.selector).clientWidth;
        const tipLayerWidthStr = $tipLayer.style("width");
        const tipLayerWidth = parseInt(tipLayerWidthStr.substring(0, tipLayerWidthStr.length - 2));

        if ((selectorWidth - pos[0]) <= (tipLayerWidth + 20)) {
          // 若右边的间距不足以完整的显示Tip 就让Tip在鼠标左边显示
          $tipLayer
            .style("left", (pos[0] - tipLayerWidth - 20) + "px")
            .style("top", (pos[1]) + "px");
        } else {
          // 否则继续在鼠标右边显示
          $tipLayer
            .style("left", (pos[0] + 50) + "px")
            .style("top", (pos[1]) + "px");
        }
        $tipLayer.style("display", "block");
      }).on("mousemove", function (d) {
        const pos = d3.mouse(this);
        const selectorWidth = document.querySelector(that.selector).clientWidth;
        const tipLayerWidthStr = $tipLayer.style("width");
        const tipLayerWidth = parseInt(tipLayerWidthStr.substring(0, tipLayerWidthStr.length - 2));

        if ((selectorWidth - pos[0]) <= (tipLayerWidth + 20)) {
          $tipLayer
            .style("left", (pos[0] - tipLayerWidth - 20) + "px")
            .style("top", (pos[1]) + "px");
        } else {
          $tipLayer
            .style("left", (pos[0] + 50) + "px")
            .style("top", (pos[1]) + "px");
        }
      }).on("mouseout", function (d) {
        $tipLayer.style("display", "none");
      })
  }
}

