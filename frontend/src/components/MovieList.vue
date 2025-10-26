<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gray-800 rounded-lg shadow-xl mt-8 mb-8">
    <div class="mb-6 md:flex md:items-center md:justify-between">
      <h1 class="text-4xl font-bold text-gray-100 mb-4 md:mb-0">🎬 Popular Movies</h1>

    <div class="flex flex-col sm:flex-row gap-3 md:gap-4">
  <input
    v-model="search"
    type="text"
    placeholder="Search by title..."
    class="px-4 py-2 rounded-full border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 transition"
  />

  <!-- Genre Filter -->
  <div class="relative w-full sm:w-auto">
    <select
      v-model="genreFilter"
      class="appearance-none w-full pr-10 pl-4 py-2 rounded-full border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
    >
      <option value="">All Genres</option>
      <option value="Action">Action</option>
      <option value="Comedy">Comedy</option>
      <option value="Drama">Drama</option>
      <option value="Sci-Fi">Sci-Fi</option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg class="h-4 w-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </div>
  </div>

  <!-- Type Filter -->
  <div class="relative w-full sm:w-auto">
    <select
      v-model="typeFilter"
      class="appearance-none w-full pr-10 pl-4 py-2 rounded-full border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
    >
      <option value="">All Types</option>
      <option value="movie">Movie</option>
      <option value="series">Series</option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg class="h-4 w-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </div>
  </div>

  <!-- Sort Filter -->
  <div class="relative w-full sm:w-auto">
    <select
      v-model="sortBy"
      class="appearance-none w-full pr-10 pl-4 py-2 rounded-full border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
    >
      <option value="">Sort By</option>
      <option value="title">Title</option>
      <option value="year">Year</option>
      <option value="type">Type</option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg class="h-4 w-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </div>
  </div>
</div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="item in items"
        :key="item.id"
        class="bg-gray-700 rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden transform hover:-translate-y-2 flex flex-col"
      >
        <div class="relative h-56">
          <img :src="item.image" :alt="item.title" class="w-full h-full object-cover rounded-t-xl" />
          <span
            class="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold uppercase"
            :class="item.type === 'movie' ? 'bg-indigo-500 text-white' : 'bg-purple-500 text-white'"
          >
            {{ item.type }}
          </span>
          <button
            @click="toggleFavourite(item)"
            class="absolute bottom-2 right-2 text-2xl transition transform hover:scale-110"
          >
            <span v-if="isFavourite(item.id)">❤️</span>
            <span v-else>🤍</span>
          </button>
        </div>
        <div class="p-4 flex-1 flex flex-col">
          <h3 class="font-semibold text-lg mb-1 text-gray-50">{{ item.title }} ({{ item.year }})</h3>
          <p class="text-sm text-gray-400 mb-2">{{ item.genre }}</p>
          <p class="text-gray-300 text-sm flex-1">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import axios from "axios";

interface Item {
  id: number;
  type: string;
  title: string;
  year: string;
  genre: string;
  description: string;
  image: string;
}

// --- State ---
const items = ref<Item[]>([]);
const favourites = ref<Item[]>([]);
const search = ref("");
const genreFilter = ref("");
const typeFilter = ref("");
const sortBy = ref("");

// --- Auth header ---
const token = localStorage.getItem("token");
const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

// --- Fetch items ---
const fetchItems = async () => {
  const params: any = {};
  if (search.value) params.search = search.value;
  if (genreFilter.value) params.genre = genreFilter.value;
  if (typeFilter.value) params.type = typeFilter.value;
  if (sortBy.value) params.sort = sortBy.value;

  try {
    const res = await axios.get<Item[]>("http://localhost:5000/items", {
      params,
      headers: { Authorization: `Bearer ${token}` }, // ✅ Add this
    });
    items.value = res.data;
  } catch (err) {
    console.error("Error fetching items:", err);
  }
};


// --- Fetch favourites ---
const fetchFavourites = async () => {
  try {
    const res = await axios.get<Item[]>("http://localhost:5000/favourites", axiosConfig);
    favourites.value = res.data;
  } catch (err) {
    console.error("Error fetching favourites:", err);
  }
};

// --- Favourite handling ---
const isFavourite = (id: number) => favourites.value.some(f => f.id === id);

const toggleFavourite = async (item: Item) => {
  try {
    if (isFavourite(item.id)) {
      await axios.delete(`http://localhost:5000/favourites/${item.id}`, axiosConfig);
      favourites.value = favourites.value.filter(f => f.id !== item.id);
    } else {
      await axios.post("http://localhost:5000/favourites", item, axiosConfig);
      favourites.value.push(item);
    }
  } catch (err) {
    console.error("Error toggling favourite:", err);
  }
};

// --- Watchers & Lifecycle ---
watch([search, genreFilter, typeFilter, sortBy], fetchItems);
onMounted(() => {
  fetchItems();
  fetchFavourites();
});
</script>

<style scoped>
/* You can customize hover effects, transitions, or grid spacing here if needed */
</style>
