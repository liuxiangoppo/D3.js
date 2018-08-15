<template>
  <div id="spaceStatusAnalysis">
    <h3 class="title">泊位情况分析</h3>
    <div class="area-content">
      <div id="spaceStatusAnalysisContent">
      </div>
    </div>
  </div>
</template>

<script>
import Pie from '@/common/chart/Pie'
import { toThousands } from '@/common/chart/utils'

export default {
  name: 'spaceStatusAnalysis',
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const self = this
      const selector = document.querySelector('#spaceStatusAnalysisContent')
      const config = {
        width: selector.clientWidth,
        height: selector.clientHeight,
        totalSpaceCount: {
          count: 8000000,
          className: 'totalSpaceCount',
          label: '总泊位数量'
        },
        inUseSpace: {
          count: 5000,
          legend: {
            color: '#FEB235',
            name: '占用泊位',
            className: 'inUseSpaceLegend',
            formatter: function(d){
              const totalCount = config.totalSpaceCount.count;
              const precent = ((d.count / totalCount) * 100) + '%';
              return `<p>${d.legend.name}</p><p>${precent}</p>`;
            }
          },
          label: {
            className: 'inUseSpaceLabel',
            formatter: function(d){
              return `<p>${toThousands(d.count)}个</p><p>泊位占用数量</p>`
            }
          }
        },
        freeSpace: {
          count: 3000,
          legend: {
            color: '#0E458A',
            name: '空闲泊位',
            className: 'freeSpaceLegend',
            formatter: function(d){
              const totalCount = config.totalSpaceCount.count;
              const precent = ((d.count / totalCount) * 100) + '%';
              return `<p>${d.legend.name}</p><p>${precent}</p>`;
            }
          },
          label: {
            className: 'freeSpaceLabel',
            formatter: function(d){
              return `<p>${toThousands(d.count)}个</p><p>泊位空闲数量</p>`
            }
          }
        }
      }
      const pie = new Pie('#spaceStatusAnalysisContent', config)
      pie.drawPie();
    }
  }
}
</script>

<style lang="less">
  #spaceStatusAnalysis{
    position: relative;
    height: 100%;
    #spaceStatusAnalysisContent {
      position: relative;
      width: 100%;
      height: 100%;
    }
  }

  /*泊位情况分析 总泊位数面板样式*/
  .totalSpaceCount {
    background-image: url('/static/image/board_bg.png');
    background-size: 100% 100%;
    float: right;
    font-size: 6rem;
    padding: 20px 50px 20px 60px;
    color: #4ec6fd;
  }

  .inUseSpaceLabel{
    color: #FFF;
    font-size: 2.5rem;
    padding: 50px 40px 55px 40px;

    p{
      padding:1px;
    }
  }
  .freeSpaceLabel{
    color: #FFF;
    font-size: 2.5rem;
    padding: 130px 40px 55px 40px;
    p{
      padding:1px;
    }
  }

  .inUseSpaceLegend{
    color: #FFF;
    font-size: 2.5rem;
    padding: 120px 40px 0px 60px;
    p{
      padding: 3px;
      &:nth-child(1){
        color: #00deff;
        position: relative;

        &::before{
          content: '';
          border: 12px solid #feb235;
          position: absolute;
          left: -30px;
          top: 6px;
        }
      }
    }
  }

  .freeSpaceLegend {
    color: #FFF;
    font-size: 2.5rem;
    padding: 60px 40px 0px 60px;
    p{
      padding: 3px;
      &:nth-child(1){
        color: #00deff;
        position: relative;

        &::before{
          content: '';
          border: 12px solid #0e458a;
          position: absolute;
          left: -30px;
          top: 6px;
        }
      }
    }
  }
  

</style>
