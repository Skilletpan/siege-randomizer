import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

export default createVuetify({
  icons: {
    aliases: {
      'siege-map': 'mdi-map',
      'siege-operators': 'mdi-account-multiple',
      'siege-side-all': 'mdi-infinity',
      'siege-side-attack': 'mdi-sword-cross',
      'siege-side-defense': 'mdi-chess-rook',
      'siege-strategy': 'mdi-strategy'
    }
  },
  theme: {
    defaultTheme: 'dark'
  }
});
