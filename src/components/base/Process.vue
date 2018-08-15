<template>
  <div class="process">
      <div class="process-inner" v-bind:class = "processItem.className" :style="{width: processItem.processWidth}">{{ processItem.amount }}</div>
  </div>
</template>

<script>
import Animate from 'velocity-animate'

export default {
  name: 'process',
  props: ['processItem'],
  mounted() {
    Animate(document.querySelector('.process-inner'), {width:this.processItem.processWidth}, {duration: 2000})
  }
}
</script>

<style lang="less">
    .process {
      height: 50%;

      .process-inner {
        width: 60%;
        height: 70%;
        line-height: 2rem;
        color: #FFF;
        font-size: 2rem;
        text-align: right;
        padding-right: 1rem;
      }
    }
</style>
