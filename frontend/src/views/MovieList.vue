<template>
  <div
    class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-900 via-blue-gray-800 to-slate-800 rounded-lg shadow-xl mt-8 mb-8">
    <div class="mb-6 md:flex md:items-center md:justify-between">
      <h1 class="text-4xl font-bold text-gray-100 mb-4 md:mb-0">
        Popular Movies
      </h1>

      <div class="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
        <!-- Search -->
        <input
          v-model="search"
          type="text"
          placeholder="Search by title..."
          class="px-4 py-2 rounded-full border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-gray-600 transition w-full sm:w-auto" />

        <!-- Genre Filter -->
        <div class="relative w-full sm:w-auto">
          <select
            v-model="genreFilter"
            class="appearance-none w-full pr-10 pl-4 py-2 rounded-full border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
            <option value="">All Genres</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Sci-Fi">Sci-Fi</option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg
              class="h-4 w-4 text-gray-300"
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
        <div class="relative w-full sm:w-auto">
          <select
            v-model="typeFilter"
            class="appearance-none w-full pr-10 pl-4 py-2 rounded-full border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
            <option value="">All Types</option>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg
              class="h-4 w-4 text-gray-300"
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
        <div class="relative w-full sm:w-auto">
          <select
            v-model="sortBy"
            class="appearance-none w-full pr-10 pl-4 py-2 rounded-full border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
            <option value="">Sort By</option>
            <option value="title">Title</option>
            <option value="year">Year</option>
            <option value="type">Type</option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg
              class="h-4 w-4 text-gray-300"
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

    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <MovieCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        :isFavourite="isFavourite(item.id)"
        @toggle-favourite="toggleFavourite" />
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
}

const items = ref<Item[]>([]);
const favourites = ref<Item[]>([]);
const search = ref("");
const genreFilter = ref("");
const typeFilter = ref("");
const sortBy = ref("");

const token = localStorage.getItem("token");
const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

const fetchItems = async () => {
  const params: any = {};
  if (search.value) params.search = search.value;
  if (genreFilter.value) params.genre = genreFilter.value;
  if (typeFilter.value) params.type = typeFilter.value;
  if (sortBy.value) params.sort = sortBy.value;

  try {
    const res = await axios.get<Item[]>("http://localhost:5000/items", {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    items.value = res.data;
  } catch (err) {
    console.error("Error fetching items:", err);
  }
};

const fetchFavourites = async () => {
  try {
    const res = await axios.get<Item[]>(
      "http://localhost:5000/favourites",
      axiosConfig
    );
    favourites.value = res.data;
  } catch (err) {
    console.error("Error fetching favourites:", err);
  }
};

const isFavourite = (id: number) => favourites.value.some((f) => f.id === id);

const toggleFavourite = async (item: Item) => {
  try {
    if (isFavourite(item.id)) {
      await axios.delete(
        `http://localhost:5000/favourites/${item.id}`,
        axiosConfig
      );
      favourites.value = favourites.value.filter((f) => f.id !== item.id);
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
