// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

const cancer = {
  dark: false,
  colors: {
    background: '#FFFDE7',
    surface: '#76FF03',
    secondary: '#9575CD'
  }
}

export default createVuetify({
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
          primary: '#607D8B',
          generic: '#607D8B',
          attacker: '#1E88E5',
          defender: '#FB8C00'
        }
      },

      cancer
    }
  }
})
