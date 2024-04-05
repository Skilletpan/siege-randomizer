import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

export default createVuetify({
  icons: {
    aliases: {
      'siege-map': 'mdi-map',
      'siege-operators': 'mdi-account-multiple',
      'siege-strategy': 'mdi-strategy'
    }
  },
  theme: {
    defaultTheme: 'dark'
  }
});
