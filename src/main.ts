import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import setupRouter from './routes';
import setupPinia from './stores';

const app = createApp(App);
const pinia = setupPinia();
const router = setupRouter();

app.use(pinia);
app.use(router);
app.mount('#app');
