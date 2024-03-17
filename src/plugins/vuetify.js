import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

export default createVuetify({
  icons: {
    aliases: {
      'siege-map': 'mdi-map-outline',
      'siege-operator': 'mdi-account',
      'siege-operators': 'mdi-account-group',
      'siege-strategy': 'mdi-strategy'
    }
  },
  theme: {
    defaultTheme: 'dark'
  }
});
