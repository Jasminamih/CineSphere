<template>
  <div class="flex flex-col bg-gray-900 text-gray-100 min-h-screen">
    <Navbar />
    <main class="flex-1 flex items-center justify-center">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navbar from './components/Navbar.vue';

export default defineComponent({
  components: { Navbar },
});
</script>
