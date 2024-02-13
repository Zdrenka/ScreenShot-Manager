import PrimeVue from "primevue/config";
import "primevue/resources/themes/aura-light-noir/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import 'primeflex/primeflex.css';
import '@/assets/styles.scss';
import { createApp } from 'vue'
import App from './App.vue'
createApp(App).use(PrimeVue).mount('#app')
