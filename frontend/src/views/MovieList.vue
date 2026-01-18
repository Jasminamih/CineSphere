<template>
  <div
    class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-900 via-blue-gray-800 to-slate-800 rounded-lg shadow-xl mt-8 mb-8">
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8 mb-8">
      <h2 class="text-3xl sm:text-4xl font-bold text-gray-50">
        Browse Movies & Series
      </h2>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
        <!-- Search -->
        <input
          v-model="search"
          type="text"
          placeholder="Search by title..."
          class="px-5 py-2 rounded-full border border-gray-600 bg-gray-800 text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-gray-700 transition w-full sm:w-64" />

        <!-- Genre Filter -->
        <div class="relative w-full sm:w-48">
          <select
            v-model="genreFilter"
            aria-label="Genre"
            class="appearance-none w-full px-4 py-2 rounded-full border border-gray-600 bg-gray-800 text-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-gray-700 transition">
            <option value="">All Genres</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Sci-Fi">Sci-Fi</option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg
              class="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <!-- Type Filter -->
        <div class="relative w-full sm:w-40">
          <select
            v-model="typeFilter"
            aria-label="Type"
            class="appearance-none w-full px-4 py-2 rounded-full border border-gray-600 bg-gray-800 text-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-gray-700 transition">
            <option value="">All Types</option>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg
              class="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <!-- Sort Filter -->
        <div class="relative w-full sm:w-40">
          <select
            aria-label="Sort By"
            v-model="sortBy"
            class="appearance-none w-full px-4 py-2 rounded-full border border-gray-600 bg-gray-800 text-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-gray-700 transition">
            <option value="">Sort By</option>
            <option value="title">Title</option>
            <option value="year">Year</option>
            <option value="type">Type</option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg
              class="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Movie grid -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <template v-if="items.length > 0">
        <MovieCard
          v-for="(item, index) in items"
          :key="item.id"
          :item="item"
          :isFavourite="isFavourite(item.id)"
          :loading="index === 0 ? 'eager' : 'lazy'"
          :is-first="index === 0"
          @toggle-favourite="toggleFavourite" />
      </template>

      <div v-else class="col-span-full text-center text-gray-300 text-lg py-10">
        Oops! No movies found. Try a different title, genre, or type.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import MovieCard from "@/components/MovieCard.vue";

interface Item {
  id: number;
  type: string;
  title: string;
  year: string;
  genre: string;
  description: string;
  image: string;
  order_index: number;
}

const items = ref<Item[]>([]);
const favourites = ref<Item[]>([]);
const search = ref("");
const genreFilter = ref("");
const typeFilter = ref("");
const sortBy = ref("");

const token = localStorage.getItem("token");
const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

const API_URL = import.meta.env.VITE_API_URL;
const initialItems = ref<Item[]>([]);
const remainingItems = ref<Item[]>([]);
const isLoadingRest = ref(false);

const fetchItems = async () => {
  const params: any = {};
  if (search.value) params.search = search.value;
  if (genreFilter.value) params.genre = genreFilter.value;
  if (typeFilter.value) params.type = typeFilter.value;
  if (sortBy.value) params.sort = sortBy.value;

  try {
    // Step 1: fetch first 4 movies
    const resFirst = await axios.get<Item[]>(`${API_URL}/items`, {
      params: { ...params, limit: 4 },
      headers: { Authorization: `Bearer ${token}` },
    });
    initialItems.value = resFirst.data;
    items.value = [...initialItems.value];

    // Step 2: fetch remaining movies in background
    isLoadingRest.value = true;
    const resRest = await axios.get<Item[]>(`${API_URL}/items`, {
      params: { ...params, offset: 4 },
      headers: { Authorization: `Bearer ${token}` },
    });
    remainingItems.value = resRest.data;
    items.value = [...initialItems.value, ...remainingItems.value];
    isLoadingRest.value = false;
  } catch (err) {
    console.error("Error fetching items:", err);
  }
};

const fetchFavourites = async () => {
  if (!token) return; 

  try {
    const res = await axios.get<Item[]>(`${API_URL}/favourites`, axiosConfig);
    favourites.value = res.data;
  } catch (err) {
    console.error("Error fetching favourites:", err);
  }
};

const isFavourite = (id: number) => favourites.value.some((f) => f.id === id);

const toggleFavourite = async (item: Item) => {
  try {
    if (isFavourite(item.id)) {
      await axios.delete(`${API_URL}/favourites/${item.id}`, axiosConfig);
      favourites.value = favourites.value.filter((f) => f.id !== item.id);
    } else {
      await axios.post(`${API_URL}/favourites`, item, axiosConfig);
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
