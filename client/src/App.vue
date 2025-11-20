<script setup>
// App.vue est le composant racine
// On n'a pas besoin d'importer les vues ici, le router s'en charge
</script>

<template>
  <div id="app">
    <!-- Le RouterView est le point où les pages/vues seront affichées -->
    <!-- HomeView, CategoryView, etc. s'afficheront ici -->
    <RouterView />
  </div>
</template>

<style>
/* Styles globaux peuvent aller ici */
</style>