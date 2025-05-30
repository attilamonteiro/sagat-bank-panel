import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";

// Se precisar de tipagem customizada, adicione aqui
// declare module 'pinia' {
//   export interface PiniaCustomProperties {
//     readonly router: Router;
//   }
// }

export default function setupPinia() {
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedState);
  // Adicione outros plugins do Pinia aqui, se necessário
  return pinia;
}
