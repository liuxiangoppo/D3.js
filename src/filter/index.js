import { toThousands } from '@/common/chart/utils'

export default {
    install(Vue) {
        Vue.filter('toThousands', (value) => {
            return toThousands(value)
        })
    }
}