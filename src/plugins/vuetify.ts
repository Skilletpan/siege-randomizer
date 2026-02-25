import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';

export default createVuetify({
  icons: {
    aliases: {
      'home': 'mdi-home',
      'settings': 'mdi-cog'
    }
  },
  theme: {
    defaultTheme: 'dark'
  }
});
