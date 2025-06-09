<template>
  <v-container fluid class="pa-6">
    <v-row align="center" justify="space-between" class="mb-6">
      <v-col>
        <h1 class="text-h4 font-weight-light">Movies</h1>
      </v-col>
      <v-col class="d-flex justify-end">
        <!-- You could add a search or filter here in the future -->
      </v-col>
    </v-row>

    <v-row dense>
      <v-col
          v-for="movie in movies"
          :key="movie._id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
      >
        <v-card elevation="1" class="pa-4">
          <v-card-title class="text-h6 font-weight-regular">
            {{ movie.title }}
          </v-card-title>
          <v-img
            :src="movie.poster"
            height="200px"
            class="mb-2"
            contain></v-img>
          <v-card-subtitle class="text-body-2 grey--text">
            {{ new Date(movie.released).getFullYear() }}
          </v-card-subtitle>
          <v-divider class="my-2" />
          <v-card-text class="text-body-2">
            {{ movie.plot }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div v-if="error" class="text-center mt-6">
      <v-alert type="error" variant="outlined">
        Error loading movies: {{ error.message }}
      </v-alert>
    </div>

    <div v-if="movies?.length === 0" class="text-center mt-6">
      <v-alert type="info" variant="outlined">
        No movies found.
      </v-alert>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import type { Movie } from '~/types/movie';

const { data: movies = [], error } = await useFetch<Movie[]>('/api/movies', {
  server: false
});
</script>

<style scoped>
/* Keep it minimal: only small tweaks */
.v-card {
  border-radius: 12px;
}
.v-card-title {
  margin-bottom: 0.25rem;
}
.v-card-subtitle {
  margin-bottom: 0.5rem;
}
</style>
