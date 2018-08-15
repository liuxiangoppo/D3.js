<template>
  <div id="homeCenterMap">
      <div class="total-layout">
          <div class="area">
              <div class="amount-detail">
                  <p class="white-text">今日收入</p>
                  <p class="amount amount-text">
                      <span>7504</span>
                      <span class="unit">万元</span>
                  </p>
              </div>
          </div>
          <div class="area">
              <div class="amount-detail">
                  <p class="white-text">今日充值</p>
                  <p class="amount amount-text">
                      <span>7504</span>
                      <span class="unit">元</span>
                  </p>
              </div>
          </div>
          <div class="area">
              <div class="amount-detail">
                  <p class="white-text">月度收入</p>
                  <p class="amount amount-text">
                      <span>1,268,002</span>
                      <span class="unit">万元</span>
                  </p>
              </div>
          </div>
      </div>
      <div class="centerMap" id="centerMap">
          <svg id="centerMapSvg">
          </svg>
      </div>
  </div>
</template>

<script>
import CenterMap from '@/common/chart/Map'
import china from '@/assets/geo/china.json'
const header = require('@/assets/image/header.png');

export default {
  name: 'homeMap',
  mounted () {
    this.init()
  },
  methods: {
      init() {
          const selector = document.querySelector('#centerMap')
          const config = {
              width: selector.clientWidth,
              height: selector.clientHeight,
              padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
             },
             style: {
                fill: '#010d3d',
                stroke: {
                    color: '#0087ff',
                    width: 1
                },
                text: {
                    color: '#FFF',
                    size: 11
                }
            },
            // 标注
            marks: [{
                // 经纬度
                offset: [84.9023, 42.148],
                provinceName: '西藏',
                spaceCount: 1000,
                parkingCount: 6000,
                inspectorCount: 90000,
                spaceUseRate: '10%',
                spaceTurnOverRate: '10%',
                formatter: function(d){
                    return "<p>"+d.provinceName+"</p><p>泊位数:"+d.spaceCount+"个</p><p>车场数:"+d.parkingCount+"个</p><p>巡检数:"+d.inspectorCount+"个</p>"
                }
            }, {
                offset: [118.7402,36.4307],
                provinceName: '山东',
                spaceCount: 2000,
                parkingCount: 3000,
                inspectorCount: 10000,
                spaceUseRate: '10%',
                spaceTurnOverRate: '10%',
                formatter: function(d){
                    return "<p>"+d.provinceName+"</p><p>泊位数:"+d.spaceCount+"个</p><p>车场数:"+d.parkingCount+"个</p><p>巡检数:"+d.inspectorCount+"个</p>"
                }
            }, {
                offset: [106.6113,26.9385],
                provinceName: '贵州',
                spaceCount: 5000,
                parkingCount: 4000,
                inspectorCount: 10000,
                spaceUseRate: '10%',
                spaceTurnOverRate: '10%',
                formatter: function(d){
                    return "<p>"+d.provinceName+"</p><p>泊位数:"+d.spaceCount+"个</p><p>车场数:"+d.parkingCount+"个</p><p>巡检数:"+d.inspectorCount+"个</p>"
                }
                
            }],
            // 信息盒子
            infoBox: {
                className: 'infoBoxLayer',
                timeInterval: 10000,
                formatter: function (d) {
                    const mobileNum = d.mobileNum.substr(0, 3) + "****" + d.mobileNum.substr(7);
                    if(d.type === 'trade'){
                        return `用户${mobileNum}在${d.parkingName}完成了一笔交易，金额${d.tradeAmount}元`;
                    }else {
                        // 充值
                        return `用户${mobileNum}完成了一笔充值，金额${d.rechargeAmount}元`;
                    }
                 }
            },
            // 信息弹窗
            infoWindow: {
                backgroundImage: 'http://'+window.location.host + '/static/image/infoWindow.png'
            }
          }
          const centerMap = new CenterMap('#centerMap', config)
          centerMap.drawChart(china);
          // 显示信息框
          centerMap.showUserStatus([{parkingPos: [122.0438,41.0889], mobileNum: '13793245663', type: 'trade', parkingName: '创客停车场', tradeAmount: 5, rechargeAmount: 10},{parkingPos: [116.4551,40.2539], mobileNum: '13793245678', type: 'trade', parkingName: '青岛大学停车场', tradeAmount: 100, rechargeAmount: 10}]);
      }
  }
}
</script>

<style lang="less">
@import url('../../assets/less/mixin.less');

#homeCenterMap {
    width: 100%;
    height: 100%;

    position: relative;

    .total-layout{
        width:100%;
        display: flex;

        .area {
            flex:1;
            padding: 10px;
        }

        .amount-detail{
            padding: 4rem 0 4rem 2rem;
            .gradient(rgba(16, 48, 104, 1),rgba(255, 255, 255, 0));
            .border-left-color(0.5rem,#168AE4);

            .white-text {
                padding: 3px 0 1rem 0;
                font-size: 4rem;
            }

            .amount {
                font-size: 6rem;
                font-weight: bold;
                letter-spacing:4px;
                .unit {
                    font-size: 3rem;
                    color: #52ABD6;
                }
            }
        }
    }

    .centerMap {
        width: 100%;

        position: absolute;
        top: 24rem;
        right: 0;
        bottom: 0;
        left: 0;
    }
}

.infoBoxLayer {
    position: absolute;
    background-image: url('/static/image/message_bg.png');
    background-size: 100% 100%;
    width: 80rem;
    height: 12rem;
    top: 0.8rem;
    left: 0.8rem;
    line-height: 12rem;
    font-size: 2.7rem;
    text-align: center;
    color: #FFF;
}

</style>
