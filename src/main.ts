import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import setupRouter from './routes';
import setupPinia from './stores';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import { VProgressCircular } from 'vuetify/components';

const app = createApp(App);
const pinia = setupPinia();
const router = setupRouter();
const vuetify = createVuetify();

app.use(pinia);
app.use(router);
app.use(vuetify);
app.mount('#app');
