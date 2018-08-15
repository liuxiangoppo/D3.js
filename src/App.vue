<template>
  <div id="app" class="container">
    <v-header></v-header>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import '@/assets/reset.css'
import '@/assets/less/index.less'
import showDate from '@/components/base/ShowDate'
import vHeader from '@/components/base/Header'

export default {
  name: 'App',
  components: {
    vHeader, showDate
  }
}
</script>

<style>
</style>
