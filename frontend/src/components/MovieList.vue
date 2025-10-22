<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gray-800 rounded-lg shadow-xl mt-8 mb-8">

    <!-- Header -->
    <div class="mb-6 md:flex md:items-center md:justify-between">
      <h1 class="text-4xl font-bold text-gray-100 mb-4 md:mb-0">🎬 Popular Movies</h1>

      <!-- Filters & Search -->
     <div class="flex flex-col sm:flex-row gap-3 md:gap-4">
  <!-- Search -->
  <input
    v-model="search"
    type="text"
    placeholder="Search by title..."
    class="px-4 py-2 rounded-full border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 transition"
  />

  <!-- Genre Filter -->
  <select
    v-model="genreFilter"
    class="px-4 py-2 rounded-full border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
  >
    <option value="">All Genres</option>
    <option value="Action">Action</option>
    <option value="Comedy">Comedy</option>
    <option value="Drama">Drama</option>
    <option value="Sci-Fi">Sci-Fi</option>
  </select>

  <!-- Type Filter -->
  <select
    v-model="typeFilter"
    class="px-4 py-2 rounded-full border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
  >
    <option value="">All Types</option>
    <option value="movie">Movie</option>
    <option value="series">Series</option>
  </select>

  <!-- Sort -->
  <select
    v-model="sortBy"
    class="px-4 py-2 rounded-full border border-gray-600 bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
  >
    <option value="">Sort By</option>
    <option value="title">Title</option>
    <option value="year">Year</option>
    <option value="type">Type</option>
  </select>
</div>
    </div>

    <!-- Movies Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="item in sortedItems"
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

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import axios from "axios";

interface Item {
  id: number;
  type: string;
  title: string;
  year: number;
  genre: string;
  description: string;
  image: string;
}

export default defineComponent({
  name: "MoviesList",
  setup() {
    const items = ref<Item[]>([]);
    const search = ref("");
    const genreFilter = ref("");
    const typeFilter = ref("");
    const sortBy = ref("");

    // Fetch data
    const fetchItems = async () => {
      try {
        const res = await axios.get<Item[]>("http://localhost:5000/items");
        items.value = res.data;
      } catch (err) {
        console.error(err);
      }
    };

    onMounted(fetchItems);

    // Filtered + sorted items
const filteredItems = computed(() => {
  return items.value.filter(item =>
    item.title.toLowerCase().includes(search.value.toLowerCase()) &&
    (typeFilter.value === "" || item.type.toLowerCase() === typeFilter.value.toLowerCase()) &&
    (genreFilter.value === "" || item.genre.toLowerCase().includes(genreFilter.value.toLowerCase()))
  );
});


    const sortedItems = computed(() => {
      return [...filteredItems.value].sort((a, b) => {
        if (!sortBy.value) return 0;
if (sortBy.value === "year") return a.year - b.year;
return a[sortBy.value as keyof Item].toString().localeCompare(b[sortBy.value as keyof Item].toString());
      });
    });

    return { items, search, genreFilter, typeFilter, sortBy, sortedItems };
  },
});
</script>
