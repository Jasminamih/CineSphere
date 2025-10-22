<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <nav class="bg-gray-800 shadow-lg py-3">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        
        <!-- Logo with SVG -->
        <router-link to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <!-- SVG Circle + Play Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-8 h-8 text-indigo-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
            <polygon points="10,8 16,12 10,16" fill="currentColor" />
          </svg>
          <span class="text-2xl font-bold text-indigo-400">CineSphere</span>
        </router-link>
        
        <!-- Navigation Links -->
        <div class="flex items-center gap-4">
          <router-link
            to="/"
            class="px-4 py-2 rounded-lg font-medium text-sm transition"
            :class="$route.path === '/' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-300 hover:text-white hover:bg-gray-700'"
          >
            Movies List
          </router-link>
          <router-link
            to="/add"
            class="px-4 py-2 rounded-lg font-medium text-sm transition"
            :class="$route.path === '/add' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-300 hover:text-white hover:bg-gray-700'"
          >
            Add Movie
          </router-link>
        </div>
        
      </div>
    </nav>

    <router-view />
  </div>
</template>

<script lang="tsx">
import { defineComponent } from "vue";

export default defineComponent({});
</script>
