import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

export default createVuetify({
  icons: {
    aliases: {
      'settings': 'mdi-cog',
      'siege-map': 'mdi-map',
      'siege-operators': 'mdi-account-multiple',
      'siege-strategy': 'mdi-strategy'
    }
  },
  theme: {
    defaultTheme: 'dark'
  }
});
