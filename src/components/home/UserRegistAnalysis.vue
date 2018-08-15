<template>
    <div id="userRegistAnalysis">
      <h3 class="title">用户注册分析</h3>
      <div class="area-content">
        <div id="userRegistAnalysisContent">
          <div class="userAnalysis analysisArea">
            <div class="totalRegistUserLabel">累计注册用户</div>
            <div class="animalBar">
              <wave></wave>
            </div>
            <div class="totalRegistUserCount">{{ userAnalysis.totalCount | toThousands }}</div>
            <div class="month-day-regist-count">
              <div class="month-regist-count user-area">
                <p>{{ userAnalysis.monthRegistCount | toThousands }}</p>
                <p>月注册用户</p>
              </div>
              <div class="day-regist-count user-area">
                <p>{{ userAnalysis.dayRegistCount | toThousands }}</p>
                <p>日注册用户</p>
              </div>
            </div>
          </div>
          <div class="vehicleAnalysis analysisArea">
            <div class="totalRegistUserLabel">累计注册车辆</div>
            <div class="animalBar"></div>
            <div class="totalRegistUserCount">{{ vehicleAnalysis.totalCount | toThousands }}</div>
            <div class="month-day-regist-count">
              <div class="month-regist-count user-area">
                <p>{{ vehicleAnalysis.monthRegistCount | toThousands }}</p>
                <p>月注册车辆</p>
              </div>
              <div class="day-regist-count user-area">
                <p>{{ vehicleAnalysis.dayRegistCount | toThousands }}</p>
                <p>日注册车辆</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import wave from '@/components/base/wave'

export default {
  name: 'userRegistAnalysis',
  components: {
    wave
  },
  data: function() {
    return {
      userAnalysis: {
        totalCount: 8561020,
        monthRegistCount: 1000,
        dayRegistCount: 1000
      },
      vehicleAnalysis: {
        totalCount: 856102,
        monthRegistCount: 1000,
        dayRegistCount: 1000
      }
    }
  }
}
</script>
<style lang="less">
  @import url('./../../assets/less/mixin.less');
  #userRegistAnalysis{
    width:100%;
    height:100%;

    position: relative;

    #userRegistAnalysisContent{
      padding-top: 2rem;
      display: flex;
      height: 100%;
      flex: 2;
      .analysisArea {
        flex: 1;
        height: 100%;
        padding: 0 2rem 0 2rem;

        .totalRegistUserLabel{
          text-align: center;
          color: #FFF;
          font-size: 2.5rem;
          padding: 2rem 0 2rem 0;
        }

        .animalBar {
          height: 8rem;
          background: red;
        }
        
        .totalRegistUserCount{
          color: #0098df;
          font-size: 5rem;
          font-weight: bold;
          border-bottom: 2px solid #0187df;
          padding: 2rem 0 2rem 0;
          text-align: center;
        }

        .month-day-regist-count{
          display: flex;
          flex: 2;
          padding-top:2rem;
          
          .user-area{
            flex: 1;
            background: rgba(32,120,209, 0.6);

            p{
              color: #97d9ff;
              text-align: center;
              font-size: 2.5rem;
              padding: 2rem 0 1rem 0;
              letter-spacing: 1px;
              &:nth-child(2){
                padding-bottom: 2rem;
              }
            }
          }

          .month-regist-count{
            margin-right: 2rem;
          }

          .day-regist-count {
            margin-left: 2rem;
          }
        }
      }
    }
  }
</style>
