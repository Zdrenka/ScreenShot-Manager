import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from "primevue/config";
import "primevue/resources/themes/lara-dark-green/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
createApp(App).use(PrimeVue).mount('#app')
