<template>
    <div class="wave"></div>
</template>

<script>
export default {
    name: 'wave',
    props: {
        // 宽度
        width: 0,
        // 高度
        height: 0,
        // 内间距
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        // 个数
        barCount: 10,
        // 间距
        barSpacing: 2,
        // 颜色
        color: '',
        // 时间间隔
        interval: ''
    },
    methods: {
        init() {

        }
    },
    mounted() {
        this.init()
    }
}
</script>

<style lang="less">

</style>
