import * as d3 from 'd3'

/**
 * 首页左下角设备数量占比图表类
*/
export default class DevNumCompareChart {
  defaultOption() {
    return {
      width: 100,
      height: 100,
      padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
      }
    }
  }

  constructor(selector, option) {
    const defaultSetting = this.defaultOption()
    this.selector = selector
    this.config = Object.assign(defaultSetting, option)
    //this.svg = d3.select(this.selector).append('svg').attr('width', this.config.width).attr('height', this.config.height)

    // 让svg自适应容器
    this.svg = d3.select(this.selector).append('svg')
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("viewBox", "0,0," + this.config.width + "," + this.config.height)
    return true
  }

  getPixelLength(str, fontsize) {
    var curLen = 0;
    for (var i = 0; i < str.length; i++) {
      var code = str.charCodeAt(i);
      var pixelLen = code > 255 ? fontsize : fontsize / 2;
      curLen += pixelLen;
    }
    return curLen;
  }

  drawPie() {
    const self = this;
    const dataset = [30, 43, 55, 20]
    const pie = d3.pie()
    const pieData = pie(dataset)
    console.log(pieData)
    const outerRadius = 50
    const innerRadius = 45
    const arcArray = []
    // 线宽数组
    const strickArray = [12, 6, 3, 1]
    const bgArc = d3.arc().outerRadius(outerRadius).innerRadius(49);
    // 根据不同的线宽创建三个弧形构造器
    strickArray.forEach((item, i) => {
      const arc = d3.arc().outerRadius(outerRadius).innerRadius(outerRadius - item)
      arcArray.push(arc)
    })

    const arc = d3.arc().outerRadius(outerRadius).innerRadius(innerRadius);
    const colors = ['#F5CE34', '#2480F7', '#5AE6F2', '#5AE6F2']
    const arcs = this.svg.selectAll('g').data(pieData).enter().append('g').attr('transform', 'translate(160,100)')

    arcs.append('path').attr('fill', function (d, i) {
      return colors[i]
    }).attr('d', function (d, i) {
      return arcArray[i](d)
    })

    // 添加线
    arcs.append("line")
      .attr("stroke", "#FFF")
      .attr("x1", function (d, i) {
        return bgArc.centroid(d)[0] * 1;
      })
      .attr("y1", function (d, i) {
        return bgArc.centroid(d)[1] * 1;
      })
      .attr("x2", function (d, i) {
        return bgArc.centroid(d)[0] * 1.2;
      })
      .attr("y2", function (d, i) {
        return bgArc.centroid(d)[1] * 1.2;
      });

    var fontsize = 14;
    arcs.append("line")
      .style("stroke", "#FFF")
      .each(function (d) {
        d.textLine = { x1: 0, y1: 0, x2: 0, y2: 0 };
      })
      .attr("x1", function (d) {
        d.textLine.x1 = bgArc.centroid(d)[0] * 1.2;
        return d.textLine.x1;
      })
      .attr("y1", function (d) {
        d.textLine.y1 = bgArc.centroid(d)[1] * 1.2;
        return d.textLine.y1;
      })
      .attr("x2", function (d) {
        // console.log("d.data[0]:  "+d.data[0]);//产商名  
        var strLen = self.getPixelLength('测试', fontsize) * 1.2;
        var bx = bgArc.centroid(d)[0] * 1.2;
        d.textLine.x2 = bx >= 0 ? bx + strLen : bx - strLen;
        return d.textLine.x2;
      })
      .attr("y2", function (d) {
        d.textLine.y2 = bgArc.centroid(d)[1] * 1.2;
        return d.textLine.y2;
      });

    arcs.append("text")
      .attr("transform", function (d) {
        var x = 0;
        var y = 0;
        x = (d.textLine.x1 + d.textLine.x2) / 2;
        y = d.textLine.y1;
        y = y > 0 ? y + fontsize * 1.1 : y - fontsize * 0.4;
        return "translate(" + x + "," + y + ")";
      })
      .style("text-anchor", "middle")
      .style("font-size", fontsize)
      .attr("fill", '#FFF')
      .text(function (d) {
        return '测试';
      });

    arcs.append('text').attr('transform', function (d, i) {
      //return "translate(" + arc.centroid(d) + ")"
      console.log(bgArc.centroid(d))
      // if (i === 2) {
      //   var x = arc.centroid(d)[0] * 1.6;//文字的x坐标  
      //   var y = arc.centroid(d)[1] * 1.6;
      //   return "translate(" + x + "," + y + ")";
      // } else {
      // var itemArc = arcArray[i]
      // var x = itemArc.centroid(d)[0] * 1.4;//文字的x坐标  
      // var y = itemArc.centroid(d)[1] * 1.3;
      // return "translate(" + x + "," + y + ")";
      //}
      // var x = 0;
      // var y = 0;
      // x = (d.textLine.x1 + d.textLine.x2) / 2;
      // y = d.textLine.y1;
      // y = y > 0 ? y + 14 * 1.1 : y - 14 * 0.4;
      // return "translate(" + x + "," + y + ")";
    })
      .attr("text-anchor", "middle")
      .text(function (d) {
        return d.data;
      })
      .attr('fill', '#FFF')
  }

  drawChart() {
    const dataset = [30, 43, 55]
    const pie = d3.pie()
    const pieData = pie(dataset)



    const { width, height } = this.config
    const outerRadius = 50
    const innerRadius = 48
    // 弧形构造器
    const arcGenerator = d3.arc()
      // 设置内院半径大小
      .innerRadius(innerRadius)
      // 设置外圆半径大小
      .outerRadius(outerRadius)
      // 生成将0度作为起点的圆弧构造器
      .startAngle(0)

    // g元素的作用: g=>group
    // svg中g元素用于组织svg元素 可以对g元素进行变换 被g元素包裹的元素也将变换
    const picture = this.svg.append('g').attr('transform', 'translate(60,60)')

    // 最下方的圆
    var backGround = picture.append("path")
      .datum({ endAngle: 2 * Math.PI })
      .style("fill", "#FDF5E6")
      .attr("d", arcGenerator)

    // 最上方的圆
    var upperGround = picture.append('path')
      .datum({ endAngle: Math.PI / 2 })
      .style('fill', '#FFC125')
      .attr('d', arcGenerator)

    // 在svg的g元素上填充
    var dataText = picture.append('text')
      // 设置内容
      .text(70)
      // 水平居中
      .attr('text-anchor', 'middle')
      // 垂直居中
      //.attr('dominant-baseline', 'middle')
      // 字体大小
      .attr('font-size', '20px')
      // 设置颜色
      .attr('fill', '#FFF')
      .attr('transform', 'translate(0,20)')

    // 在svg的g元素上填充
    var dataText = picture.append('text')
      // 设置内容
      .text('当前进度')
      // 水平居中
      .attr('text-anchor', 'middle')
      // 垂直居中
      //.attr('dominant-baseline', 'middle')
      // 字体大小
      .attr('font-size', '18px')
      // 设置颜色
      .attr('fill', '#FFF')
      .attr('transform', 'translate(0,-2)')

    // timeout:延时执行
    // interval:循环执行
    d3.timeout(function () {
      upperGround.transition().duration(750).attrTween('d', function (d) {
        var compute = d3.interpolate(d.endAngle, Math.random() * Math.PI * 2);
        return function (t) {
          d.endAngle = compute(t);
          return arcGenerator(d);
        }
      })
    }, 1000)

  }
}
