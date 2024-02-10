import PrimeVue from "primevue/config";
import "primevue/resources/themes/lara-dark-green/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import 'primeflex/primeflex.css';
import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
createApp(App).use(PrimeVue).mount('#app')
