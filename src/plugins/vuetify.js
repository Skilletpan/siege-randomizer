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
