// Styles
import { createVuetify } from 'vuetify';
import { VAvatar } from 'vuetify/lib/components/index.mjs';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

const defaultInputProps = {
  clearable: true,
  density: 'comfortable',
  hideDetails: true,
  persistentPlaceholder: true,
  variant: 'solo-filled'
};

const defaultSelectProps = {
  ...defaultInputProps,
  itemTitle: 'name',
  itemValue: 'key',
  placeholder: 'Select...'
};

export default createVuetify({
  aliases: {
    OperatorEmblem: VAvatar,
    SquadEmblem: VAvatar
  },

  defaults: {
    OperatorEmblem: {
      icon: 'mdi-help',
      rounded: 0
    },
    SquadEmblem: {
      rounded: 0,
      size: 'small'
    },
    VAutocomplete: defaultSelectProps,
    VCombobox: defaultSelectProps,
    VSelect: defaultSelectProps,
    VSwitch: defaultInputProps,
    VTextField: defaultInputProps
  },

  icons: {
    aliases: {
      delete: 'mdi-delete',
      filter: 'mdi-filter',
      map: 'mdi-warehouse',
      operator: 'mdi-account',
      'operator-ban': 'mdi-account-off',
      'operator-health': 'mdi-hospital-box-outline',
      'operator-speed': 'mdi-speedometer',
      'player-recent': 'mdi-history',
      randomize: 'mdi-dice-multiple-outline',
      settings: 'mdi-cog',
      'side-all': 'mdi-infinity',
      'side-attack': 'mdi-sword-cross',
      'side-defense': 'mdi-chess-rook',
      squad: 'mdi-account-group',
      strategy: 'mdi-strategy'
    }
  },

  theme: {
    defaultTheme: 'default',
    themes: {
      default: {
        dark: true,
        colors: {
          background: '#37474F',
          surface: '#263238',
          primary: '#42A5F5',
          generic: '#607D8B',
          attacker: '#1E88E5',
          defender: '#FB8C00'
        }
      },

      dark: {
        dark: true,
        colors: {
          generic: '#607D8B',
          attacker: '#1E88E5',
          defender: '#FB8C00'
        }
      }
    }
  }
});
