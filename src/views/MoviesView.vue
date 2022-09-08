<template>
  <div id="movies_list">
    <h2>Movies list</h2>
    <div v-if="!isFetching">
      <div v-for="movie in movies" v-bind:key="movie.id">
        <RouterLink :to="`/movies/${movie.id}`">{{ movie.title }}</RouterLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useFetch } from '@vueuse/core';

const { isFetching, data: movies } = useFetch('/api/movies').get().json();
</script>
