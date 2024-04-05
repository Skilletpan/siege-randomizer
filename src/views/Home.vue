<template>
  <v-container>
    <!-- Welcome Title -->
    <v-row class="py-6 py-sm-8 py-md-10 py-lg-12">
      <v-col
        class="text-center text-h5 text-sm-h4 text-md-h3 text-lg-h2"
        tag="span"
      >
        Welcome to Siege Randomizer!
      </v-col>
    </v-row>

    <!-- Tool Tiles -->
    <v-row
      class="pb-6"
      justify="center"
    >
      <v-col
        v-for="tile, index in TILES"
        :key="index"
        v-bind="tile.sizes"
      >
        <!-- Tile -->
        <v-card :to="tile.link">
          <!-- Background Image -->
          <v-img
            :aspect-ratio="16 / 9"
            cover
            v-bind="tile.image"
          >
            <!-- Title -->
            <div class="align-center d-flex h-100 justify-center text-h3 tile-image-overlay">
              <span>{{ tile.title }}</span>
            </div>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { loadMapPreview, loadPortrait } from '@/composables/imageLoader';
import { MAP_LIST, OPERATOR_LIST } from '@/data';

const TILES = [
  // Operators Tile
  {
    image: {
      position: '100% 30%',
      src: loadPortrait(OPERATOR_LIST[Math.floor(Math.random() * OPERATOR_LIST.length)].key, true)
    },
    link: '/operators',
    sizes: {
      cols: 12,
      md: 5,
      lg: 4,
      sm: 8
    },
    title: 'Operators'
  },

  // Maps Tile
  {
    image: {
      src: loadMapPreview(MAP_LIST[Math.floor(Math.random() * MAP_LIST.length)].key)
    },
    link: '/maps',
    sizes: {
      cols: 12,
      md: 5,
      lg: 4,
      sm: 8
    },
    title: 'Maps'
  },

  // Strat Roulette Tile
  {
    link: '/strats',
    sizes: {
      cols: 12,
      md: 7,
      lg: 6,
      sm: 8
    },
    title: 'Strat Roulette'
  }
];
</script>

<style scoped>
.tile-image-overlay {
  backdrop-filter: brightness(30%) grayscale(50%);
  -webkit-backdrop-filter: brightness(30%) grayscale(50%);
}
</style>
