<template>
  <div class="flex flex-col items-center justify-center h-full w-full px-4">
    <div
      class="w-full max-w-sm bg-gradient-to-br from-slate-900 via-blue-gray-800 to-slate-800 p-6 rounded-2xl shadow-xl flex-shrink-0">
    <h2 class="text-3xl font-bold mb-6 text-center text-indigo-500 flex items-center justify-center gap-2">
  <PlusIcon class="w-6 h-6" />
  Add Movie / Series
</h2>

      <form @submit.prevent="submitMovie" class="space-y-4">
        <input
          v-model="title"
          type="text"
          placeholder="Title"
          class="w-full px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-gray-100"
          required />
        <input
          v-model="year"
          type="number"
          placeholder="Year"
          class="w-full px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-gray-100"
          required />
        <input
          v-model="genre"
          type="text"
          placeholder="Genre"
          class="w-full px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-gray-100"
          required />
        <input
          v-model="image"
          type="text"
          placeholder="Image URL"
          class="w-full px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-gray-100" />
        <textarea
          v-model="description"
          placeholder="Description"
          class="w-full px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-gray-100"></textarea>

        <select
          v-model="type"
          class="w-full px-4 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-gray-100"
          required>
          <option value="">Select type</option>
          <option value="movie">Movie</option>
          <option value="series">Series</option>
        </select>

      <button
  type="submit"
  class="w-full bg-gradient-to-r from-indigo-500 to-indigo-700 text-white py-2 rounded-lg hover:from-indigo-600 hover:to-indigo-800 transition font-semibold">
  Add
</button>

      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { PlusIcon } from '@heroicons/vue/24/solid';

const title = ref("");
const year = ref<number | null>(null);
const genre = ref("");
const description = ref("");
const image = ref("");
const type = ref("");

const router = useRouter();
const toast = useToast();

// Get token from localStorage
const token = localStorage.getItem("token");
if (!token) {
  toast.error("You must be logged in to add a movie/series.");
  router.push("/login");
}

const axiosConfig = {
  headers: { Authorization: `Bearer ${token}` },
};

const submitMovie = async () => {
  try {
    await axios.post(
      "http://localhost:5000/items",
      {
        title: title.value,
        year: year.value,
        genre: genre.value,
        description: description.value,
        image: image.value,
        type: type.value,
      },
      axiosConfig
    );

    toast.success("Movie/Series added successfully!");

    // Reset form
    title.value = "";
    year.value = null;
    genre.value = "";
    description.value = "";
    image.value = "";
    type.value = "";
  } catch (err: any) {
    if (err.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      router.push("/login");
    } else {
      toast.error(err.response?.data?.message || "Failed to add movie/series.");
    }
    console.error(err);
  }
};
</script>
