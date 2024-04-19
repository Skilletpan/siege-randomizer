import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import COLORS from 'vuetify/util/colors';
import 'vuetify/styles';

export default createVuetify({
  defaults: {
    VAutocomplete: {
      density: 'comfortable',
      hideDetails: true,
      persistentPlaceholder: true,
      variant: 'solo-filled'
    },
    VSelect: {
      density: 'comfortable',
      hideDetails: true,
      persistentPlaceholder: true,
      variant: 'solo-filled'
    }
  },
  icons: {
    aliases: {
      'delete': 'mdi-delete',
      'randomize': 'mdi-dice-multiple-outline',
      'settings': 'mdi-cog',
      'siege-map': 'mdi-map',
      'siege-operators': 'mdi-account-multiple',
      'siege-side-all': 'mdi-infinity',
      'siege-side-attack': 'mdi-sword-cross',
      'siege-side-defense': 'mdi-chess-rook',
      'siege-strategy': 'mdi-strategy'
    }
  },
  theme: {
    defaultTheme: 'default',
    themes: {
      // Default Theme
      default: {
        dark: true,
        colors: {
          primary: COLORS.teal.base,
          'side-all': COLORS.blueGrey.darken1
        }
      }
    }
  }
});
