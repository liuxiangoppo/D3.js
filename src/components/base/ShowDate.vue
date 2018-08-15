<template>
  <div class="current-date">2017年8月6日&nbsp;&nbsp;13:50:50</div>
</template>

<script>
export default {
  name: 'showDate'
}
</script>

<style lang="less">
    @import url('./../../assets/less/mixin.less');
    .current-date {
        width:300px;
        height:35px;
        border: 1px solid #06407E;
        margin: 0 auto;
        margin-top:9px;
        text-align: center;
        line-height: 35px;
        font-size: 18px;
        letter-spacing: 2px;

        .borderRadius();
    }
</style>
