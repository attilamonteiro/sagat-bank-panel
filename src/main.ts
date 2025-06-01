import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import setupRouter from './routes';
import setupPinia from './stores';
import vuetify from './plugins/vuetify';

const app = createApp(App);
const pinia = setupPinia();
const router = setupRouter();

app.use(pinia);
app.use(router);
app.use(vuetify);
app.mount('#app');