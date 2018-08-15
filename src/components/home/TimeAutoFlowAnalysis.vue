<template>
  <div id="timeAutoFlowAnalysis">
    <h3 class="title">分时车流量分析</h3>
    <div class="area-content">
      <div id="time-auto-stream-analysis"></div>
    </div>
  </div>
</template>

<script>
import DoubleBar from '@/common/chart/DoubleBar'

export default {
  name: 'timeAutoFlowAnalysis',
  methods: {
    init() {
      const selector = document.querySelector('#time-auto-stream-analysis')
      const config = {
          width: selector.clientWidth,
          height: selector.clientHeight,
          gridStyle: false,
          tip: {
            className: 'tip',
            html: '<p>内蒙古:</p><p>泊位量19567890</p>',
            formatter: function(d){
              return "<p>当前值为:"+d+"</p>";
            }
          }
      }
      const doubleBar = new DoubleBar('#time-auto-stream-analysis', {
        width: selector.clientWidth,
          height: selector.clientHeight
      })
      doubleBar.drawChart([10, 20, 30, 40, 33, 24, 12, 200])
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style lang="less">
  @import url('./../../assets/less/mixin.less');

  #timeAutoFlowAnalysis {
    width: 100%;
    height: 100%;

    position: relative;

    .area-content {
      #time-auto-stream-analysis{
        width: 100%;
        height: 100%;
      }
    }
  }

  // 样式
  .tip-inner{
    padding: 5px;
    background: rgba(13, 99, 174, 0.9);
    // border: 1px solid #05325C;
    .borderRadius(3px);
    color: #FFF;
    font-size: 10px;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;

    p{
      padding: 2px;
    }
  }
</style>
