<template>
  <div id="movie-info">
    <div v-if="!isFetching && movie" class="movie-container">
      <div class="movie-cover">
        <img :src="movie.cover" width="250" alt="Poster image" />
      </div>
      <div class="movie-details">
        <div><b>Title:</b> {{ movie.title }}</div>
        <div><b>Year:</b> {{ movie.year }}</div>
        <div><b>Genres:</b> {{ movie.genres.join(', ') }}</div>
        <div><b>Description:</b> {{ movie.description }}</div>
      </div>
    </div>
    <RouterLink to="/movies">Go back</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { useFetch } from '@vueuse/core';
import { useRoute } from 'vue-router';

const route = useRoute();

const {
  data: movie,
  isFetching,
} = useFetch(`/api/movies/${route.params.id}`).get().json();

</script>

<style lang="scss" scoped>
.movie-container {
  display: flex;
  max-width: 640px;
  margin: 0 auto;

  .movie-details {
    text-align: left;
    padding: 10px;
  }
}
</style>
