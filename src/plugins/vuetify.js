import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

export default createVuetify({
  icons: {
    aliases: {
      'siege-attack': 'mdi-sword-cross',
      'siege-defense': 'mdi-chess-rook',
      'siege-map': 'mdi-map',
      'siege-operators': 'mdi-account-multiple',
      'siege-strategy': 'mdi-strategy'
    }
  },
  theme: {
    defaultTheme: 'dark'
  }
});
