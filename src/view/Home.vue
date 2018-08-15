<template>
  <div id="home">
      <div class="left">
        <div class="top">
          <month-recharge-sort></month-recharge-sort>
        </div>
        <div class="mid">
          <insp-online-analysis></insp-online-analysis>
        </div>
        <div class="bottom">
          <user-regist-analysis></user-regist-analysis>
        </div> 
      </div>
      <div class="center">
        <home-map></home-map>
      </div>
      <div class="right">
        <div class="top">
          <time-auto-flow-analysis></time-auto-flow-analysis>
        </div>
        <div class="mid">
          <space-status-analysis></space-status-analysis>
        </div>
        <div class="bottom">
          <real-time-in-out-analysis></real-time-in-out-analysis>
        </div>
      </div>
  </div>
</template>

<script>
import inspOnlineAnalysis from '@/components/home/InspOnlineAnalysis'
import userRegistAnalysis from '@/components/home/UserRegistAnalysis'
import monthRechargeSort from '@/components/home/MonthRechargeSort'
import realTimeInOutAnalysis from '@/components/home/RealTimeInOutAnalysis'
import spaceStatusAnalysis from '@/components/home/SpaceStatusAnalysis'
import timeAutoFlowAnalysis from '@/components/home/TimeAutoFlowAnalysis'
import homeMap from '@/components/home/HomeMap'

export default {
  name: 'home',
  components: {
    userRegistAnalysis, inspOnlineAnalysis, monthRechargeSort, realTimeInOutAnalysis, spaceStatusAnalysis, timeAutoFlowAnalysis, homeMap
  },
  data: () => {
    return {
      message: 'Home'
    }
  }
}
</script>

<style lang = "less">

</style>
