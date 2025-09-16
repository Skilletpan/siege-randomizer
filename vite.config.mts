import { fileURLToPath, URL } from 'node:url';
import Components from 'unplugin-vue-components/vite';
import ViteFonts from 'unplugin-fonts/vite';
import { defineConfig, loadEnv } from 'vite';
import Vue from '@vitejs/plugin-vue';
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

export default defineConfig(({ mode }) => {
  // Load envs
  const env = loadEnv(mode, process.cwd(), ['APP_', 'SERVER_']);

  // Set envs
  Object.assign(
    process.env,
    {
      VITE_APP_NAME: env.APP_NAME || 'Siege Randomizer',
      VITE_APP_REPOSITORY: env.APP_REPOSITORY,
      VITE_APP_VERSION: env.APP_VERSION || process.env.npm_package_version
    }
  );

  return {
    base: env.SERVER_BASE_URI || '/',
    plugins: [
      Vue({ template: { transformAssetUrls } }),
      Vuetify(),
      Components(),
      ViteFonts({
        google: {
          families: [{
            name: 'Roboto',
            styles: 'wght@100;300;400;500;700;900'
          }]
        }
      })
    ],
    define: {
      'process.env': {}
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      extensions: [
        '.js',
        '.json',
        '.jsx',
        '.mjs',
        '.ts',
        '.tsx',
        '.vue'
      ]
    },
    server: {
      port: Number(env.SERVER_PORT) || 3000
    },
    css: {
      preprocessorOptions: {
        sass: {
          api: 'modern-compiler'
        }
      }
    }
  }
});
