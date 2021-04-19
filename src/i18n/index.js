import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from './zh.js'
import en from './en.js'
Vue.use(VueI18n)
export const i18n = new VueI18n({
    locale: 'zh',
    messages: {
        'zh': {...zh},
        'en': {...en}
    }
})