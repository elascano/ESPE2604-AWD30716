<!-- src/App.vue -->

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--color-background);
  color: var(--text-primary);
}

#app {
  width: 100%;
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
}

input,
textarea,
select {
  font-family: inherit;
}
</style>
