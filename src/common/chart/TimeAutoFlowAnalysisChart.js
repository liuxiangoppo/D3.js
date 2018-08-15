import * as d3 from 'd3'

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
            }
        }
    }

    constructor(selector, option) {
        this.config = Object.assign(this.defaultSetting(), option);
        this.selector = selector;

        this.svg = d3.select(this.selector).append('svg')
            .attr("width", this.config.width)
            .attr("height", this.config.height);
    }

    // domain: 值域
    // range: 范围
    createXscale(data) {
        this.xScale = d3.scaleOrdinal()
            .domain(d3.range(data.length))
            .range([0, this.config.width-20]);
    }

    createYscale(data) {
        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(data)])
            .range([this.config.height - this.config.padding.top - this.config.padding.bottom, 0]);
    }

    drawChart(data) {
        const self = this;

        this.createXscale(data);
        this.createYscale(data);
        // 定义x轴 x轴刻度的方向向下
        const xAxis = d3.axisBottom(this.xScale);
        // 定义y轴 y轴刻度的方向向左
        const yAxis = d3.axisLeft(this.yScale);
        const rectPadding = 4;

        const rects = this.svg.select('.MyRect')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'myRect')
            .attr('transform', 'translate(' + this.config.padding.left + ',' + this.config.padding.top + ')')
            .attr('x', function (d, i) {
                return self.xScale(i) + rectPadding / 2;
            })
            .attr('y', function (d) {
                return self.yScale(d);
            })
            .attr("width", self.xScale.range() - rectPadding)
            .attr("height", function (d) {
                return self.config.height - self.config.padding.top - self.config.padding.bottom - self.yScale(d);
            });

        //添加文字元素
        // var texts = this.svg.selectAll(".MyText")
        //     .data(data)
        //     .enter()
        //     .append("text")
        //     .attr("class", "MyText")
        //     .attr("transform", "translate(" + self.config.padding.left + "," + self.config.padding.top + ")")
        //     .attr("x", function (d, i) {
        //         return self.xScale(i) + rectPadding / 2;
        //     })
        //     .attr("y", function (d) {
        //         return self.yScale(d);
        //     })
        //     .attr("dx", function (d, i) {
        //         return (self.xScale(i) - rectPadding) / 2;
        //     })
        //     .attr("dy", function (d) {
        //         return 20;
        //     })
        //     .text(function (d) {
        //         return d;
        //     });

        //添加x轴
        const xAxisLine = self.svg.append("g")
            .attr("fill", "axis")
            .attr("transform", "translate(" + self.config.padding.left + "," + (self.config.height - self.config.padding.bottom) + ")")
            .call(xAxis);
        //添加y轴
        const yAxisLine = self.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + self.config.padding.left + "," + self.config.padding.top + ")")
            .call(yAxis);
        
        xAxisLine.selectAll('path').attr('stroke','#0075C2');
        xAxisLine.selectAll('g').selectAll('line').attr('stroke', '#0075C2');

        yAxisLine.selectAll('path').attr('stroke','#0075C2');
        yAxisLine.selectAll('g').selectAll('line').attr('stroke', '#0075C2');

    }
}
