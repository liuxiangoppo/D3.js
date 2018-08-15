<template>
  <div id="inspOnlineAnalysis">
    <h3 class="title">巡检在线分析</h3>
    <div class="area-content" id="inspectorOnLineAnalysis">

    </div>
  </div>
</template>

<script>
import InspectorOnLineAnalysisPie from '@/common/chart/InspectorOnLineAnalysisPie'

export default {
  name: 'inspOnlineAnalysis',
  methods: {
    init() {
      const selector = document.querySelector('#inspectorOnLineAnalysis')
      const config = {
        width: selector.clientWidth,
        height: selector.clientHeight,
        board: {
          backImage: 'http://' + window.location.host + '/static/image/inspectorAnalysis_board.png'
        }
      }
      const pie = new InspectorOnLineAnalysisPie('#inspectorOnLineAnalysis', config)
      pie.draw()
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style lang="less">
  #inspOnlineAnalysis {
    width: 100%;
    height: 100%;

    position: relative;
  }
</style>
