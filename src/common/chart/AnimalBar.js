import * as d3 from 'd3';
import {
    merge
} from './utils';

export default class AnimalBar {
    constructor(selector, options) {
        this.config = merge(this.defaultSetting(), options, true);
        this.selector = selector;
        this.svg = d3.select(this.selector)
            .append("svg")
            .attr("width", this.config.width)
            .attr("height", this.config.height);
    }

    /**
     * width、height、padding.
     * barCount: bar的个数
     * barSpacing: bar之间的间距
     */
    defaultSetting() {
        return {
            width: 100,
            height: 100,
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            barCount: 10,
            barSpacing: 10,
            color: '',
            interval: 200
        };
    }

    draw() {
        d3.select()
    }
}