import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'


const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi', // 这已经是默认值-仅用于显示目的 
    },
    defaults: {
        VCard: {
            variant: 'tonal',
        },
    },
})
const app = createApp(App);
app.config.warnHandler = () => {};
app.use(vuetify).mount('#app')

