<template>
  <div id="realTimeInOutAnalysis">
    <h3 class="title">实时驶入驶出流量分析</h3>
    <div id="realTimeInOutAnalysis-content" class="area-content">
      <ul id="parkingOrders">
        <li v-for="(order, i) in parkingOrders" :class="{'opacity_bg': i%2 != 1}">
          <span class="numplate">{{ order.numplate }}</span><span>{{order.type}}{{order.parkingName}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

import { getRandomNum } from '@/common/chart/utils'

export default {
  name: 'realTimeInOutAnalysis',
  data: function () {
    return {
      parkingOrders: [{
        numplate: '鲁B26MX7',
        type: '驶入',
        parkingName: '宁德路软件园停车场'
      }, {
        numplate: '鲁B26MX7',
        type: '驶出',
        parkingName: '名字非常长的超级牛逼停车场哈哈哈哈哈哈哈哈哈'
      }, {
        numplate: '鲁B26MX7',
        type: '驶出',
        parkingName: '创客大街停车场'
      }, {
        numplate: '鲁B26MX7',
        type: '驶入',
        parkingName: '北邮公园停车场'
      }, {
        numplate: '鲁B26MX7',
        type: '驶出',
        parkingName: '青岛大学停车场'
      }, {
        numplate: '鲁B26MX7',
        type: '驶出',
        parkingName: '创客大街停车场'
      }, {
        numplate: '鲁B26MX7',
        type: '驶入',
        parkingName: '北邮公园停车场'
      }]
    }
  },
  methods: {
    init() {
      // 模拟数据 
      // 没过10s中随机创建几条数据插入到parkingOrders数组当中
      const count = getRandomNum(1, 9);
      window.setInterval(()=> {
        for(let i = 0; i<=count; i++){
          this.parkingOrders.splice(0,0,{
            numplate: `鲁B${i}6YY${i}`,
            type: '驶入',
            parkingName: '北邮公园停车场'
          });
        }
      }, 10000);
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less">
  #realTimeInOutAnalysis {
    width: 100%;
    height: 100%;
    position: relative;

    #realTimeInOutAnalysis-content{
      overflow-y: auto;

      #parkingOrders{
        margin-top: 3rem;

        li{
          list-style: none;
          width: 100%;
          font-size: 2.7rem;
          letter-spacing: 3px;
          padding: 2.5rem 0 2.5rem 5rem;
          color: #FFF;
          position: relative;
          line-height: 2.8rem;
          &::before{
            content: '';
            width: 1rem;
            height: 1rem;
            background: #4ec6fd;
            position: absolute;
            top: 3.3rem;
            left: 2rem;
          }

          .numplate{
            display: inline-block;
            width: 15rem;
          }

        }
      }
    }
  }

  .opacity_bg {
    background: rgba(44, 48, 77, 0.4);
  }
</style>
