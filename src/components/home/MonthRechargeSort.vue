<template>
  <div id="monthRecharge">
      <h3 class="title">本月收入排名</h3>
      <div class="area-content">
        <div class="content-wrapper">
          <div class="processItem" v-for="item in rechargeArray">
          <div class="processLabel">
            <p>{{ item.regionName }}</p>
            <p>订单数:{{ item.parkingOrderCount }}</p>
          </div>
          <div class="processContent">
            <process v-for="(amount, index) in item.datas" :key="index" :processItem="amount"></process>
          </div>
        </div>
        <div class="sortLegend">
          <span class="orderLegend"></span>
          <span>订单额</span>
          &nbsp;&nbsp;&nbsp;
          <span class="rechargeLegend"></span>
          <span>交易</span>
        </div>
        </div>
      </div>
    </div>
</template>

<script>
import process from '@/components/base/Process'

export default {
  name: 'monthRechargeSort',
  data: function(){
    return {
      rechargeArray: []
    }
  },
  components: {
    process
  },
  computed: {
    processWidth: function() {
      return this.rechargeArray.datas.filter((item)=>{

      });
    }
  },

  methods: {
    init() {
      this.rechargeArray = [{
        regionName: '山东省',
        parkingOrderCount: 1000,
        datas: [{
          label: '订单额',
          amount: 150000,
          className: 'order'
        }, {
          label: '充值',
          amount: 10000,
          className: 'recharge'
        }]
      }, {
        regionName: '贵州省',
        parkingOrderCount: 1000,
        datas: [{
          label: '订单额',
          amount: 200,
          className: 'order'
        }, {
          label: '充值',
          amount: 300,
          className: 'recharge'
        }]
      }, {
        regionName: '黑龙江省',
        parkingOrderCount: 1000,
        datas: [{
          label: '订单额',
          amount: 200,
          className: 'order'
        }, {
          label: '充值',
          amount: 300,
          className: 'recharge'
        }]
      }];

      // 计算进度条长度
      this.rechargeArray.forEach((item, i)=>{
        const orderAmount = item.datas[0].amount;
        const rechargeAmount = item.datas[1].amount;

        item.datas[0].processWidth = orderAmount / (orderAmount + rechargeAmount) * 100 + '%'
        item.datas[1].processWidth = rechargeAmount / (orderAmount + rechargeAmount) * 100 + '%'
      });
    }
  },

  mounted(){
    this.init();
  }
}
</script>

<style lang="less">
  #monthRecharge {
    width: 100%;
    height: 100%;
    position: relative;

    .area-content {
      position: absolute;
      padding: 10rem 8rem 0 2rem;

      .content-wrapper {
        width: 100%;
        height: 100%;

        position: relative;

        .sortLegend{
          width: 20rem;
          position: absolute;
          overflow: hidden;
          right: 3rem;
          top: -4rem;
          color: #FFF;
          font-size: 2rem;
          text-align: right;

          .orderLegend {
            padding: 1rem;
            background: #2584e3;
            margin-right: 1rem;
          }

          .rechargeLegend {
            padding: 1rem;
            background: #feb235;
            margin-right: 1rem;
          }
        }
      }
    }   

    .processItem {
      display: flex;
      flex: 2;
      margin-bottom: 4rem;

      .processLabel {
        width: 17rem;
        p {
          color: #FFF;
          font-size: 2.5rem;
          padding: 0.5rem;
        }
      }

      .processContent {
        flex: 1;

        .process {
          // height: 50%;

          // .process-inner {
          //   width: 60%;
          //   height: 70%;
          //   line-height: 2rem;
          //   color: #FFF;
          //   font-size: 2rem;
          //   text-align: right;
          //   padding-right: 1rem;
          // }

          // 订单进度条背景
          .order {
            background: #1d77d5;
            border: 1px solid #2584e3;
          }

          // 充值进度条背景
          .recharge {
            background: #feb235;
            border: 1px solid #ffd491;
          }
        }
      }

    }
  }
</style>
